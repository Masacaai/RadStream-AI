import json
from typing import Dict
from hopprai import HOPPR

class ModelRunner:
    """Runs HOPPR models with adaptive thresholds"""
    
    def __init__(self, hoppr: HOPPR):
        self.hoppr = hoppr
    
    def run_models(self, study_id: str, models: Dict[str, str], urgency: str = "moderate") -> Dict:
        """Run models with urgency-based thresholds"""
        
        # DECISION POINT 1: Urgency changes detection threshold
        threshold_map = {
            "critical": 0.35,  # More sensitive - catch everything
            "high": 0.45,
            "moderate": 0.50,  # Standard
            "low": 0.60        # More specific
        }
        threshold = threshold_map.get(urgency, 0.50)
        
        
        results = {}
        
        for name, model_id in models.items():
            try:
                response = self.hoppr.prompt_model(
                    study_id=study_id,
                    model=model_id,
                    prompt="classification",
                    organization="hoppr"
                )
                
                score = 0.0
                if response and response.success:
                    data = json.loads(response.response)
                    score = data.get('score', 0.0)
                
                # Use dynamic threshold based on urgency
                results[name] = {
                    'score': score,
                    'present': score > threshold,
                    'threshold_used': threshold
                }
                
                if score > threshold:
                    emoji = "🔴" if score > 0.75 else "🟡"
                    
            except Exception as e:
                results[name] = {'score': 0.0, 'present': False, 'threshold_used': threshold}
        
        return results