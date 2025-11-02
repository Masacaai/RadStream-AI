from django.utils import timezone
import asyncio

from .models import Study, Finding
from .main.orchestrator import Orchestrator

def process_study(study_id: str):
    """
    Synchronous version for threading - same logic as Celery task
    """
    try:
        study = Study.objects.get(id=study_id)
        study.status = 'processing'
        study.save()
        
        # Run analysis
        orchestrator = Orchestrator()
        dicom_path = study.dicom_file.path
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        result = loop.run_until_complete(
            orchestrator.analyze(
                dicom_path=dicom_path,
                patient_history=study.patient_history,
                visit_reason=study.visit_reason
            )
        )
        
        loop.close()
        
        # Save results
        study.hoppr_study_id = result['hoppr_study_id']
        study.status = result['status']
        study.urgency = result['urgency']
        study.clinical_report = result['clinical_report']
        study.patient_summary = result['patient_summary']
        study.findings_json = result['findings']
        study.workflow_log = result['workflow_log']
        study.processed_at = timezone.now()
        study.save()
        
        # Create Finding objects
        for finding_name, finding_data in result['findings'].items():
            Finding.objects.create(
                study=study,
                finding_name=finding_name,
                model_id=finding_data.get('model_id', ''),
                score=finding_data['score'],
                threshold_used=finding_data.get('threshold_used', 0.5),
                is_present=finding_data['present'],
                confidence_level=finding_data.get('confidence', 'UNKNOWN')
            )
        
        return {'status': 'success', 'study_id': str(study.id)}
        
    except Exception as e:
        study = Study.objects.get(id=study_id)
        study.status = 'failed'
        study.workflow_log = {'error': str(e)}
        study.save()
        
        return {'status': 'error', 'message': str(e)}