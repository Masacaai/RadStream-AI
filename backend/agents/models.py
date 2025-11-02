from django.db import models
import uuid

class Study(models.Model):
    STATUS_CHOICES = [
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('escalated', 'Escalated'),
    ]
    
    URGENCY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('moderate', 'Moderate'),
        ('low', 'Low'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hoppr_study_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    # Input
    dicom_file = models.FileField(upload_to='dicoms/')
    patient_history = models.TextField()
    visit_reason = models.TextField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploaded')
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, null=True, blank=True)
    
    # Output
    clinical_report = models.TextField(blank=True, null=True)
    patient_summary = models.TextField(blank=True, null=True)
    findings_json = models.JSONField(default=dict, blank=True)
    workflow_log = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Study {self.id} - {self.status}"


class Finding(models.Model):
    study = models.ForeignKey(Study, on_delete=models.CASCADE, related_name='findings')
    
    finding_name = models.CharField(max_length=255)
    model_id = models.CharField(max_length=255)
    score = models.FloatField()
    threshold_used = models.FloatField()
    is_present = models.BooleanField()
    confidence_level = models.CharField(max_length=20)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-score']
    
    def __str__(self):
        return f"{self.finding_name}: {self.score:.2f}"