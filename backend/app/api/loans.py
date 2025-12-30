from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.loan import Loan
from app.schemas.loan import LoanResponse, LoanWithCovenants

router = APIRouter()

@router.get("/{loan_id}", response_model=LoanWithCovenants)
def get_loan(loan_id: int, db: Session = Depends(get_db)):
    """Get loan details with covenants"""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()

    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    return loan

@router.get("/", response_model=List[LoanResponse])
def list_loans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all loans"""
    loans = db.query(Loan).offset(skip).limit(limit).all()
    return loans

@router.get("/document/{document_id}", response_model=List[LoanResponse])
def get_loans_by_document(document_id: int, db: Session = Depends(get_db)):
    """Get all loans associated with a document"""
    loans = db.query(Loan).filter(Loan.document_id == document_id).all()
    return loans
