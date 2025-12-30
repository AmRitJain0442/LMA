from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any, ForwardRef

class LoanBase(BaseModel):
    borrower_name: Optional[str] = None
    facility_type: Optional[str] = None
    loan_amount: Optional[float] = None
    currency: str = "USD"
    interest_rate: Optional[float] = None
    maturity_date: Optional[str] = None
    origination_date: Optional[str] = None
    agent_bank: Optional[str] = None
    purpose: Optional[str] = None
    governing_law: Optional[str] = None

class LoanCreate(LoanBase):
    document_id: int

class LoanResponse(LoanBase):
    id: int
    document_id: int
    lead_arrangers: Optional[List[str]] = None
    extraction_confidence: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Import after base classes to avoid circular dependency
from app.schemas.covenant import CovenantResponse

class LoanWithCovenants(LoanResponse):
    covenants: List[CovenantResponse] = []
