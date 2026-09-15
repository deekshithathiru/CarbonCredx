from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

import models
import schemas
from database import engine, get_db
from carbon_engine import calculate_emissions, load_factors
from benchmark import get_benchmark
from credit_matcher import match_opportunities
from ai_service import get_recommendations
from report_generator import generate_pdf_report
import json

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CarbonIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "CarbonIQ API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/company", response_model=schemas.Company)
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    db_company = models.Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@app.get("/api/company/{company_id}", response_model=schemas.Company)
def get_company(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return db_company

@app.post("/api/emissions/calculate", response_model=schemas.EmissionCalculationResponse)
def calculate_emissions_route(data: dict):
    # This route is just for calculation without storing, if needed
    result = calculate_emissions(data)
    return result

@app.post("/api/emissions/{company_id}", response_model=schemas.EmissionCalculationResponse)
def save_emissions(company_id: int, emissions: schemas.EmissionInput, db: Session = Depends(get_db)):
    db_company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
        
    input_data = emissions.dict()
    result = calculate_emissions(input_data)
    factors = load_factors()
    
    db.query(models.EmissionRecord).filter(models.EmissionRecord.company_id == company_id).delete()
    
    for cat, quantity in input_data.items():
        if quantity and quantity > 0 and cat in factors:
            emissions_val = result["breakdown"].get(cat, 0)
            db_record = models.EmissionRecord(
                company_id=company_id,
                category=cat,
                quantity=quantity,
                unit=factors[cat]["unit"],
                emission_factor=factors[cat]["factor"],
                emissions=emissions_val,
                scope=factors[cat]["scope"]
            )
            db.add(db_record)
            
    db.commit()
    return result

@app.get("/api/emissions/{company_id}", response_model=schemas.EmissionCalculationResponse)
def get_emissions(company_id: int, db: Session = Depends(get_db)):
    records = db.query(models.EmissionRecord).filter(models.EmissionRecord.company_id == company_id).all()
    if not records:
        return {"scope1": 0, "scope2": 0, "scope3": 0, "total": 0, "breakdown": {}}
        
    scope1 = sum(r.emissions for r in records if r.scope == 1)
    scope2 = sum(r.emissions for r in records if r.scope == 2)
    scope3 = sum(r.emissions for r in records if r.scope == 3)
    total = sum(r.emissions for r in records)
    breakdown = {r.category: r.emissions for r in records}
    
    return {
        "scope1": scope1,
        "scope2": scope2,
        "scope3": scope3,
        "total": total,
        "breakdown": breakdown
    }

@app.get("/api/benchmark/{company_id}")
def company_benchmark(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
        
    records = db.query(models.EmissionRecord).filter(models.EmissionRecord.company_id == company_id).all()
    total = sum([r.emissions for r in records])
    
    return get_benchmark(db_company.industry, db_company.employees, total)

@app.post("/api/recommendations/{company_id}")
def generate_recs(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
        
    emissions = get_emissions(company_id, db)
    
    company_data = {
        "name": db_company.name,
        "industry": db_company.industry,
        "employees": db_company.employees
    }
    
    recs = get_recommendations(company_data, emissions)
    
    db.query(models.Recommendation).filter(models.Recommendation.company_id == company_id).delete()
    for rec in recs:
        db_rec = models.Recommendation(
            company_id=company_id,
            title=rec.get("title", ""),
            priority=rec.get("priority", "MEDIUM"),
            impact=rec.get("impact", "MEDIUM"),
            difficulty=rec.get("difficulty", "MEDIUM"),
            estimated_reduction_range=rec.get("estimated_reduction_range", ""),
            implementation_steps=json.dumps(rec.get("implementation_steps", [])),
            investment=rec.get("investment"),
            annual_savings=rec.get("annual_savings"),
            roi=rec.get("roi"),
            payback_period=rec.get("payback_period"),
            co2_reduction=rec.get("co2_reduction")
        )
        db.add(db_rec)
        
    db.commit()
    return recs

@app.get("/api/recommendations/{company_id}")
def get_recs(company_id: int, db: Session = Depends(get_db)):
    records = db.query(models.Recommendation).filter(models.Recommendation.company_id == company_id).all()
    result = []
    for r in records:
        result.append({
            "title": r.title,
            "priority": r.priority,
            "impact": r.impact,
            "difficulty": r.difficulty,
            "estimated_reduction_range": r.estimated_reduction_range,
            "implementation_steps": json.loads(r.implementation_steps) if r.implementation_steps else [],
            "investment": r.investment,
            "annual_savings": r.annual_savings,
            "roi": r.roi,
            "payback_period": r.payback_period,
            "co2_reduction": r.co2_reduction
        })
    return result

@app.get("/api/opportunities/{company_id}")
def get_opps(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
        
    emissions = get_emissions(company_id, db)
    company_data = {"industry": db_company.industry}
    
    return match_opportunities(emissions, company_data)

@app.post("/api/report/{company_id}")
def generate_report(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
        
    emissions = get_emissions(company_id, db)
    
    company_data = {
        "name": db_company.name,
        "industry": db_company.industry,
        "reporting_year": db_company.reporting_year
    }
    
    os.makedirs("reports", exist_ok=True)
    filename = f"reports/carbon_report_{company_id}.pdf"
    
    generate_pdf_report(company_data, emissions, filename)
    
    # Store in DB
    db_report = models.Report(company_id=company_id, file_path=filename)
    db.add(db_report)
    db.commit()
    
    return {"file_url": f"/api/report/download/{company_id}"}

@app.get("/api/report/download/{company_id}")
def download_report(company_id: int, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.company_id == company_id).order_by(models.Report.id.desc()).first()
    if not report or not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Report not found")
        
    return FileResponse(path=report.file_path, filename=f"CarbonIQ_Report.pdf", media_type='application/pdf')
