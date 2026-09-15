OPPORTUNITIES = [
    {
        "name": "Local Solar Project",
        "type": "Renewable Energy",
        "description": "Invest in local solar grid expansion.",
        "regions": ["Global"],
        "suitable_industries": ["Manufacturing", "Technology", "Retail"],
        "minimum_conditions": {"min_electricity_emissions": 5000},
        "requirements": "Long-term PPA",
        "methodology_notes": "Verra standard"
    },
    {
        "name": "Fleet Electrification",
        "type": "Sustainable Transportation",
        "description": "Transition to electric vehicle fleet.",
        "regions": ["Global"],
        "suitable_industries": ["Logistics", "Services", "Manufacturing"],
        "minimum_conditions": {"min_diesel_petrol_emissions": 2000},
        "requirements": "EV Charging infrastructure",
        "methodology_notes": "Gold Standard"
    },
    {
        "name": "Zero Waste to Landfill Initiative",
        "type": "Waste Reduction",
        "description": "Implement circular economy principles to reduce waste.",
        "regions": ["Global"],
        "suitable_industries": ["Manufacturing", "Retail", "Services"],
        "minimum_conditions": {"min_waste_emissions": 500},
        "requirements": "Supply chain cooperation",
        "methodology_notes": "Internal policy"
    }
]

def match_opportunities(emissions_data: dict, company_data: dict) -> list:
    results = []
    
    elec = emissions_data["breakdown"].get("electricity", 0)
    fuel = emissions_data["breakdown"].get("diesel", 0) + emissions_data["breakdown"].get("petrol", 0)
    waste = emissions_data["breakdown"].get("waste", 0)
    
    for opp in OPPORTUNITIES:
        score = 40 # base score
        reasons = []
        
        if opp["type"] == "Renewable Energy" and elec > opp["minimum_conditions"].get("min_electricity_emissions", 0):
            score += 45
            reasons.append("High electricity consumption makes renewable-energy intervention relevant.")
            
        if opp["type"] == "Sustainable Transportation" and fuel > opp["minimum_conditions"].get("min_diesel_petrol_emissions", 0):
            score += 45
            reasons.append("High fuel consumption indicates fleet electrification opportunity.")
            
        if opp["type"] == "Waste Reduction" and waste > opp["minimum_conditions"].get("min_waste_emissions", 0):
            score += 45
            reasons.append("Significant waste emissions indicate reduction potential.")
            
        if company_data["industry"] in opp["suitable_industries"]:
            score += 15
            
        if score >= 55:
            results.append({
                "name": opp["name"],
                "type": opp["type"],
                "match_score": min(100, score),
                "matching_reasons": " ".join(reasons),
                "missing_requirements": opp["requirements"],
                "description": opp["description"],
                "status": "Potential opportunity — requires further assessment."
            })
            
    return results
