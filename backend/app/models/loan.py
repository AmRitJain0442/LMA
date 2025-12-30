from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)

    # Basic Loan Information
    borrower_name = Column(String, nullable=True)
    facility_type = Column(String, nullable=True)
    loan_amount = Column(Float, nullable=True)
    currency = Column(String, default="USD")
    interest_rate = Column(Float, nullable=True)
    maturity_date = Column(String, nullable=True)
    origination_date = Column(String, nullable=True)

    # Syndicate Information
    agent_bank = Column(String, nullable=True)
    lead_arrangers = Column(JSON, nullable=True)

    # Terms and Conditions
    purpose = Column(Text, nullable=True)
    governing_law = Column(String, nullable=True)

    # AI Confidence Scores
    extraction_confidence = Column(Float, default=0.0)
    raw_extracted_data = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    document = relationship("Document", backref="loans")
    covenants = relationship("Covenant", back_populates="loan", cascade="all, delete-orphan")
