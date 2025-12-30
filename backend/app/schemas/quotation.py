from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any
from app.models.quotation import QuotationStatus

class QuotationCreate(BaseModel):
    loan_proposal_id: int
    bank_ids: List[int]  # Send to multiple banks
    requested_amount: float
    requested_term_months: Optional[int] = None

class QuotationResponse(BaseModel):
    id: int
    loan_proposal_id: int
    bank_id: int
    requested_amount: float
    offered_amount: Optional[float] = None
    offered_interest_rate: Optional[float] = None
    offered_term_months: Optional[int] = None
    status: QuotationStatus
    is_selected: bool
    sent_at: datetime
    responded_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class QuotationUpdate(BaseModel):
    """Bank updates their quotation"""
    offered_amount: float
    offered_interest_rate: float
    offered_term_months: int
    conditions: Optional[str] = None
    processing_time_days: Optional[int] = None
    bank_contact_name: Optional[str] = None
    bank_contact_email: Optional[str] = None

class QuotationWithBank(QuotationResponse):
    """Quotation with bank details"""
    bank_name: Optional[str] = None
    bank_country: Optional[str] = None
    bank_rating: Optional[str] = None
