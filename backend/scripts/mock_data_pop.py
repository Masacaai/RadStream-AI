import random
from datetime import date
from faker import Faker
from core.models import (
    Patient, Radiologist, PrimaryCareProvider, Scan, AIResult, Report
)
from django.contrib.auth.models import User

fake = Faker()

rad_user = User.objects.create_user(username="ammar", password="pass1234")
pcp_user = User.objects.create_user(username="aaqel", password="pass1234")

radiologist = Radiologist.objects.create(
    user=rad_user,
    full_name="Ammar Bhavnagri",
    email="ammar@gmail.com",
    password="pass1234",
    license_number="RAD-2025-001",
    hospital_affiliation="Hoppr General Hospital"
)

pcp = PrimaryCareProvider.objects.create(
    user=pcp_user,
    full_name="Aaqel Shaik",
    email="aaqel@gmail.com",
    password="pass1234",
    clinic_name="Downtown Medical Clinic",
    contact_info={"phone": "+1-555-987-6543", "address": "42 Bridge St, NY"}
)

imgs = {
    "Aortic_enlargement": ["144b76b191aa1e02065903ee1cc3d578.dcm"],
    "Atelectasis": ["0b1b897b1e1e170f1b5fd7aeff553afa.dcm"],
    "Calcification": [
        "07d82e7e5749cbc21633134f489a7fbf.dcm",
        "17dc4a83558d835efd5f7d6f110f07f3.dcm",
        "c341b3f8a0353bab2ec49147b97ce9d0.dcm"
    ],
    "Cardiomegaly": ["2c3979232fe659fb46d4ca12263e75d0.dcm"],
    "Consolidation": ["de7c0acddd7ed5fb90f5f5e12458235b.dcm"],
    "ILD": ["23f29ee2101fa421afeb84cf923ee9b6.dcm"],
    "Infiltration": ["a6bcb9f5d59588d699c5aa83cd3039c7.dcm"],
    "Lung_Opacity": ["4fa30afdf5d4bbfcfd9071e2a56e7a4b.dcm"],
    "Normal": [
        "0a212b35778c1bce896d4574124c6441.dcm",
        "0a8d69d1c45bece901929db269a5e6cf.dcm",
        "0a8df2eb98d3c1cec5200c9b2a6132f2.dcm"
    ],
    "Pleural_effusion": ["f3b2d71af1014019e7639088a255e13f.dcm"],
    "Pleural_thickening": ["326f5799de625f4fddd67b9c7827bfe5.dcm"],
    "Pneumothorax": ["afa4de6570c31504ba4b77978377ccc9.dcm"],
    "Pulmonary_fibrosis": ["58c96358e94c768b0eeb723bf985d575.dcm"]
}


def random_scan_file():
    key = random.choice(list(imgs.keys()))
    file_name = random.choice(imgs[key])
    return key, file_name

for i in range(48):
    user = User.objects.create_user(username=f"user{i}", password="pass1234")
    patient = Patient.objects.create(
        user=user,
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        email=fake.email(),
        password="pass1234",
        dob=fake.date_of_birth(minimum_age=20, maximum_age=80),
        sex=random.choice(["M", "F"]),
        medical_history=fake.paragraph(nb_sentences=3),
    )

    # Create a scan for each
    condition, file_name = random_scan_file()
    scan = Scan.objects.create(
        patient=patient,
        scan_type="CT",
        image_file=f"sample_images/{file_name}",
        referring_provider=pcp,
        analyzed_by_radiologist=random.choice([True, False]),
        viewed_by_pcp=False,
    )

    # If analyzed, make AI result + report
    if scan.analyzed_by_radiologist:
        ai_result = AIResult.objects.create(
            scan=scan,
            findings_text=f"Findings suggest {condition.lower()}",
            findings_json={"condition": condition}
        )
        Report.objects.create(
            patient=patient,
            radiologist=radiologist,
            pcp=pcp,
            scan=scan,
            ai_result=ai_result,
            report_text=f"Radiologist report for {condition}. Recommended follow-up.",
        )


abdul_user = User.objects.create_user(username="abdul", password="pass1234")
abdul = Patient.objects.create(
    user=abdul_user,
    first_name="Abdul",
    last_name="Rahman",
    email="abdul@gmail.com",
    password="pass1234",
    dob=date(1992, 5, 15),
    sex="M",
    medical_history="History of mild hypertension and asthma. Non-smoker.",
)

for _ in range(2):
    condition, file_name = random_scan_file()
    scan = Scan.objects.create(
        patient=abdul,
        scan_type="MRI",
        image_file=f"sample_images/{file_name}",
        referring_provider=pcp,
        analyzed_by_radiologist=True,
        viewed_by_pcp=True,
    )
    ai_result = AIResult.objects.create(
        scan=scan,
        findings_text=f"Findings indicate {condition.lower()}",
        findings_json={"condition": condition}
    )
    Report.objects.create(
        patient=abdul,
        radiologist=radiologist,
        pcp=pcp,
        scan=scan,
        ai_result=ai_result,
        report_text=f"Detailed MRI report on {condition}. No urgent abnormalities.",
    )
