import os
import json
import requests

def get_recommendations(company_data: dict, emissions_data: dict) -> list:
    api_key = os.getenv("AI_API_KEY")
    # For MVP we will use a fallback implementation with realistic financial values
    fallback_recommendations = [
        {
            "title": "HVAC Optimization",
            "priority": "HIGH",
            "impact": "HIGH",
            "difficulty": "LOW",
            "estimated_reduction_range": "10-15%",
            "implementation_steps": ["Audit current HVAC usage", "Install smart thermostats", "Adjust running hours"],
            "investment": 120000,
            "annual_savings": 240000,
            "roi": 100.0,
            "payback_period": 6.0,
            "co2_reduction": 38.0
        },
        {
            "title": "LED Lighting Upgrade",
            "priority": "MEDIUM",
            "impact": "MEDIUM",
            "difficulty": "LOW",
            "estimated_reduction_range": "5-10%",
            "implementation_steps": ["Audit current lighting", "Bulk purchase LED fixtures", "Replace over 2 weekends"],
            "investment": 100000,
            "annual_savings": 420000,
            "roi": 320.0,
            "payback_period": 3.75,
            "co2_reduction": 12.0
        },
        {
            "title": "Transport Optimization",
            "priority": "HIGH",
            "impact": "MEDIUM",
            "difficulty": "HIGH",
            "estimated_reduction_range": "10-20%",
            "implementation_steps": ["Optimize delivery routes", "Limit unnecessary travel", "Shift to rail where possible"],
            "investment": 100000,
            "annual_savings": 55000,
            "roi": 55.0,
            "payback_period": 21.8,
            "co2_reduction": 24.0
        },
        {
            "title": "Solar Installation",
            "priority": "MEDIUM",
            "impact": "HIGH",
            "difficulty": "HIGH",
            "estimated_reduction_range": "20-40%",
            "implementation_steps": ["Site assessment", "Procure EPC vendor", "Install 50kW array"],
            "investment": 300000,
            "annual_savings": 110000,
            "roi": 36.6,
            "payback_period": 32.7,
            "co2_reduction": 60.0
        }
    ]

    if not api_key:
        return fallback_recommendations
        
    # Example integration using Gemini API
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    
    prompt = f"""
    You are a corporate sustainability and financial expert acting as an AI Sustainability CFO.
    Company: {company_data.get('name')}
    Industry: {company_data.get('industry')}
    Employees: {company_data.get('employees')}
    Total Emissions: {emissions_data.get('total')} kgCO2e
    Scope 1: {emissions_data.get('scope1')} kgCO2e
    Scope 2: {emissions_data.get('scope2')} kgCO2e
    Scope 3: {emissions_data.get('scope3')} kgCO2e
    Breakdown: {json.dumps(emissions_data.get('breakdown'))}
    
    Based on this data, provide EXACTLY 4 high-impact, financially-driven recommendations to reduce emissions and save money.
    Format your response as a JSON array of objects.
    Each object must have EXACTLY these keys:
    - title (string)
    - priority (HIGH/MEDIUM/LOW)
    - impact (HIGH/MEDIUM/LOW)
    - difficulty (HIGH/MEDIUM/LOW)
    - estimated_reduction_range (string)
    - implementation_steps (array of strings)
    - investment (number, realistic INR value like 120000)
    - annual_savings (number, realistic INR value like 240000)
    - roi (number, percentage like 100.0)
    - payback_period (number, months like 6.0)
    - co2_reduction (number, tonnes of CO2e reduced like 38.0)
    
    Make the values realistic for an SME in INR (₹).
    Do NOT include markdown formatting in your response. Just the raw JSON.
    """
    
    data = {
        "contents": [{"parts":[{"text": prompt}]}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        text_response = result['candidates'][0]['content']['parts'][0]['text']
        
        # Clean up possible markdown
        if text_response.startswith("```json"):
            text_response = text_response[7:-3]
        elif text_response.startswith("```"):
            text_response = text_response[3:-3]
            
        ai_recommendations = json.loads(text_response)
        
        if isinstance(ai_recommendations, list) and len(ai_recommendations) > 0:
            return ai_recommendations[:4]
    except Exception as e:
        print(f"AI API failed: {e}")
        
    return fallback_recommendations
