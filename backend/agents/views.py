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
        study = self.get_object()
        
        return Response({
            'study_id': study.id,
            'status': study.status,
            'urgency': study.urgency,
            'created_at': study.created_at,
            'updated_at': study.updated_at,
            'processed_at': study.processed_at
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