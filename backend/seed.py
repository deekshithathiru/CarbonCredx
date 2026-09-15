from database import engine, SessionLocal
import models

def seed_db():
    # Only create tables, don't drop to avoid losing user data in hackathon mode, unless needed
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if company exists
    existing = db.query(models.Company).filter(models.Company.name == "GreenTech Manufacturing").first()
    if not existing:
        demo_company = models.Company(
            name="GreenTech Manufacturing",
            industry="Manufacturing",
            employees=250,
            location="Chennai, India",
            reporting_year=2026
        )
        db.add(demo_company)
        db.commit()
        db.refresh(demo_company)
        print(f"Created demo company: {demo_company.name} with ID {demo_company.id}")
    else:
        print("Demo company already exists.")
        
    db.close()

if __name__ == "__main__":
    seed_db()
