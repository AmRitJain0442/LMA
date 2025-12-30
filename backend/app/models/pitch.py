from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Pitch(Base):
    __tablename__ = "pitches"

    id = Column(Integer, primary_key=True, index=True)
    loan_proposal_id = Column(Integer, ForeignKey("loan_proposals.id"), nullable=False, unique=True)

    # Pitch Content
    title = Column(String, nullable=True)
    executive_summary = Column(Text, nullable=True)
    company_overview = Column(Text, nullable=True)
    financial_highlights = Column(Text, nullable=True)
    loan_structure = Column(Text, nullable=True)
    risk_mitigation = Column(Text, nullable=True)
    market_opportunity = Column(Text, nullable=True)
    management_team = Column(Text, nullable=True)
    use_of_proceeds = Column(Text, nullable=True)
    repayment_plan = Column(Text, nullable=True)

    # Full Document
    full_pitch_markdown = Column(Text, nullable=True)
    full_pitch_html = Column(Text, nullable=True)

    # Metadata
    word_count = Column(Integer, nullable=True)
    generated_by_ai = Column(String, default="gemini-1.5-flash")

    # File Storage
    pdf_file_path = Column(String, nullable=True)

    # Timestamps
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    last_edited_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    loan_proposal = relationship("LoanProposal", back_populates="pitch")
