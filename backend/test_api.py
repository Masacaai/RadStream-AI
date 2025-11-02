import requests
import time

# 1. Upload
print("📤 Uploading study...")
response = requests.post('http://localhost:8000/api/studies/', 
    files={'dicom_file': open('../data/Aortic_enlargement/train/144b76b191aa1e02065903ee1cc3d578.dcm', 'rb')},
    data={
        'patient_history': '62yo male, smoker, COPD',
        'visit_reason': 'SOB, chest pain'
    }
)

# DEBUG: Print what we actually got
print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.text}")

if response.status_code != 201:
    print(f"❌ Upload failed!")
    exit(1)

study_id = response.json()['id']
print(f"✅ Study created: {study_id}")

# 2. Poll for completion
print("\n⏳ Processing...")
while True:
    status_response = requests.get(f'http://localhost:8000/api/studies/{study_id}/status_check/')
    status = status_response.json()['status']
    
    print(f"   Status: {status}")
    
    if status in ['completed', 'escalated', 'failed']:
        break
    
    time.sleep(2)

# 3. Get results
print("\n📋 Results:")
clinical = requests.get(f'http://localhost:8000/api/studies/{study_id}/clinical_report/').json()
patient = requests.get(f'http://localhost:8000/api/studies/{study_id}/patient_summary/').json()

print("\n🏥 Clinical Report:")
print(clinical['clinical_report'][:200] + "...")

print("\n👤 Patient Summary:")
print(patient['patient_summary'][:200] + "...")

print("\n✨ Done!")