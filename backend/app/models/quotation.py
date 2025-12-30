from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, Enum, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class QuotationStatus(str, enum.Enum):
    SENT = "sent"
    VIEWED = "viewed"
    RESPONDED = "responded"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)
    loan_proposal_id = Column(Integer, ForeignKey("loan_proposals.id"), nullable=False)
    bank_id = Column(Integer, ForeignKey("banks.id"), nullable=False)

    # Request Details
    requested_amount = Column(Float, nullable=False)
    requested_term_months = Column(Integer, nullable=True)

    # Bank Response
    offered_amount = Column(Float, nullable=True)
    offered_interest_rate = Column(Float, nullable=True)  # Annual percentage
    offered_term_months = Column(Integer, nullable=True)

    # Terms & Conditions
    conditions = Column(Text, nullable=True)
    covenants = Column(JSON, nullable=True)  # List of covenant requirements
    fees = Column(JSON, nullable=True)  # Various fees (commitment, facility, etc.)

    # Additional Details
    processing_time_days = Column(Integer, nullable=True)
    early_repayment_penalty = Column(Float, nullable=True)
    collateral_requirements = Column(Text, nullable=True)

    # Status
    status = Column(Enum(QuotationStatus), default=QuotationStatus.SENT)
    is_selected = Column(Boolean, default=False)  # Selected in final syndicate

    # Communication
    bank_contact_name = Column(String, nullable=True)
    bank_contact_email = Column(String, nullable=True)
    response_notes = Column(Text, nullable=True)

    # Timestamps
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    responded_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    loan_proposal = relationship("LoanProposal", back_populates="quotations")
    bank = relationship("Bank")
