from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import documents, loans, covenants, loan_proposals

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Syndicated Loan Marketplace & Intelligence Platform",
    version="0.2.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
# Original MVP features
app.include_router(documents.router, prefix="/api/documents", tags=["Document Processing"])
app.include_router(loans.router, prefix="/api/loans", tags=["Loan Data"])
app.include_router(covenants.router, prefix="/api/covenants", tags=["Covenant Monitoring"])

# New Syndication Marketplace features
app.include_router(loan_proposals.router, prefix="/api/loan-proposals", tags=["Loan Proposals"])

# Import new routers
from app.api import banks, quotations

app.include_router(banks.router, prefix="/api/banks", tags=["Bank Directory"])
app.include_router(quotations.router, prefix="/api/quotations", tags=["Quotations & AI Generation"])
# app.include_router(syndicates.router, prefix="/api/syndicates", tags=["Syndicate Optimization"])

@app.get("/")
async def root():
    return {
        "message": "LoanLattice Syndication Marketplace API",
        "version": "0.2.0",
        "features": [
            "AI Document Processing",
            "Loan Data Extraction",
            "Covenant Monitoring",
            "AI Research Agent",
            "Pitch Generation",
            "Loan Syndication (In Progress)"
        ],
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
