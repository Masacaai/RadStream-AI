from django.contrib import admin
from .models import Study, Finding

@admin.register(Study)
class StudyAdmin(admin.ModelAdmin):
    list_display = ['id', 'status', 'urgency', 'created_at', 'processed_at']
    list_filter = ['status', 'urgency', 'created_at']
    search_fields = ['id', 'hoppr_study_id', 'patient_history']
    readonly_fields = ['id', 'hoppr_study_id', 'created_at', 'updated_at', 'processed_at']

@admin.register(Finding)
class FindingAdmin(admin.ModelAdmin):
    list_display = ['finding_name', 'score', 'is_present', 'study', 'created_at']
    list_filter = ['is_present', 'confidence_level', 'created_at']
    search_fields = ['finding_name', 'study__id']