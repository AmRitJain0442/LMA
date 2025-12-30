from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Syndicate(Base):
    __tablename__ = "syndicates"

    id = Column(Integer, primary_key=True, index=True)
    loan_proposal_id = Column(Integer, ForeignKey("loan_proposals.id"), nullable=False, unique=True)

    # Syndicate Details
    total_amount = Column(Float, nullable=False)
    weighted_avg_interest_rate = Column(Float, nullable=False)
    number_of_banks = Column(Integer, default=0)

    # Optimization Metrics
    optimization_score = Column(Float, nullable=True)  # Quality of optimization
    total_fees = Column(Float, nullable=True)

    # Aggregated Terms
    aggregated_terms_text = Column(Text, nullable=True)
    aggregated_covenants = Column(JSON, nullable=True)
    aggregated_conditions = Column(JSON, nullable=True)

    # Status
    is_optimized = Column(Boolean, default=False)
    is_approved_by_client = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    loan_proposal = relationship("LoanProposal", back_populates="syndicate")
    members = relationship("SyndicateMember", back_populates="syndicate", cascade="all, delete-orphan")


class SyndicateMember(Base):
    __tablename__ = "syndicate_members"

    id = Column(Integer, primary_key=True, index=True)
    syndicate_id = Column(Integer, ForeignKey("syndicates.id"), nullable=False)
    bank_id = Column(Integer, ForeignKey("banks.id"), nullable=False)
    quotation_id = Column(Integer, ForeignKey("quotations.id"), nullable=False)

    # Member Details
    allocated_amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    participation_percentage = Column(Float, nullable=True)  # % of total loan

    # Role
    role = Column(String, nullable=True)  # "Lead", "Participant", "Junior"

    # Terms
    specific_conditions = Column(Text, nullable=True)

    # Timestamps
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    syndicate = relationship("Syndicate", back_populates="members")
    bank = relationship("Bank")
    quotation = relationship("Quotation")
