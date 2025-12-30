from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import documents, loans, covenants

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Syndicated Loan Document Intelligence Platform",
    version="0.1.0"
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
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(loans.router, prefix="/api/loans", tags=["loans"])
app.include_router(covenants.router, prefix="/api/covenants", tags=["covenants"])

@app.get("/")
async def root():
    return {
        "message": "LoanLattice API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
