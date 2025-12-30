from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.covenant import Covenant, CovenantStatus
from app.schemas.covenant import CovenantResponse, CovenantUpdate

router = APIRouter()

@router.get("/{covenant_id}", response_model=CovenantResponse)
def get_covenant(covenant_id: int, db: Session = Depends(get_db)):
    """Get covenant details"""
    covenant = db.query(Covenant).filter(Covenant.id == covenant_id).first()

    if not covenant:
        raise HTTPException(status_code=404, detail="Covenant not found")

    return covenant

@router.get("/", response_model=List[CovenantResponse])
def list_covenants(
    skip: int = 0,
    limit: int = 100,
    status: CovenantStatus = None,
    db: Session = Depends(get_db)
):
    """List all covenants, optionally filtered by status"""
    query = db.query(Covenant)

    if status:
        query = query.filter(Covenant.status == status)

    covenants = query.offset(skip).limit(limit).all()
    return covenants

@router.get("/loan/{loan_id}", response_model=List[CovenantResponse])
def get_loan_covenants(loan_id: int, db: Session = Depends(get_db)):
    """Get all covenants for a specific loan"""
    covenants = db.query(Covenant).filter(Covenant.loan_id == loan_id).all()
    return covenants

@router.patch("/{covenant_id}", response_model=CovenantResponse)
def update_covenant(
    covenant_id: int,
    covenant_update: CovenantUpdate,
    db: Session = Depends(get_db)
):
    """Update covenant status or current value"""
    covenant = db.query(Covenant).filter(Covenant.id == covenant_id).first()

    if not covenant:
        raise HTTPException(status_code=404, detail="Covenant not found")

    if covenant_update.current_value is not None:
        covenant.current_value = covenant_update.current_value

        if covenant.threshold_value is not None and covenant.comparison_operator:
            covenant.status = _calculate_covenant_status(
                covenant.current_value,
                covenant.threshold_value,
                covenant.comparison_operator
            )

    if covenant_update.status is not None:
        covenant.status = covenant_update.status

    db.commit()
    db.refresh(covenant)

    return covenant

@router.get("/alerts/at-risk", response_model=List[CovenantResponse])
def get_at_risk_covenants(db: Session = Depends(get_db)):
    """Get covenants that are at risk of breach (warning or breach status)"""
    covenants = db.query(Covenant).filter(
        Covenant.status.in_([CovenantStatus.WARNING, CovenantStatus.BREACH])
    ).all()
    return covenants

def _calculate_covenant_status(
    current: float,
    threshold: float,
    operator: str
) -> CovenantStatus:
    """Calculate covenant status based on current value vs threshold"""
    try:
        if operator == "<=":
            if current <= threshold * 0.8:
                return CovenantStatus.COMPLIANT
            elif current <= threshold:
                return CovenantStatus.WARNING
            else:
                return CovenantStatus.BREACH
        elif operator == ">=":
            if current >= threshold * 1.2:
                return CovenantStatus.COMPLIANT
            elif current >= threshold:
                return CovenantStatus.WARNING
            else:
                return CovenantStatus.BREACH
        elif operator == "==" or operator == "=":
            tolerance = threshold * 0.05
            if abs(current - threshold) <= tolerance:
                return CovenantStatus.COMPLIANT
            else:
                return CovenantStatus.BREACH
        else:
            return CovenantStatus.UNKNOWN
    except:
        return CovenantStatus.UNKNOWN
