import os
from pathlib import Path
from groq import Groq
from hopprai import HOPPR
from django.conf import settings

from .triage import TriageAgent
from .model_runner import ModelRunner
from .vlm import VLMAgent
from .report_gen import ReportGenerator, PatientSummaryGenerator

class Orchestrator:
    def __init__(self):
        self.hoppr = HOPPR(settings.HOPPR_API_KEY)
        self.groq = Groq(api_key=settings.GROQ_API_KEY)
        
        self.triage = TriageAgent(self.groq)
        self.runner = ModelRunner(self.hoppr)
        self.vlm = VLMAgent(self.hoppr)
        self.reporter = ReportGenerator(self.groq)
        self.patient_summary = PatientSummaryGenerator(self.groq)
    
    def upload_dicom(self, file_path: str) -> str:
        try:
            study = self.hoppr.create_study(Path(file_path).stem)
            with open(file_path, 'rb') as f:
                self.hoppr.add_study_image(study.id, Path(file_path).stem, f.read())
            return study.id
        except Exception as e:
            raise Exception(f"Upload failed: {str(e)}")
    
    async def analyze(self, dicom_path: str, patient_history: str, visit_reason: str) -> dict:
        hoppr_study_id = self.upload_dicom(dicom_path)
        context = {'history': patient_history, 'reason': visit_reason}

        print(f"Orchestrator: Starting analysis for study {hoppr_study_id}", flush=True)
        print(f"Orchestrator: Patient history - {patient_history}", flush=True)
        print(f"Orchestrator: Visit reason - {visit_reason}", flush=True)
        print("Orchestrator: Running triage...", flush=True) 
        # Phase 1: Triage
        strategy = self.triage.plan_strategy(patient_history, visit_reason)
        urgency = strategy['urgency']
        print(f"Orchestrator: Triage completed. Urgency - {urgency}, Priority Systems - {strategy['priority_systems']}", flush=True)
        # Phase 2: Run models
        all_findings = {}
        workflow_log = {'strategy': strategy, 'phases': []}
        
        from .config import ALL_MODELS
        
        for system in strategy['priority_systems']:
            system_models = ALL_MODELS.get(system, {})
            system_findings = self.runner.run_models(hoppr_study_id, system_models, urgency)
            all_findings.update(system_findings)
            
            workflow_log['phases'].append({
                'system': system,
                'findings_count': len([f for f in system_findings.values() if f['present']])
            })
            
            # Early stopping
            critical = [n for n, d in system_findings.items() if d['score'] > 0.75]
            if critical and urgency in ["critical", "high"]:
                workflow_log['early_stop'] = True
                break
        print("Orchestrator: Model execution completed.", flush=True)
        # Phase 3: Decision
        action = self.triage.decide_next_action(all_findings, urgency)
        workflow_log['action'] = action
        print(f"Orchestrator: Decision made - {action}", flush=True)
        # Phase 4: VLM
        if action == "ESCALATE":
            vlm_text = "VLM skipped - emergency protocol"
            workflow_log['vlm_skipped'] = True
        else:
            focus = ', '.join([n for n, d in all_findings.items() if d['score'] > 0.5])
            vlm_text = self.vlm.analyze(hoppr_study_id, focus if focus else None)
            workflow_log['vlm_skipped'] = False
        print("Orchestrator: VLM analysis completed.", flush=True)
        # Phase 5: Reports
        if action == "ESCALATE":
            clinical_report = self.reporter.generate_emergency(all_findings, context)
            status = 'escalated'
        else:
            clinical_report = self.reporter.generate(all_findings, vlm_text, context, urgency, action)
            status = 'completed'
        print("Orchestrator: Report generation completed.", flush=True)
        # Phase 6: Patient summary
        patient_summary = self.patient_summary.generate_patient_summary(
            all_findings, urgency, action, clinical_report
        )
        print("Orchestrator: Patient summary generation completed.", flush=True)
        return {
            'hoppr_study_id': hoppr_study_id,
            'status': status,
            'urgency': urgency,
            'action': action,
            'clinical_report': clinical_report,
            'patient_summary': patient_summary,
            'findings': all_findings,
            'workflow_log': workflow_log
        }