from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Study, Finding
from .serializers import (
    StudySerializer, 
    StudyListSerializer, 
    StudyCreateSerializer,
    FindingSerializer
)

class StudyViewSet(viewsets.ModelViewSet):
    queryset = Study.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StudyListSerializer
        elif self.action == 'create':
            return StudyCreateSerializer
        return StudySerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        study = serializer.save()
        
        return Response(
            StudySerializer(study).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['get'])
    def clinical_report(self, request, pk=None):
        study = self.get_object()
        
        if study.status not in ['completed', 'escalated']:
            return Response(
                {'error': f'Report not ready. Status: {study.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'study_id': study.id,
            'urgency': study.urgency,
            'clinical_report': study.clinical_report,
            'processed_at': study.processed_at
        })
    
    @action(detail=True, methods=['get'])
    def patient_summary(self, request, pk=None):
        study = self.get_object()
        
        if study.status not in ['completed', 'escalated']:
            return Response(
                {'error': f'Summary not ready. Status: {study.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'study_id': study.id,
            'urgency': study.urgency,
            'patient_summary': study.patient_summary,
            'processed_at': study.processed_at
        })
    
    @action(detail=True, methods=['get'])
    def status_check(self, request, pk=None):
        """
        Check processing status with detailed workflow information
        
        GET /api/studies/{id}/status_check/
        """
        study = self.get_object()
        
        # Base response
        response_data = {
            'study_id': study.id,
            'status': study.status,
            'urgency': study.urgency,
            'created_at': study.created_at,
            'updated_at': study.updated_at,
            'processed_at': study.processed_at,
        }
        
        # Add workflow details if available
        if study.workflow_log:
            response_data['workflow'] = {
                'strategy': study.workflow_log.get('strategy', {}),
                'phases': study.workflow_log.get('phases', []),
                'action': study.workflow_log.get('action'),
                'early_stop': study.workflow_log.get('early_stop', False),
                'vlm_skipped': study.workflow_log.get('vlm_skipped', False),
            }
        
        # Add findings summary
        findings = study.findings.all()
        if findings.exists():
            response_data['findings_summary'] = {
                'total': findings.count(),
                'positive': findings.filter(is_present=True).count(),
                'critical': findings.filter(score__gte=0.75).count(),
                'top_findings': [
                    {
                        'name': f.finding_name,
                        'score': f.score,
                        'present': f.is_present
                    }
                    for f in findings[:5]  # Top 5
                ]
            }
        
        return Response(response_data) 
    
    @action(detail=True, methods=['get'])
    def workflow(self, request, pk=None):
        """
        Get detailed step-by-step workflow execution
        
        GET /api/studies/{id}/workflow/
        """
        study = self.get_object()
        
        if not study.workflow_log:
            return Response(
                {'error': 'No workflow data available yet'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        workflow = study.workflow_log
        
        # Format as a narrative
        steps = []
        
        # Step 1: Triage
        if 'strategy' in workflow:
            strategy = workflow['strategy']
            steps.append({
                'step': 1,
                'phase': 'Triage & Planning',
                'description': f"Analyzed patient case and determined {strategy.get('urgency', 'unknown')} urgency",
                'details': {
                    'urgency': strategy.get('urgency'),
                    'priority_systems': strategy.get('priority_systems', []),
                    'reasoning': strategy.get('reasoning', 'N/A')
                }
            })
        
        # Step 2: Model Execution
        if 'phases' in workflow:
            for idx, phase in enumerate(workflow['phases'], start=2):
                steps.append({
                    'step': idx,
                    'phase': f"Analyzing {phase.get('system', 'Unknown')} System",
                    'description': f"Ran models on {phase.get('system')} system, found {phase.get('findings_count', 0)} positive findings",
                    'details': phase
                })
        
        # Step 3: Decision Making
        if 'action' in workflow:
            steps.append({
                'step': len(steps) + 1,
                'phase': 'Decision Making',
                'description': f"Determined action: {workflow.get('action')}",
                'details': {
                    'action': workflow.get('action'),
                    'early_stop': workflow.get('early_stop', False)
                }
            })
        
        # Step 4: VLM Analysis
        vlm_step = len(steps) + 1
        if workflow.get('vlm_skipped'):
            steps.append({
                'step': vlm_step,
                'phase': 'Visual Analysis',
                'description': 'Skipped VLM analysis due to emergency protocol',
                'details': {'skipped': True, 'reason': 'Emergency escalation'}
            })
        else:
            steps.append({
                'step': vlm_step,
                'phase': 'Visual Analysis',
                'description': 'Performed detailed visual analysis of imaging',
                'details': {'skipped': False}
            })
        
        # Step 5: Report Generation
        steps.append({
            'step': len(steps) + 1,
            'phase': 'Report Generation',
            'description': f"Generated {study.status} report with {study.urgency} urgency",
            'details': {
                'status': study.status,
                'urgency': study.urgency,
                'findings_count': study.findings.count()
            }
        })
        
        return Response({
            'study_id': study.id,
            'status': study.status,
            'total_steps': len(steps),
            'workflow_steps': steps,
            'raw_log': workflow
        })

    @action(detail=True, methods=['get'])
    def findings(self, request, pk=None):
        study = self.get_object()
        findings = study.findings.all()
        serializer = FindingSerializer(findings, many=True)
        
        return Response({
            'study_id': study.id,
            'findings': serializer.data
        })