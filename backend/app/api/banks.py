from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.bank import Bank
from app.schemas.bank import BankCreate, BankResponse, BankUpdate, BankFilter

router = APIRouter()

@router.post("/", response_model=BankResponse)
def create_bank(bank: BankCreate, db: Session = Depends(get_db)):
    """Add a new bank to the directory"""
    # Check if bank already exists
    existing = db.query(Bank).filter(Bank.name == bank.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bank with this name already exists")

    db_bank = Bank(**bank.dict())
    db.add(db_bank)
    db.commit()
    db.refresh(db_bank)

    return db_bank

@router.get("/", response_model=List[BankResponse])
def list_banks(
    skip: int = 0,
    limit: int = 100,
    country: Optional[str] = None,
    bank_type: Optional[str] = None,
    risk_appetite: Optional[str] = None,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """
    List banks with optional filters

    Filters:
    - country: Filter by headquarters country
    - bank_type: Commercial, Investment, Development
    - risk_appetite: Conservative, Moderate, Aggressive
    - is_active: Only active banks (default: true)
    """
    query = db.query(Bank)

    if is_active:
        query = query.filter(Bank.is_active == True)

    if country:
        query = query.filter(Bank.headquarters_country == country)

    if bank_type:
        query = query.filter(Bank.bank_type == bank_type)

    if risk_appetite:
        query = query.filter(Bank.risk_appetite == risk_appetite)

    banks = query.offset(skip).limit(limit).all()
    return banks

@router.get("/search", response_model=List[BankResponse])
def search_banks(
    loan_amount: Optional[float] = None,
    sector: Optional[str] = None,
    region: Optional[str] = None,
    min_rating: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Advanced bank search for loan matching

    - loan_amount: Find banks that can handle this amount
    - sector: Find banks interested in this sector
    - region: Find banks serving this region
    - min_rating: Minimum credit rating (e.g., 'A', 'AA')
    """
    query = db.query(Bank).filter(Bank.is_active == True)

    if loan_amount:
        query = query.filter(
            Bank.min_loan_amount <= loan_amount,
            Bank.max_loan_amount >= loan_amount
        )

    # Note: Sector and region filters require JSON query support
    # For now, we'll return all and filter in Python
    banks = query.all()

    # Python-side filtering for JSON fields
    if sector and banks:
        banks = [b for b in banks if b.preferred_sectors and sector in b.preferred_sectors]

    if region and banks:
        banks = [b for b in banks if b.regions_served and region in b.regions_served]

    return banks

@router.get("/stats")
def get_bank_stats(db: Session = Depends(get_db)):
    """Get statistics about the bank directory"""
    total_banks = db.query(Bank).filter(Bank.is_active == True).count()

    by_country = db.query(
        Bank.headquarters_country,
        func.count(Bank.id)
    ).filter(Bank.is_active == True).group_by(Bank.headquarters_country).all()

    by_type = db.query(
        Bank.bank_type,
        func.count(Bank.id)
    ).filter(Bank.is_active == True).group_by(Bank.bank_type).all()

    by_risk = db.query(
        Bank.risk_appetite,
        func.count(Bank.id)
    ).filter(Bank.is_active == True).group_by(Bank.risk_appetite).all()

    return {
        "total_banks": total_banks,
        "by_country": {country: count for country, count in by_country},
        "by_type": {type_: count for type_, count in by_type},
        "by_risk_appetite": {risk: count for risk, count in by_risk}
    }

@router.get("/{bank_id}", response_model=BankResponse)
def get_bank(bank_id: int, db: Session = Depends(get_db)):
    """Get bank details"""
    bank = db.query(Bank).filter(Bank.id == bank_id).first()

    if not bank:
        raise HTTPException(status_code=404, detail="Bank not found")

    return bank

@router.put("/{bank_id}", response_model=BankResponse)
def update_bank(bank_id: int, bank_update: BankUpdate, db: Session = Depends(get_db)):
    """Update bank information"""
    bank = db.query(Bank).filter(Bank.id == bank_id).first()

    if not bank:
        raise HTTPException(status_code=404, detail="Bank not found")

    # Update fields
    for field, value in bank_update.dict(exclude_unset=True).items():
        setattr(bank, field, value)

    db.commit()
    db.refresh(bank)

    return bank

# Import for stats endpoint
from sqlalchemy import func
