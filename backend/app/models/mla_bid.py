from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Enum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class BidStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class MLABid(Base):
    __tablename__ = "mla_bids"

    id = Column(Integer, primary_key=True, index=True)
    loan_proposal_id = Column(Integer, ForeignKey("loan_proposals.id"), nullable=False)

    # Bidder Information
    organization_name = Column(String, nullable=False)
    organization_type = Column(String, nullable=True)  # "Investment Bank", "Commercial Bank"
    contact_person = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)

    # Bid Details
    proposed_fee_percentage = Column(Float, nullable=False)  # MLA fee as % of loan
    proposed_timeline_days = Column(Integer, nullable=True)  # Days to close
    expertise_score = Column(Float, nullable=True)  # Self-assessed expertise
    past_deals_count = Column(Integer, default=0)

    # Bid Content
    pitch_summary = Column(Text, nullable=True)
    value_proposition = Column(Text, nullable=True)

    # Status
    status = Column(Enum(BidStatus), default=BidStatus.PENDING)
    is_winner = Column(Boolean, default=False)

    # Timestamps
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    evaluated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    loan_proposal = relationship("LoanProposal", back_populates="mla_bids")
