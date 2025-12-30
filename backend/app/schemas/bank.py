from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class BankBase(BaseModel):
    name: str
    short_name: Optional[str] = None
    bank_type: Optional[str] = None
    headquarters_country: Optional[str] = None
    headquarters_city: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    total_assets_usd: Optional[float] = None
    credit_rating: Optional[str] = None
    min_loan_amount: float = 0
    max_loan_amount: Optional[float] = None
    risk_appetite: Optional[str] = None

class BankCreate(BankBase):
    pass

class BankUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None
    contact_email: Optional[str] = None
    avg_interest_rate: Optional[float] = None

class BankResponse(BankBase):
    id: int
    is_active: bool
    is_verified: bool
    avg_interest_rate: Optional[float] = None
    participation_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class BankFilter(BaseModel):
    """Filters for bank search"""
    country: Optional[str] = None
    bank_type: Optional[str] = None
    risk_appetite: Optional[str] = None
    min_assets: Optional[float] = None
    max_assets: Optional[float] = None
    is_active: bool = True
