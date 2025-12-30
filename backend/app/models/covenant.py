from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class CovenantType(str, enum.Enum):
    FINANCIAL = "financial"
    AFFIRMATIVE = "affirmative"
    NEGATIVE = "negative"
    REPORTING = "reporting"

class CovenantStatus(str, enum.Enum):
    COMPLIANT = "compliant"
    WARNING = "warning"
    BREACH = "breach"
    UNKNOWN = "unknown"

class Covenant(Base):
    __tablename__ = "covenants"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False)

    # Covenant Details
    covenant_type = Column(Enum(CovenantType), nullable=False)
    covenant_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Financial Covenant Specifics
    metric_name = Column(String, nullable=True)  # e.g., "Debt-to-EBITDA", "Interest Coverage"
    threshold_value = Column(Float, nullable=True)
    current_value = Column(Float, nullable=True)
    comparison_operator = Column(String, nullable=True)  # e.g., "<=", ">=", "=="

    # Status and Monitoring
    status = Column(Enum(CovenantStatus), default=CovenantStatus.UNKNOWN)
    is_active = Column(Boolean, default=True)
    breach_probability_30d = Column(Float, nullable=True)  # Predicted probability of breach in 30 days
    breach_probability_60d = Column(Float, nullable=True)
    breach_probability_90d = Column(Float, nullable=True)

    # Testing and Compliance
    testing_frequency = Column(String, nullable=True)  # e.g., "quarterly", "annually"
    last_tested_date = Column(DateTime, nullable=True)
    next_test_date = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    loan = relationship("Loan", back_populates="covenants")
