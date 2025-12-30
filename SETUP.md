# LoanLattice MVP - Quick Start Guide

This guide will help you get the LoanLattice Smart Document Engine MVP up and running.

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn
- Google Gemini API key (free tier available)

## Installation Steps

### 1. Backend Setup

#### Step 1.1: Navigate to backend directory
```bash
cd backend
```

#### Step 1.2: Create virtual environment
**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

#### Step 1.3: Install dependencies
```bash
pip install -r requirements.txt
```

#### Step 1.4: Configure environment
```bash
copy .env.example .env   # Windows
# or
cp .env.example .env     # Mac/Linux
```

Edit the `.env` file and add your Google Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

**Get your free Gemini API key:**
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

#### Step 1.5: Initialize database
```bash
python init_db.py
```

#### Step 1.6: Start the backend server
```bash
uvicorn app.main:app --reload
```

The API will be running at `http://localhost:8000`

**Verify backend:** Open `http://localhost:8000/docs` in your browser to see the API documentation.

---

### 2. Frontend Setup

#### Step 2.1: Open a new terminal and navigate to frontend directory
```bash
cd frontend
```

#### Step 2.2: Install dependencies
```bash
npm install
```

#### Step 2.3: Start the development server
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

**Verify frontend:** Open `http://localhost:5173` in your browser.

---

## Using the MVP

### 1. Upload a Document

1. Navigate to **Upload Document** in the top menu
2. Drag and drop a loan PDF document, or click to browse
3. Click **Upload & Process Document**
4. Wait for AI extraction to complete (usually 5-10 seconds)

### 2. View Dashboard

1. Click **Dashboard** in the top menu
2. View statistics on documents, loans, and total portfolio value
3. Browse the loan table to see extracted data
4. Click on any loan to see more details

### 3. Monitor Covenants

1. Click **Covenant Monitor** in the top menu
2. View all extracted covenants with status indicators
3. Filter by status: All, Breach, Warning, or Compliant
4. Review breach probability forecasts

---

## Features Demonstrated

### Smart Document Engine
- AI-powered PDF text extraction
- Intelligent data extraction (borrower, amount, terms, covenants)
- Confidence scoring for extractions
- Real-time processing status

### Covenant Monitoring
- Automatic covenant identification
- Status tracking (compliant, warning, breach)
- Covenant type classification
- Breach probability predictions

### Dashboard Analytics
- Portfolio overview statistics
- Document processing status
- At-risk covenant alerts
- Loan data visualization

---

## Troubleshooting

### Backend Issues

**"ModuleNotFoundError"**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

**"API key not found"**
- Check that `.env` file exists in `backend/` directory
- Verify API key is correctly set in `.env`

**"Database error"**
- Run `python init_db.py` to recreate database

### Frontend Issues

**"VITE_API_URL not found"**
- The frontend will default to `http://localhost:8000`
- Create `.env` file if you need a different URL

**"Network error"**
- Ensure backend is running at `http://localhost:8000`
- Check browser console for detailed errors

**"npm install fails"**
- Try deleting `node_modules` and `package-lock.json`
- Run `npm install` again

---

## API Endpoints

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints:
- `POST /api/documents/upload` - Upload loan document
- `GET /api/loans/` - List all loans
- `GET /api/covenants/` - List all covenants
- `GET /api/covenants/alerts/at-risk` - Get at-risk covenants

---

## Demo Data

To test the MVP without real loan documents, you can:

1. Create a sample loan document PDF with the following information:
   - Borrower name
   - Loan amount
   - Interest rate
   - Maturity date
   - Basic covenant terms

2. Upload through the UI and watch the AI extract the data

---

## Next Steps for Production

This MVP demonstrates core functionality. For production deployment:

1. **Database**: Replace SQLite with PostgreSQL
2. **Authentication**: Add user authentication and authorization
3. **Storage**: Move to cloud storage (AWS S3, Azure Blob)
4. **Monitoring**: Add application monitoring and logging
5. **Testing**: Implement comprehensive unit and integration tests
6. **Deployment**: Deploy to cloud platform (AWS, Azure, GCP)
7. **Enhanced AI**: Fine-tune models on loan-specific datasets
8. **ESG Integration**: Add sustainability scoring features
9. **Trading Module**: Implement Market Glass features

---

## Support

For issues or questions:
- Check the README files in `backend/` and `frontend/` directories
- Review API documentation at `http://localhost:8000/docs`
- Ensure all prerequisites are installed correctly

---

## License

MIT
