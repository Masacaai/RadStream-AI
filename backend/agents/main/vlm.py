import json
from typing import Optional
from hopprai import HOPPR

class VLMAgent:
    """Runs VLM for narrative"""
    
    def __init__(self, hoppr: HOPPR):
        self.hoppr = hoppr
    
    def analyze(self, study_id: str, focus_on: Optional[str] = None) -> str:
        
        prompt = "Describe the findings in this chest X-ray."
        if focus_on:
            prompt = f"Describe the findings in this chest X-ray, paying special attention to: {focus_on}"
        
        try:
            response = self.hoppr.prompt_model(
                study_id=study_id,
                model="cxr-vlm-experimental",
                prompt=prompt
            )
            
            if response and response.success:
                data = json.loads(response.response)
                findings = data.get('findings', 'No findings')
                return findings
                
        except Exception as e:
            print(f"VLM analysis error: {str(e)}")

        return "VLM analysis unavailable"