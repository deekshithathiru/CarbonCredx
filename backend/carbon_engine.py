import json
import os

FACTORS_FILE = os.path.join(os.path.dirname(__file__), "emission_factors.json")

def load_factors():
    with open(FACTORS_FILE, 'r') as f:
        return json.load(f)

def calculate_emissions(activity_data: dict) -> dict:
    factors = load_factors()
    
    result = {
        "scope1": 0.0,
        "scope2": 0.0,
        "scope3": 0.0,
        "total": 0.0,
        "breakdown": {}
    }
    
    for category, quantity in activity_data.items():
        if category in factors and quantity is not None:
            factor_data = factors[category]
            emissions = quantity * factor_data["factor"]
            
            result["breakdown"][category] = emissions
            result["total"] += emissions
            
            scope = factor_data["scope"]
            if scope == 1:
                result["scope1"] += emissions
            elif scope == 2:
                result["scope2"] += emissions
            elif scope == 3:
                result["scope3"] += emissions
                
    return result
