from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField()
    sex = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    medical_history = models.TextField(blank=True)
    # allergies = models.TextField(blank=True)
    # contact_info = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Radiologist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    license_number = models.CharField(max_length=50)
    # specialization = models.CharField(max_length=200, blank=True)
    hospital_affiliation = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return self.full_name


class PrimaryCareProvider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    clinic_name = models.CharField(max_length=200, blank=True)
    contact_info = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return self.full_name


class Visit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    visit_date = models.DateTimeField(auto_now_add=True)
    reason_for_visit = models.TextField(blank=True)
    referring_provider = models.ForeignKey(PrimaryCareProvider, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Visit for {self.patient} on {self.visit_date}"


class Scan(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    scan_type = models.CharField(max_length=100, choices=[
        ('CT', 'CT'),
        ('MRI', 'MRI'),
        ('XRay', 'X-Ray'),
        ('Ultrasound', 'Ultrasound'),
    ])
    image_file = models.FileField(upload_to='scans/')
    metadata = models.JSONField(default=dict, blank=True)
    visit = models.ForeignKey(Visit, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.scan_type} for {self.patient} ({self.uploaded_at.date()})"


class AIResult(models.Model):
    scan = models.OneToOneField(Scan, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    findings_text = models.TextField()
    findings_json = models.JSONField(default=dict, blank=True)
    # model_version = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return f"AI Findings for {self.scan}"


class Report(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    radiologist = models.ForeignKey(Radiologist, on_delete=models.SET_NULL, null=True)
    pcp = models.ForeignKey(PrimaryCareProvider, on_delete=models.SET_NULL, null=True, blank=True)
    scan = models.ForeignKey(Scan, on_delete=models.CASCADE)
    ai_result = models.OneToOneField(AIResult, on_delete=models.SET_NULL, null=True, blank=True)
    report_text = models.TextField()
    pdf_file = models.FileField(upload_to='reports/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Report for {self.patient} ({self.created_at.date()})"
