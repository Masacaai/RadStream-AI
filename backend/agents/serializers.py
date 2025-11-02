from rest_framework import serializers
from .models import Study, Finding

class FindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finding
        fields = ['id', 'finding_name', 'score', 'threshold_used', 
                  'is_present', 'confidence_level', 'created_at']


class StudySerializer(serializers.ModelSerializer):
    findings = FindingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Study
        fields = ['id', 'hoppr_study_id', 'patient_history', 'visit_reason',
                  'status', 'urgency', 'clinical_report', 'patient_summary',
                  'findings', 'findings_json', 'workflow_log', 
                  'created_at', 'updated_at', 'processed_at']
        read_only_fields = ['id', 'hoppr_study_id', 'status', 'urgency', 
                           'clinical_report', 'patient_summary', 'findings_json',
                           'workflow_log', 'created_at', 'updated_at', 'processed_at']


class StudyCreateSerializer(serializers.ModelSerializer):
    dicom_file = serializers.FileField()
    
    class Meta:
        model = Study
        fields = ['patient_history', 'visit_reason', 'dicom_file']
    
    def create(self, validated_data):
        study = Study.objects.create(**validated_data)
        from .tasks import process_study
        process_study.delay(str(study.id))
        return study


class StudyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Study
        fields = ['id', 'status', 'urgency', 'patient_history', 
                  'visit_reason', 'created_at', 'updated_at']