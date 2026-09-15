# CarbonIQ — AI-Powered Corporate Carbon Intelligence

CarbonIQ is a full-stack corporate carbon intelligence platform built as a hackathon MVP. It helps companies measure, understand, and reduce their carbon footprint using deterministic calculations and AI-powered recommendations.

## Features
- **Deterministic Carbon Engine**: Calculates Scope 1, 2, and 3 emissions based on standard factors.
- **AI Action Center**: Analyzes footprint and returns highly targeted reduction recommendations using Gemini/LLM APIs.
- **Carbon Opportunity Matcher**: Identifies potential carbon projects and credit interventions.
- **ESG Reporting**: Generates a professional PDF report.
- **Dashboard**: Recharts-based data visualization and benchmarking.

## Architecture & Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router, Recharts, Lucide React, Axios.
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite, Pydantic, ReportLab.
- **AI**: Integration with LLM APIs via `ai_service.py` with deterministic fallback.

## Folder Structure
```
carboniq/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── carbon_engine.py
│   ├── ai_service.py
│   ├── credit_matcher.py
│   ├── report_generator.py
│   ├── seed.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Setup Instructions

### Environment Variables
Create a `.env` file in the root of the `backend` directory (or use `.env.example`):
```
AI_API_KEY=your_gemini_or_openai_api_key_here
```

### Backend Setup
1. Open a terminal in the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed demo data (optional):
   ```bash
   python seed.py
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
The backend will run on `http://localhost:8000`.

### Frontend Setup
1. Open a terminal in the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
The frontend will run on `http://localhost:5173`.

## Testing & Usage
1. Open the frontend in your browser.
2. Click "Calculate Your Footprint" on the landing page.
3. Complete the company setup.
4. Enter test emission data (e.g., Electricity: 50000 kWh, Diesel: 2000 litres).
5. View the dashboard to see calculated Scope 1, 2, and 3 emissions.
6. Check "AI Actions" for reduction strategies.
7. Check "Opportunities" for matching projects.
8. Generate and download the ESG PDF report.

## Known Limitations (Hackathon MVP)
- No user authentication (stores state in local storage).
- Database uses SQLite without complex migrations.
- Emission factors are static placeholders intended for demo purposes, not certified methodologies.
- The AI fallback will trigger if no valid API key is provided, ensuring application resilience.

## Future Improvements
- Multi-user and multi-tenant authentication.
- PostgreSQL database migration.
- Official API integrations for verified EPA/DEFRA emission factors.
- Time-series tracking for multi-year ESG goals.
