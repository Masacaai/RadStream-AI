from django.db import models
from django.contrib.auth.models import User

imgs = {
    "Aortic_enlargement": ["144b76b191aa1e02065903ee1cc3d578.dcm"],
    "Atelectasis": ["0b1b897b1e1e170f1b5fd7aeff553afa.dcm"],
    "Calcification": ["07d82e7e5749cbc21633134f489a7fbf.dcm", "17dc4a83558d835efd5f7d6f110f07f3.dcm", "c341b3f8a0353bab2ec49147b97ce9d0.dcm"],
    "Cardiomegaly": ["2c3979232fe659fb46d4ca12263e75d0.dcm"],
    "Consolidation": ["de7c0acddd7ed5fb90f5f5e12458235b.dcm"],
    "ILD": ["23f29ee2101fa421afeb84cf923ee9b6.dcm"],
    "Infiltration": ["a6bcb9f5d59588d699c5aa83cd3039c7.dcm"],
    "Lung_Opacity": ["4fa30afdf5d4bbfcfd9071e2a56e7a4b.dcm"],
    "Normal": ["0a212b35778c1bce896d4574124c6441.dcm", "0a8d69d1c45bece901929db269a5e6cf.dcm", "0a8df2eb98d3c1cec5200c9b2a6132f2.dcm"],
    "Pleural_effusion": ["f3b2d71af1014019e7639088a255e13f.dcm"],
    "Pleural_thickening": ["326f5799de625f4fddd67b9c7827bfe5.dcm"],
    "Pneumothorax": ["afa4de6570c31504ba4b77978377ccc9.dcm"],
    "Pulmonary_fibrosis":  ["58c96358e94c768b0eeb723bf985d575.dcm"]
}
class Data(models.Model):
    id = models.AutoField(primary_key=True)
    patient_name = models.CharField(max_length=200)
    patient_history = models.TextField()
    patient_visit_reason = models.TextField()
    associated_dcm_image = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Patient Scan Record"
        verbose_name_plural = "Patient Scan Records"
        ordering = ['id']

    def __str__(self):
        return f"{self.patient_name} - {self.associated_dcm_image}" # ignore

"""
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True) 
    password = models.CharField(max_length=128) 
    dob = models.DateField()
    sex = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female')])
    medical_history = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Radiologist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)  
    password = models.CharField(max_length=128)  
    license_number = models.CharField(max_length=50)
    hospital_affiliation = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.full_name


class PrimaryCareProvider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)  
    password = models.CharField(max_length=128) 
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
    # uploaded_at = models.DateTimeField(auto_now_add=True)
    image_file = models.FileField(upload_to='scans/')
    metadata = models.JSONField(default=dict, blank=True)
    visit = models.ForeignKey(Visit, on_delete=models.SET_NULL, null=True, blank=True)

    analyzed_by_radiologist = models.BooleanField(default=False)
    viewed_by_pcp = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.scan_type} for {self.patient} ({self.uploaded_at.date()})"


class AIResult(models.Model):
    scan = models.OneToOneField(Scan, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    findings_text = models.TextField()
    findings_json = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"AI - Findings for {self.scan}"


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
"""