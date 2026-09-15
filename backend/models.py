from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    industry = Column(String)
    employees = Column(Integer)
    location = Column(String)
    reporting_year = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    emission_records = relationship("EmissionRecord", back_populates="company")
    recommendations = relationship("Recommendation", back_populates="company")
    opportunities = relationship("Opportunity", back_populates="company")
    reports = relationship("Report", back_populates="company")

class EmissionRecord(Base):
    __tablename__ = "emission_records"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    category = Column(String)
    quantity = Column(Float)
    unit = Column(String)
    emission_factor = Column(Float)
    emissions = Column(Float) # emissions in kgCO2e
    scope = Column(Integer)
    
    company = relationship("Company", back_populates="emission_records")

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    title = Column(String)
    priority = Column(String)
    impact = Column(String)
    difficulty = Column(String)
    estimated_reduction_range = Column(String)
    implementation_steps = Column(String) # JSON string
    investment = Column(Float, nullable=True)
    annual_savings = Column(Float, nullable=True)
    roi = Column(Float, nullable=True)
    payback_period = Column(Float, nullable=True)
    co2_reduction = Column(Float, nullable=True)
    
    company = relationship("Company", back_populates="recommendations")

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    name = Column(String)
    type = Column(String)
    match_score = Column(Integer)
    matching_reasons = Column(String)
    missing_requirements = Column(String)
    description = Column(String)
    status = Column(String)
    
    company = relationship("Company", back_populates="opportunities")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    file_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    company = relationship("Company", back_populates="reports")
