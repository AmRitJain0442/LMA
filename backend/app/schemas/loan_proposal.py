from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.loan_proposal import ProposalStatus

class LoanProposalBase(BaseModel):
    client_name: str
    client_industry: Optional[str] = None
    client_country: Optional[str] = None
    client_website: Optional[str] = None
    requested_amount: float
    currency: str = "USD"
    loan_purpose: Optional[str] = None
    desired_term_months: Optional[int] = None
    max_acceptable_rate: Optional[float] = None

class LoanProposalCreate(LoanProposalBase):
    pass

class LoanProposalResponse(LoanProposalBase):
    id: int
    status: ProposalStatus
    selected_mla_id: Optional[int] = None
    research_completed: bool
    pitch_generated: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LoanProposalDetail(LoanProposalResponse):
    """Extended response with related data"""
    mla_bids_count: Optional[int] = 0
    quotations_count: Optional[int] = 0
    has_syndicate: bool = False
