from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.covenant import CovenantType, CovenantStatus

class CovenantBase(BaseModel):
    covenant_type: CovenantType
    covenant_name: str
    description: Optional[str] = None
    metric_name: Optional[str] = None
    threshold_value: Optional[float] = None
    current_value: Optional[float] = None
    comparison_operator: Optional[str] = None
    testing_frequency: Optional[str] = None

class CovenantCreate(CovenantBase):
    loan_id: int

class CovenantUpdate(BaseModel):
    current_value: Optional[float] = None
    status: Optional[CovenantStatus] = None

class CovenantResponse(CovenantBase):
    id: int
    loan_id: int
    status: CovenantStatus
    is_active: bool
    breach_probability_30d: Optional[float] = None
    breach_probability_60d: Optional[float] = None
    breach_probability_90d: Optional[float] = None
    last_tested_date: Optional[datetime] = None
    next_test_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
