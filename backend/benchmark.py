def get_benchmark(industry: str, employees: int, total_emissions: float):
    # simple demo benchmark logic
    base = 10000
    if industry.lower() == "manufacturing":
        base = 15000
    elif industry.lower() == "technology":
        base = 5000
    elif industry.lower() == "logistics":
        base = 20000
    elif industry.lower() == "retail":
        base = 8000
    else:
        base = 10000
    
    # Scale by employees
    scale_factor = max(1, employees / 100)
    low = base * scale_factor * 0.8
    high = base * scale_factor * 1.2
    
    status = "Within benchmark"
    if total_emissions < low:
        status = "Below benchmark"
    elif total_emissions > high:
        status = "Above benchmark"
        
    return {
        "range_low": low,
        "range_high": high,
        "industry": industry,
        "status": status,
        "explanation": "This benchmark uses demo dataset and is not an official industry standard."
    }
