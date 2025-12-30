from sqlalchemy import Column, Integer, String, Float, Text, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.core.database import Base

class Bank(Base):
    __tablename__ = "banks"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    name = Column(String, nullable=False, unique=True, index=True)
    short_name = Column(String, nullable=True)
    bank_type = Column(String, nullable=True)  # "Commercial", "Investment", "Regional"

    # Contact Information
    headquarters_country = Column(String, nullable=True, index=True)
    headquarters_city = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    website = Column(String, nullable=True)

    # Financial Metrics
    total_assets_usd = Column(Float, nullable=True)  # Total assets in USD
    tier1_capital_ratio = Column(Float, nullable=True)
    credit_rating = Column(String, nullable=True)  # "AAA", "AA+", etc.

    # Lending Characteristics
    min_loan_amount = Column(Float, default=0)
    max_loan_amount = Column(Float, nullable=True)
    preferred_sectors = Column(JSON, nullable=True)  # List of sectors
    regions_served = Column(JSON, nullable=True)  # List of regions/countries

    # Risk Profile
    risk_appetite = Column(String, nullable=True)  # "Conservative", "Moderate", "Aggressive"
    default_rate_percentage = Column(Float, nullable=True)

    # Historical Performance
    avg_interest_rate = Column(Float, nullable=True)  # Average historical rate
    participation_count = Column(Integer, default=0)  # Number of syndications participated

    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Metadata
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
