# LoanLattice Backend

FastAPI backend for AI-powered loan document processing.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your Google Gemini API key to `.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your free Gemini API key from: https://makersuite.google.com/app/apikey

5. Initialize the database:
```bash
python init_db.py
```

6. Run the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Documents
- `POST /api/documents/upload` - Upload a PDF loan document
- `GET /api/documents/{id}` - Get document details
- `GET /api/documents/` - List all documents
- `POST /api/documents/{id}/process` - Manually process a document

### Loans
- `GET /api/loans/{id}` - Get loan details with covenants
- `GET /api/loans/` - List all loans
- `GET /api/loans/document/{document_id}` - Get loans by document

### Covenants
- `GET /api/covenants/{id}` - Get covenant details
- `GET /api/covenants/` - List all covenants
- `GET /api/covenants/loan/{loan_id}` - Get covenants for a loan
- `PATCH /api/covenants/{id}` - Update covenant status/value
- `GET /api/covenants/alerts/at-risk` - Get at-risk covenants

## Architecture

```
backend/
├── app/
│   ├── api/           # API endpoints
│   ├── core/          # Configuration & database
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   └── services/      # Business logic
│       ├── pdf_extractor.py    # PDF text extraction
│       ├── ai_extractor.py     # AI-powered data extraction
│       └── document_service.py # Document processing orchestration
└── uploads/           # Uploaded documents
```
