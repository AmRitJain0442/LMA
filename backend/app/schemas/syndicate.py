from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class SyndicateMemberResponse(BaseModel):
    id: int
    bank_id: int
    bank_name: Optional[str] = None
    allocated_amount: float
    interest_rate: float
    participation_percentage: Optional[float] = None
    role: Optional[str] = None

    class Config:
        from_attributes = True

class SyndicateResponse(BaseModel):
    id: int
    loan_proposal_id: int
    total_amount: float
    weighted_avg_interest_rate: float
    number_of_banks: int
    optimization_score: Optional[float] = None
    is_optimized: bool
    is_approved_by_client: bool
    created_at: datetime
    members: List[SyndicateMemberResponse] = []

    class Config:
        from_attributes = True

class OptimizationRequest(BaseModel):
    """Request to optimize syndicate"""
    loan_proposal_id: int
    target_amount: float
    max_interest_rate: Optional[float] = None
    min_banks: Optional[int] = 1
    max_banks: Optional[int] = 10
