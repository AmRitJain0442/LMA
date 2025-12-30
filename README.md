# LoanLattice MVP - Smart Document Engine

A prototype AI-powered loan document processing system for syndicated loans. This MVP demonstrates the **Digital Loans** category of the hackathon by automating document standardization, data extraction, and covenant monitoring.

## Overview

LoanLattice transforms manual loan document processing into an automated, intelligent system. Upload a PDF loan document and watch as AI extracts borrower information, loan terms, covenants, and more in seconds.

## Key Features

### Smart Document Engine
- **AI Document Processing**: Automatically extract text from PDF loan documents
- **Intelligent Data Extraction**: Identify borrower info, loan amounts, interest rates, terms, and covenants
- **High Accuracy**: Confidence scoring for each extraction to ensure data quality
- **LMA-Compatible**: Designed for syndicated loan documentation standards

### Covenant Monitoring
- **Automatic Covenant Detection**: AI identifies financial, affirmative, negative, and reporting covenants
- **Real-time Tracking**: Monitor covenant compliance status (compliant, warning, breach)
- **Risk Forecasting**: 30/60/90-day breach probability predictions
- **Visual Alerts**: Color-coded dashboard for quick risk assessment

### Interactive Dashboard
- **Portfolio Analytics**: View total documents, loans, and portfolio value at a glance
- **Document Status Tracking**: Monitor processing status in real-time
- **Loan Data Visualization**: Sortable tables with extraction confidence scores
- **At-Risk Covenant Alerts**: Immediate visibility into potential compliance issues

## Tech Stack

**Backend:**
- Python 3.11+ with FastAPI (high-performance async framework)
- SQLAlchemy ORM with SQLite (easily upgradeable to PostgreSQL)
- PyPDF2 for document text extraction
- Google Gemini 1.5 Flash for AI-powered data extraction
- Pydantic for data validation

**Frontend:**
- React 18 with hooks
- Vite (next-generation build tool)
- Tailwind CSS (utility-first styling)
- Axios for API communication
- React Router for navigation
- Lucide React for icons

## Project Structure

```
loanlattice-mvp/
├── backend/
│   ├── app/
│   │   ├── api/              # REST API endpoints
│   │   ├── core/             # Configuration & database
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # Business logic & AI
│   ├── requirements.txt
│   └── init_db.py
├── frontend/
│   ├── src/
│   │   ├── pages/            # React page components
│   │   ├── services/         # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── SETUP.md                  # Detailed setup instructions
└── README.md
```

## Quick Start

**See [SETUP.md](SETUP.md) for detailed installation instructions.**

### 1. Backend Setup (5 minutes)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

# Create .env file and add your API key
copy .env.example .env         # Windows
# cp .env.example .env         # Mac/Linux

# Edit .env and add:
# GEMINI_API_KEY=your_gemini_api_key_here

python init_db.py
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

### 2. Frontend Setup (3 minutes)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Upload & Process

1. Open `http://localhost:5173` in your browser
2. Click **Upload Document**
3. Upload a loan PDF document
4. Watch the AI extract data in real-time
5. View results in the Dashboard

## How It Works

1. **Document Upload**: User uploads a PDF loan document via drag-and-drop interface
2. **Text Extraction**: PyPDF2 extracts raw text from the PDF
3. **AI Analysis**: Google Gemini 1.5 Flash analyzes the text using a custom prompt to extract structured data
4. **Data Storage**: Extracted loan data and covenants are stored in the database
5. **Visualization**: React dashboard displays loans, covenants, and analytics

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Demo Workflow

1. **Upload a loan document** (PDF format)
2. **AI extracts key information**:
   - Borrower name
   - Facility type (Term Loan, Revolving Credit, etc.)
   - Loan amount and currency
   - Interest rate
   - Maturity and origination dates
   - Agent bank and lead arrangers
   - Purpose and governing law
   - Financial and non-financial covenants
3. **View in Dashboard**: See all extracted data with confidence scores
4. **Monitor Covenants**: Track compliance status and breach probabilities

## Commercial Value

This MVP demonstrates how LoanLattice can:
- **Reduce operational costs** by 60-80% through automation
- **Eliminate data entry errors** with AI-powered extraction
- **Accelerate loan processing** from hours to seconds
- **Improve compliance** with automated covenant monitoring
- **Scale easily** to handle thousands of loan documents

## Roadmap to Full Platform

This MVP focuses on the **Smart Document Engine**. The full LoanLattice platform includes:

1. **Market Glass** (Transparent Trading): Real-time secondary market intelligence
2. **ESG Truth Engine** (Greener Lending): Sustainability scoring and greenwashing detection
3. **Cross-platform Integration**: Unified loan lifecycle management

## Requirements

- Python 3.11 or higher
- Node.js 18 or higher
- Google Gemini API key (free tier available at https://makersuite.google.com/app/apikey)

## Troubleshooting

See [SETUP.md](SETUP.md) for common issues and solutions.

## License

MIT
