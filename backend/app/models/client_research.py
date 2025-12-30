from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ClientResearch(Base):
    __tablename__ = "client_research"

    id = Column(Integer, primary_key=True, index=True)
    loan_proposal_id = Column(Integer, ForeignKey("loan_proposals.id"), nullable=False, unique=True)

    # Company Overview
    company_description = Column(Text, nullable=True)
    founded_year = Column(Integer, nullable=True)
    employee_count = Column(Integer, nullable=True)
    headquarters_location = Column(String, nullable=True)

    # Financial Data
    annual_revenue = Column(Float, nullable=True)
    net_income = Column(Float, nullable=True)
    total_assets = Column(Float, nullable=True)
    total_liabilities = Column(Float, nullable=True)
    ebitda = Column(Float, nullable=True)

    # Market Data (if publicly traded)
    stock_symbol = Column(String, nullable=True)
    market_cap = Column(Float, nullable=True)
    stock_price = Column(Float, nullable=True)

    # Credit & Risk
    credit_score = Column(Integer, nullable=True)
    credit_rating = Column(String, nullable=True)
    debt_to_equity_ratio = Column(Float, nullable=True)
    current_ratio = Column(Float, nullable=True)

    # Industry Analysis
    industry_sector = Column(String, nullable=True)
    market_position = Column(String, nullable=True)  # "Leader", "Challenger", etc.
    competitors = Column(JSON, nullable=True)  # List of competitor names

    # News & Sentiment
    recent_news = Column(JSON, nullable=True)  # List of news articles
    sentiment_score = Column(Float, nullable=True)  # -1 to 1

    # Web Data
    web_presence_score = Column(Float, nullable=True)
    social_media_links = Column(JSON, nullable=True)

    # AI Analysis
    risk_assessment = Column(Text, nullable=True)
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    opportunities = Column(JSON, nullable=True)
    threats = Column(JSON, nullable=True)

    # Raw Data
    raw_research_data = Column(JSON, nullable=True)
    data_sources = Column(JSON, nullable=True)  # List of sources used

    # Timestamps
    researched_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    loan_proposal = relationship("LoanProposal", back_populates="research")
