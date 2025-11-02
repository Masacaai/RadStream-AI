import requests
import time
import json

def print_workflow_step(step):
    """Pretty print a workflow step"""
    print(f"\n{'='*60}")
    print(f"STEP {step['step']}: {step['phase']}")
    print(f"{'='*60}")
    print(f"📝 {step['description']}")
    if step.get('details'):
        print(f"🔍 Details: {json.dumps(step['details'], indent=2)}")

# Upload study
print("📤 Uploading study...")
response = requests.post('http://localhost:8000/api/studies/', 
    files={'dicom_file': open('../data/Aortic_enlargement/train/144b76b191aa1e02065903ee1cc3d578.dcm', 'rb')},
    data={
        'patient_history': '62yo male, smoker, COPD',
        'visit_reason': 'SOB, chest pain'
    }
)

if response.status_code != 201:
    print(f"❌ Failed: {response.text}")
    exit(1)

study_id = response.json()['id']
print(f"✅ Study created: {study_id}")
print("\n⏳ Processing in background...\n")

# Poll with live updates
last_update = None
while True:
    # Get status
    status_response = requests.get(f'http://localhost:8000/api/studies/{study_id}/status_check/')
    data = status_response.json()
    
    status_val = data['status']
    print(f"📊 Status: {status_val}", end='')
    
    # Show workflow progress
    if 'workflow' in data:
        workflow = data['workflow']
        if workflow != last_update:
            print("\n")
            
            # Show urgency
            if workflow.get('strategy'):
                print(f"🚨 Urgency: {workflow['strategy'].get('urgency', 'N/A')}")
                print(f"🎯 Priority Systems: {', '.join(workflow['strategy'].get('priority_systems', []))}")
            
            # Show phases completed
            if workflow.get('phases'):
                print(f"\n✅ Completed Phases:")
                for phase in workflow['phases']:
                    print(f"   - {phase.get('system')}: {phase.get('findings_count')} findings")
            
            # Show decision
            if workflow.get('action'):
                action_emoji = '🚨' if workflow['action'] == 'ESCALATE' else '✅'
                print(f"\n{action_emoji} Decision: {workflow['action']}")
            
            last_update = workflow
    else:
        print(" (workflow pending...)", end='')
    
    # Show findings summary
    if 'findings_summary' in data:
        summary = data['findings_summary']
        print(f"\n🔬 Findings: {summary['positive']}/{summary['total']} positive ({summary['critical']} critical)")
    
    print()  # Newline
    
    if status_val in ['completed', 'escalated', 'failed']:
        break
    
    time.sleep(2)

# Get detailed workflow
print("\n" + "="*60)
print("DETAILED WORKFLOW EXECUTION")
print("="*60)

workflow_response = requests.get(f'http://localhost:8000/api/studies/{study_id}/workflow/')
if workflow_response.status_code == 200:
    workflow_data = workflow_response.json()
    
    for step in workflow_data['workflow_steps']:
        print_workflow_step(step)
else:
    print("⚠️  Workflow details not available")

# Get final results
if status_val in ['completed', 'escalated']:
    print("\n" + "="*60)
    print("FINAL RESULTS")
    print("="*60)
    
    clinical = requests.get(f'http://localhost:8000/api/studies/{study_id}/clinical_report/').json()
    patient = requests.get(f'http://localhost:8000/api/studies/{study_id}/patient_summary/').json()
    
    print("\n🏥 CLINICAL REPORT:")
    print("-" * 60)
    print(clinical['clinical_report'])
    
    print("\n👤 PATIENT SUMMARY:")
    print("-" * 60)
    print(patient['patient_summary'])

print("\n✨ Done!")