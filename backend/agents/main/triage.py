from typing import Dict
import json
from groq import Groq

class TriageAgent:
    """Decides what to analyze based on patient info"""
    
    def __init__(self, groq: Groq):
        self.groq = groq
    
    def plan_strategy(self, patient_history: str, visit_reason: str) -> Dict:
        
        prompt = f"""Patient: {patient_history}
    Reason: {visit_reason}

    You MUST choose from ONLY these valid systems: emergency, pulmonary, cardiac, devices, other

    What should we prioritize? Respond in JSON:
    {{
        "urgency": "critical|high|moderate|low",
        "priority_systems": ["emergency", "pulmonary", "cardiac"],
        "reasoning": "brief explanation"
    }}

    IMPORTANT: 
    - "priority_systems" must ONLY contain values from: emergency, pulmonary, cardiac, devices, other
    - You must include at least 2 systems
    - For low urgency, still include systems but they run with higher specificity"""
        
        try:
            response = self.groq.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a triage expert. Respond only with JSON. Use ONLY these system names: emergency, pulmonary, cardiac, devices, other"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            strategy = json.loads(response.choices[0].message.content.strip())
            
            # VALIDATION: Filter out invalid systems
            valid_systems = {"emergency", "pulmonary", "cardiac", "devices", "other"}
            strategy['priority_systems'] = [s for s in strategy.get('priority_systems', []) if s in valid_systems]
            
            # FALLBACK: If no valid systems or empty, use defaults
            if not strategy['priority_systems']:
                strategy['priority_systems'] = ["emergency", "pulmonary", "cardiac"]
            
            return strategy
            
        except Exception as e:
            return {
                "urgency": "moderate",
                "priority_systems": ["emergency", "pulmonary", "cardiac"],
                "reasoning": "Default strategy due to planning error"
            }
    
    def decide_next_action(self, findings: Dict, urgency: str) -> str:
        
        # Check for critical findings
        critical = [name for name, data in findings.items() if data['score'] > 0.75]
        high_concern = [name for name, data in findings.items() if 0.5 < data['score'] <= 0.75]
        
        if critical and urgency in ["critical", "high"]:
            return "ESCALATE"
        elif critical or high_concern:
            return "CONTINUE"
        else:
            return "COMPLETE"