from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Enum, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class ProposalStatus(str, enum.Enum):
    DRAFT = "draft"
    MLA_BIDDING = "mla_bidding"
    MLA_SELECTED = "mla_selected"
    RESEARCH_IN_PROGRESS = "research_in_progress"
    PITCH_GENERATED = "pitch_generated"
    SENT_TO_BANKS = "sent_to_banks"
    COLLECTING_QUOTES = "collecting_quotes"
    OPTIMIZATION_COMPLETE = "optimization_complete"
    AWAITING_CLIENT_APPROVAL = "awaiting_client_approval"
    APPROVED = "approved"
    REJECTED = "rejected"

class LoanProposal(Base):
    __tablename__ = "loan_proposals"

    id = Column(Integer, primary_key=True, index=True)

    # Client Information
    client_name = Column(String, nullable=False, index=True)
    client_industry = Column(String, nullable=True)
    client_country = Column(String, nullable=True)
    client_website = Column(String, nullable=True)

    # Loan Requirements
    requested_amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    loan_purpose = Column(Text, nullable=True)
    desired_term_months = Column(Integer, nullable=True)
    max_acceptable_rate = Column(Float, nullable=True)

    # Status
    status = Column(Enum(ProposalStatus), default=ProposalStatus.DRAFT)
    selected_mla_id = Column(Integer, nullable=True)  # Reference to winning MLABid

    # Research & Pitch
    research_completed = Column(Boolean, default=False)
    pitch_generated = Column(Boolean, default=False)

    # Timeline
    deadline = Column(DateTime(timezone=True), nullable=True)

    # Metadata
    notes = Column(Text, nullable=True)
    attachments = Column(JSON, nullable=True)  # List of attachment URLs

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    mla_bids = relationship("MLABid", back_populates="loan_proposal", cascade="all, delete-orphan")
    research = relationship("ClientResearch", back_populates="loan_proposal", uselist=False)
    pitch = relationship("Pitch", back_populates="loan_proposal", uselist=False)
    quotations = relationship("Quotation", back_populates="loan_proposal", cascade="all, delete-orphan")
    syndicate = relationship("Syndicate", back_populates="loan_proposal", uselist=False)
