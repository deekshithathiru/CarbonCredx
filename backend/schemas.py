from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CompanyBase(BaseModel):
    name: str
    industry: str
    employees: int
    location: str
    reporting_year: int

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    class Config:
        orm_mode = True

class EmissionInput(BaseModel):
    electricity: float
    diesel: float
    petrol: float
    natural_gas: float
    employee_commute: float
    business_travel: float
    waste: float

class EmissionCalculationResponse(BaseModel):
    scope1: float
    scope2: float
    scope3: float
    total: float
    breakdown: Dict[str, float]

class RecommendationResponse(BaseModel):
    title: str
    priority: str
    impact: str
    difficulty: str
    estimated_reduction_range: str
    implementation_steps: List[str]
    investment: Optional[float] = None
    annual_savings: Optional[float] = None
    roi: Optional[float] = None
    payback_period: Optional[float] = None
    co2_reduction: Optional[float] = None
    
class OpportunityResponse(BaseModel):
    name: str
    type: str
    match_score: int
    matching_reasons: str
    missing_requirements: str
    description: str
    status: str

class ReportResponse(BaseModel):
    file_url: str
