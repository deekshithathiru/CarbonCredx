# CARBONIQ — FULL-STACK HACKATHON APPLICATION

You are the lead senior full-stack engineer, UI/UX engineer, data engineer, and AI engineer for this project.

Build the complete application described below.

Do NOT merely explain what code I should write. You are expected to CREATE and MODIFY the actual project files in the workspace.

The application must be runnable locally and should be designed as a polished hackathon MVP that can realistically be completed and demonstrated within 24 hours.

---

# 1. PRODUCT

Product name:

CarbonIQ

Tagline:

"Measure. Understand. Reduce."

Product description:

CarbonIQ is an AI-powered corporate carbon intelligence platform that helps companies:

1. Enter their operational activity data
2. Calculate their Scope 1, Scope 2, and Scope 3 carbon footprint
3. Understand their biggest emission sources
4. Compare their emissions against a simple benchmark
5. Receive AI-generated carbon reduction recommendations
6. Discover potential carbon project / carbon-credit opportunities
7. Generate a professional ESG-style carbon report

IMPORTANT PRODUCT PRINCIPLE:

Use deterministic calculations for measurement.

Use AI for interpretation, recommendations, explanations, and action planning.

NEVER allow an LLM to calculate the company's actual emissions.

---

# 2. TARGET USER

The target user is a sustainability manager, business owner, operations manager, or company executive.

The application should feel like a real climate-tech SaaS product rather than a student CRUD application.

The interface should be:

* Premium
* Modern
* Minimal
* Professional
* Climate-tech oriented
* Easy to understand
* Responsive
* Demo-friendly

---

# 3. TECH STACK

Use:

FRONTEND:

* React
* Vite
* JavaScript or JSX
* Tailwind CSS
* React Router
* Axios
* Recharts
* Lucide React

BACKEND:

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* SQLite

OTHER:

* ReportLab for PDF generation
* python-dotenv for environment variables

AI:

* Use an LLM API through the backend.
* The exact provider should be configurable through environment variables.
* NEVER expose the API key to the frontend.

Do not add unnecessary dependencies.

---

# 4. PROJECT STRUCTURE

Create a clean structure similar to:

carboniq/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── carbon_engine.py
│   ├── emission_factors.json
│   ├── benchmark.py
│   ├── recommendations.py
│   ├── credit_matcher.py
│   ├── ai_service.py
│   ├── report_generator.py
│   ├── seed.py
│   ├── requirements.txt
│   └── ...
│
├── README.md
└── .env.example

Keep frontend and backend clearly separated.

---

# 5. FRONTEND PAGES

Create these routes:

/

Landing page

/setup

Company setup

/emissions

Emission data input

/dashboard

Carbon dashboard

/recommendations

AI Action Center

/opportunities

Carbon opportunity matcher

/report

ESG report generation

Use React Router.

---

# 6. LANDING PAGE

Create a polished landing page.

Hero:

"Measure. Understand. Reduce."

Subtitle:

"AI-powered carbon intelligence for modern businesses."

Primary CTA:

"Calculate Your Footprint"

Secondary CTA:

"Explore Dashboard"

Include a short explanation of:

* Scope 1
* Scope 2
* Scope 3
* AI-powered action planning
* Potential carbon opportunities
* ESG reporting

Add a visual preview/mock dashboard section.

The landing page should immediately communicate the value proposition.

Do not use generic lorem ipsum.

---

# 7. COMPANY SETUP

Create a company setup form.

Fields:

* Company name
* Industry
* Number of employees
* Country
* City/location
* Reporting year

Example:

Company:
GreenTech Manufacturing

Industry:
Manufacturing

Employees:
250

Location:
Chennai, India

Reporting year:
2026

Validate required fields.

Persist company data through the backend.

---

# 8. EMISSION INPUTS

Create a polished multi-section emission input page.

Sections:

## Energy

Electricity consumption:

* quantity
* unit = kWh

## Fuels

Diesel:

* litres

Petrol:

* litres

Natural gas:

* cubic metres

## Transportation

Employee commuting:

* kilometres

Business travel:

* kilometres

## Waste

Waste generated:

* kilograms

Make the form easy to understand.

Every input must show its unit.

Add helpful descriptions.

Example:

"Enter your company's total electricity consumption for the reporting year."

Include validation:

* Numbers only
* No negative values
* Reasonable validation
* Empty values treated as zero where appropriate

Button:

"Calculate Footprint"

When clicked:

Show:

"Calculating your carbon footprint..."

Then call the backend.

DO NOT calculate emissions in React.

---

# 9. CARBON CALCULATION ENGINE

Create a deterministic backend calculation engine.

Core formula:

CO2e = Activity Data × Emission Factor

Each emission factor must contain:

* category
* unit
* factor
* scope
* source
* source_year
* notes

Create a centralized:

emission_factors.json

Do not scatter emission factors throughout the code.

Categories:

electricity
diesel
petrol
natural_gas
employee_commute
business_travel
waste

Scopes:

Electricity → Scope 2

Diesel → Scope 1

Petrol → Scope 1

Natural gas → Scope 1

Employee commute → Scope 3

Business travel → Scope 3

Waste → Scope 3

IMPORTANT:

For development/demo purposes, placeholder emission factors may be used if authoritative factors are not available.

Clearly label them as:

"Demo emission factors"

Do NOT claim that placeholder factors are official, certified, legally binding, or authoritative.

Structure the application so they can easily be replaced by verified factors later.

The calculation engine must return:

{
"scope1": number,
"scope2": number,
"scope3": number,
"total": number,
"breakdown": {
"electricity": number,
"diesel": number,
...
}
}

Round displayed values appropriately but preserve reasonable precision internally.

---

# 10. DATABASE

Use SQLite with SQLAlchemy.

Create tables for:

Company

EmissionRecord

Recommendation

Opportunity

Report

At minimum store:

Company:

* id
* name
* industry
* employees
* location
* reporting_year
* created_at

EmissionRecord:

* id
* company_id
* category
* quantity
* unit
* emission_factor
* emissions
* scope

Do not over-engineer authentication for the hackathon.

No user login is required for the MVP.

---

# 11. API

Create these endpoints:

GET /

GET /api/health

POST /api/company

GET /api/company/{company_id}

POST /api/emissions/calculate

GET /api/emissions/{company_id}

GET /api/benchmark/{company_id}

POST /api/recommendations/{company_id}

GET /api/opportunities/{company_id}

POST /api/report/{company_id}

Use Pydantic request/response models.

Return useful HTTP errors.

Enable CORS for the frontend.

---

# 12. DASHBOARD

Create a premium dashboard.

Top navigation:

CarbonIQ logo/name

Dashboard
Emissions
AI Actions
Opportunities
Report

Dashboard should show:

## KPI cards

Total Carbon Footprint

Scope 1

Scope 2

Scope 3

Use tCO2e as the primary display unit.

If backend stores kgCO2e, convert appropriately.

---

# 13. DASHBOARD VISUALIZATIONS

Use Recharts.

Create:

1. Scope breakdown donut chart

2. Emissions-by-source bar chart

3. Scope comparison visualization

4. Top emission sources list

5. Benchmark card

The dashboard should immediately answer:

"What is our total footprint?"

"Which scope is largest?"

"What is causing our emissions?"

"Where should we focus?"

---

# 14. BENCHMARKING

Create a simple benchmark system.

Benchmark should be based on:

* industry
* employee count
* total emissions

For the hackathon, use a clearly labeled demo benchmark dataset.

Example:

Manufacturing
Technology
Retail
Logistics
Services

Do not present demo benchmark data as official industry standards.

Show:

Your emissions

Benchmark range

Status:

Below benchmark

Within benchmark

Above benchmark

Include a short explanation.

---

# 15. AI RECOMMENDATION ENGINE

Create:

backend/ai_service.py

The AI receives structured data like:

{
company_name,
industry,
employees,
scope1,
scope2,
scope3,
total,
top_emission_sources
}

The AI must NOT calculate emissions.

The AI must interpret the calculated results.

Request exactly 3 recommendations.

Each recommendation must contain:

title

explanation

priority

impact

difficulty

estimated_reduction_range

implementation_steps

Example:

{
"title": "Switch to renewable electricity",
"priority": "HIGH",
"impact": "HIGH",
"difficulty": "MEDIUM",
"estimated_reduction_range": "15–25%",
"implementation_steps": [...]
}

IMPORTANT AI RULES:

The AI must:

* Never invent emission factors
* Never recalculate the footprint
* Never claim guaranteed reductions
* Never claim official carbon-credit eligibility
* Never invent certifications
* Never provide fake legal claims
* Clearly label reduction values as estimates
* Base recommendations on supplied company data

If the AI API fails:

Return safe rule-based fallback recommendations.

The application must remain functional even without an AI API key.

---

# 16. AI ACTION CENTER

Create a beautiful page:

"AI Action Center"

Subtitle:

"Your highest-impact opportunities to reduce emissions."

Show exactly 3 recommendation cards.

Each card:

Recommendation title

Priority badge

Impact

Difficulty

Estimated reduction

Why this matters

Implementation steps

Add expandable:

"Why this recommendation?"

Add:

"Ask AI"

button if practical.

Do not display raw JSON.

---

# 17. CARBON OPPORTUNITY MATCHER

Create a deterministic opportunity matching system.

Do NOT allow an LLM to decide legal carbon-credit eligibility.

Create a local opportunity dataset.

Opportunity types:

* Renewable Energy
* Energy Efficiency
* Waste Reduction
* Sustainable Transportation
* Reforestation / Nature-based projects

Each opportunity should have:

* name
* type
* description
* regions
* suitable_industries
* minimum_conditions
* requirements
* methodology_notes

The matcher analyzes company data.

Return:

name

match_score

matching_reasons

missing_requirements

description

status

Use status wording:

"Potential opportunity"

"Needs further assessment"

"Requires verification"

NEVER say:

"You are eligible for carbon credits."

NEVER guarantee that the company can generate or sell credits.

Explain that actual carbon-credit eligibility requires project-specific methodology, additionality, monitoring, documentation, and independent verification where applicable.

---

# 18. OPPORTUNITIES UI

Create:

"Carbon Opportunities"

Show opportunity cards.

Each card should display:

Project name

Type

Match score

Why it matches

Requirements

Missing requirements

Status

Example:

"Renewable Energy"

"87% match"

"High electricity consumption makes renewable-energy intervention relevant."

"Potential opportunity — requires further assessment."

Make the cards visually impressive.

---

# 19. ESG REPORT

Create a professional PDF using ReportLab.

Endpoint:

POST /api/report/{company_id}

Report sections:

1. Cover page

CarbonIQ

Corporate Carbon Footprint Report

Company name

Reporting year

2. Executive summary

3. Total emissions

4. Scope 1

5. Scope 2

6. Scope 3

7. Emission source breakdown

8. Top emission sources

9. AI action plan

10. Potential carbon opportunities

11. Methodology

12. Data limitations

13. Disclaimer

The PDF must use actual backend data.

Never invent data.

Frontend button:

"Generate ESG Report"

Show:

"Generating your report..."

Then download/open the generated PDF.

---

# 20. DISCLAIMER

Include an appropriate disclaimer.

Conceptually:

CarbonIQ provides an estimation and decision-support tool. Results depend on user-provided activity data and selected emission factors. Demonstration emission factors and benchmarks may not represent official standards. Carbon-credit opportunities shown by the platform are potential matches only and do not constitute certification, eligibility, legal advice, or verification.

Do not overstate the product.

---

# 21. UI DESIGN

Use a premium SaaS design.

Design principles:

* Lots of whitespace
* Rounded cards
* Subtle borders
* Strong typography
* Large KPI numbers
* Clear charts
* Minimal shadows
* Subtle animations
* Consistent spacing
* Responsive layout
* Accessible contrast
* Professional climate-tech aesthetic

Use a restrained environmental palette.

Avoid:

* Excessive gradients
* Excessive animations
* Huge illustrations
* Clutter
* Generic dashboard templates
* Emoji-heavy UI

Use Lucide icons.

---

# 22. NAVIGATION

Desktop:

Left sidebar or clean top navigation.

Mobile:

Responsive navigation.

Navigation:

Dashboard

Emissions

AI Actions

Opportunities

Report

Add company name in the interface.

---

# 23. STATES

Every asynchronous operation must have:

Loading state

Success state

Error state

Empty state

Examples:

"Calculating your footprint..."

"Generating your AI action plan..."

"Finding potential opportunities..."

"Generating your ESG report..."

Errors must be understandable to a non-technical user.

Never show raw stack traces in the UI.

---

# 24. ERROR HANDLING

Backend:

* Validate all input
* Handle missing company
* Handle malformed requests
* Handle AI API failure
* Handle PDF generation failure
* Return appropriate HTTP status codes

Frontend:

* API failure handling
* Retry button
* Loading states
* Form validation
* Empty states

---

# 25. SECURITY

IMPORTANT:

Never expose secrets.

Use:

.env

Example:

AI_API_KEY=your_key_here

Create:

.env.example

with placeholder values only.

Never commit actual secrets.

Never send the AI API key to the frontend.

Do not store API keys in React code.

---

# 26. DEMO DATA

Create a seed/demo company:

Company:

GreenTech Manufacturing

Industry:

Manufacturing

Employees:

250

Location:

Chennai, India

Reporting year:

2026

Create meaningful demo activity data.

The demo should result in:

* noticeable Scope 1
* noticeable Scope 2
* noticeable Scope 3

Scope 3 should be significant enough to demonstrate why it matters.

Do not hard-code dashboard numbers.

The dashboard must calculate from the underlying activity data.

---

# 27. DEMO EXPERIENCE

The complete demo flow should be:

Landing page

↓

"Calculate Your Footprint"

↓

Company setup

↓

Emission inputs

↓

Calculate

↓

Dashboard

↓

See total footprint

↓

See Scope 1/2/3

↓

See biggest emission sources

↓

Open AI Action Center

↓

See 3 recommendations

↓

Open Carbon Opportunities

↓

See potential opportunities

↓

Generate ESG Report

↓

PDF generated

This should feel like one coherent product journey.

---

# 28. DATA FLOW

Expected architecture:

React

↓

Axios

↓

FastAPI

↓

Database / calculation engine

↓

Result

↓

React dashboard

For AI:

Calculated data

↓

Backend AI service

↓

LLM

↓

Structured recommendation JSON

↓

React Action Center

For PDF:

Database + calculation result + recommendations + opportunities

↓

ReportLab

↓

PDF

---

# 29. API CONTRACT

Make sure frontend and backend agree on exact schemas.

Example calculation request:

{
"electricity": 10000,
"diesel": 1000,
"petrol": 500,
"natural_gas": 0,
"employee_commute": 20000,
"business_travel": 10000,
"waste": 1000
}

Example response:

{
"scope1": 3835,
"scope2": 7000,
"scope3": 4000,
"total": 14835,
"breakdown": {
"electricity": 7000,
"diesel": 2680,
"petrol": 1155,
"employee_commute": 3000,
"business_travel": 1800,
"waste": 500
}
}

These numbers are only illustrative if using placeholder demo factors.

Do not hard-code them into the application.

---

# 30. TESTING

Create backend tests.

Test:

* Correct multiplication
* Scope classification
* Total calculation
* Zero values
* Missing values
* Negative values rejected
* Unknown categories
* API validation

Create frontend-safe API handling.

Test:

* Company setup
* Emission submission
* Dashboard rendering
* AI failure fallback
* Opportunity matching
* Report generation

---

# 31. CODE QUALITY

Write maintainable code.

Rules:

* Small reusable functions
* Reusable React components
* Clear naming
* No unnecessary duplication
* No giant App.jsx
* No hard-coded API URLs throughout the code
* Centralize API configuration
* Use environment variables
* Add comments only where useful
* Avoid unnecessary abstractions

Do not over-engineer.

This is a hackathon MVP.

Prioritize:

WORKING > PERFECT

---

# 32. README

Create a detailed README containing:

Project overview

Features

Architecture

Tech stack

Folder structure

Setup instructions

Frontend setup

Backend setup

Environment variables

How to run

How to seed demo data

API endpoints

Testing

Known limitations

Future improvements

---

# 33. LOCAL DEVELOPMENT

The final project should run approximately as:

Backend:

python -m venv venv

Activate virtual environment

pip install -r requirements.txt

uvicorn main:app --reload

Frontend:

npm install

npm run dev

Document exact commands in README.

---

# 34. IMPORTANT DEVELOPMENT STRATEGY

Do NOT try to create a giant amount of code blindly.

Work incrementally.

FIRST:

Create project structure.

SECOND:

Get frontend running.

THIRD:

Get backend running.

FOURTH:

Verify frontend → backend communication.

FIFTH:

Implement deterministic carbon engine.

SIXTH:

Test carbon engine.

SEVENTH:

Build emission input UI.

EIGHTH:

Build dashboard.

NINTH:

Build AI service.

TENTH:

Build AI Action Center.

ELEVENTH:

Build opportunity matcher.

TWELFTH:

Build PDF report.

THIRTEENTH:

Polish UI.

FOURTEENTH:

Run tests.

FIFTEENTH:

Fix all errors.

Do not skip directly to styling before the core functionality works.

---

# 35. CRITICAL RULES

RULE 1:

Never use an LLM to calculate carbon emissions.

RULE 2:

Never expose API keys.

RULE 3:

Never claim carbon-credit eligibility as a fact.

RULE 4:

Never present demo emission factors as official.

RULE 5:

Never invent data.

RULE 6:

Never break working functionality while adding a new feature.

RULE 7:

Prefer simple reliable implementations over complicated architecture.

RULE 8:

If an external AI API is unavailable, the application must still work using deterministic fallback recommendations.

RULE 9:

Do not add authentication unless absolutely necessary.

RULE 10:

Do not add blockchain.

RULE 11:

Do not add OCR.

RULE 12:

Do not add unnecessary ML.

RULE 13:

Do not build features outside the specified MVP until all core functionality works.

---

# 36. FINAL QA

After implementation, inspect the entire project.

Check:

* Frontend starts
* Backend starts
* API works
* Database works
* Carbon calculations work
* Scope calculations work
* Dashboard receives real backend data
* Charts render
* AI works when configured
* AI fallback works
* Opportunity matcher works
* PDF generation works
* No secrets are committed
* No broken imports
* No unused critical routes
* No console-breaking errors
* Responsive UI works
* README works

Then fix the issues you find.

---

# 37. IMPORTANT OPEN CODE BEHAVIOR

You have permission to create and modify project files in the workspace.

Before making major architectural changes, inspect the existing project.

If files already exist, reuse them rather than blindly replacing everything.

Do not delete working functionality without a clear reason.

When encountering an error:

1. Identify the root cause.
2. Fix the smallest necessary area.
3. Run or reason through the relevant test.
4. Continue.

Do not hide errors by disabling functionality.

At the end, provide a concise summary containing:

1. What was built
2. Files created
3. How to run the project
4. Environment variables required
5. What is fully working
6. What remains optional
7. Any known limitations

MOST IMPORTANT:

Actually implement the application.

Do not return a tutorial instead of code.

Start by inspecting the workspace and then begin building CarbonIQ incrementally, starting with the project foundation and working toward the complete MVP.
