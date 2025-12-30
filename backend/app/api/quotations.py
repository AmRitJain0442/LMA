from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.quotation import Quotation, QuotationStatus
from app.models.bank import Bank
from app.models.loan_proposal import LoanProposal, ProposalStatus
from app.models.client_research import ClientResearch
from app.schemas.quotation import QuotationCreate, QuotationResponse, QuotationUpdate, QuotationWithBank
from app.services.quotation_generator import QuotationGenerator

router = APIRouter()

@router.post("/", response_model=dict)
async def create_quotation_requests(
    quotation_request: QuotationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Send quotation requests to multiple banks

    AI will automatically generate responses from banks' perspectives
    """
    # Validate proposal exists
    proposal = db.query(LoanProposal).filter(
        LoanProposal.id == quotation_request.loan_proposal_id
    ).first()

    if not proposal:
        raise HTTPException(status_code=404, detail="Loan proposal not found")

    # Check if research is done
    research = db.query(ClientResearch).filter(
        ClientResearch.loan_proposal_id == proposal.id
    ).first()

    if not research:
        raise HTTPException(
            status_code=400,
            detail="Client research not completed. Run research first."
        )

    # Validate banks exist
    banks = db.query(Bank).filter(Bank.id.in_(quotation_request.bank_ids)).all()

    if len(banks) != len(quotation_request.bank_ids):
        raise HTTPException(status_code=400, detail="Some banks not found")

    # Create quotation records
    quotations_created = []
    for bank in banks:
        quotation = Quotation(
            loan_proposal_id=proposal.id,
            bank_id=bank.id,
            requested_amount=quotation_request.requested_amount,
            requested_term_months=quotation_request.requested_term_months,
            status=QuotationStatus.SENT
        )
        db.add(quotation)
        quotations_created.append(quotation)

    db.commit()

    # Update proposal status
    proposal.status = ProposalStatus.SENT_TO_BANKS
    db.commit()

    # Trigger AI quotation generation in background
    background_tasks.add_task(
        _generate_ai_quotations,
        proposal.id,
        [q.id for q in quotations_created]
    )

    return {
        "message": f"Quotation requests sent to {len(banks)} banks",
        "proposal_id": proposal.id,
        "banks": [{"id": b.id, "name": b.name} for b in banks],
        "quotations_created": len(quotations_created),
        "status": "AI is generating responses..."
    }

@router.get("/", response_model=List[QuotationResponse])
def list_quotations(
    skip: int = 0,
    limit: int = 100,
    status: QuotationStatus = None,
    db: Session = Depends(get_db)
):
    """List all quotations"""
    query = db.query(Quotation)

    if status:
        query = query.filter(Quotation.status == status)

    quotations = query.offset(skip).limit(limit).all()
    return quotations

@router.get("/proposal/{proposal_id}", response_model=List[QuotationWithBank])
def get_quotations_for_proposal(proposal_id: int, db: Session = Depends(get_db)):
    """Get all quotations for a loan proposal"""
    quotations = db.query(Quotation).filter(
        Quotation.loan_proposal_id == proposal_id
    ).all()

    # Enhance with bank details
    result = []
    for q in quotations:
        bank = db.query(Bank).filter(Bank.id == q.bank_id).first()
        q_dict = QuotationResponse.from_orm(q).dict()
        q_dict['bank_name'] = bank.name if bank else None
        q_dict['bank_country'] = bank.headquarters_country if bank else None
        q_dict['bank_rating'] = bank.credit_rating if bank else None
        result.append(QuotationWithBank(**q_dict))

    return result

@router.get("/{quotation_id}", response_model=QuotationResponse)
def get_quotation(quotation_id: int, db: Session = Depends(get_db)):
    """Get quotation details"""
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()

    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")

    return quotation

@router.put("/{quotation_id}", response_model=QuotationResponse)
def update_quotation(
    quotation_id: int,
    quotation_update: QuotationUpdate,
    db: Session = Depends(get_db)
):
    """
    Update quotation (simulates bank updating their response)

    In production, this would be called by banks via their portal
    """
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()

    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")

    # Update fields
    for field, value in quotation_update.dict(exclude_unset=True).items():
        setattr(quotation, field, value)

    quotation.status = QuotationStatus.RESPONDED
    quotation.responded_at = datetime.utcnow()

    db.commit()
    db.refresh(quotation)

    return quotation

@router.post("/{quotation_id}/regenerate", response_model=dict)
async def regenerate_quotation(quotation_id: int, db: Session = Depends(get_db)):
    """
    Regenerate AI quotation for a specific bank

    Useful if you want to get a different response
    """
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()

    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")

    # Get data
    proposal = db.query(LoanProposal).filter(
        LoanProposal.id == quotation.loan_proposal_id
    ).first()

    research = db.query(ClientResearch).filter(
        ClientResearch.loan_proposal_id == proposal.id
    ).first()

    bank = db.query(Bank).filter(Bank.id == quotation.bank_id).first()

    # Generate new quotation
    generator = QuotationGenerator()

    loan_proposal_data = {
        'client_name': proposal.client_name,
        'client_industry': proposal.client_industry,
        'requested_amount': proposal.requested_amount,
        'currency': proposal.currency,
        'loan_purpose': proposal.loan_purpose,
        'desired_term_months': proposal.desired_term_months,
        'max_acceptable_rate': proposal.max_acceptable_rate
    }

    bank_profile = {
        'bank_type': bank.bank_type,
        'headquarters_country': bank.headquarters_country,
        'credit_rating': bank.credit_rating,
        'risk_appetite': bank.risk_appetite,
        'avg_interest_rate': bank.avg_interest_rate,
        'preferred_sectors': bank.preferred_sectors or [],
        'min_loan_amount': bank.min_loan_amount,
        'max_loan_amount': bank.max_loan_amount,
        'contact_email': bank.contact_email
    }

    client_research_data = {
        'annual_revenue': research.annual_revenue,
        'credit_rating': research.credit_rating,
        'debt_to_equity_ratio': research.debt_to_equity_ratio,
        'risk_assessment': research.risk_assessment,
        'strengths': research.strengths or []
    }

    ai_quotation = await generator.generate_quotation(
        bank.name,
        bank_profile,
        loan_proposal_data,
        client_research_data
    )

    # Update quotation
    if ai_quotation.get('will_participate'):
        quotation.offered_amount = ai_quotation.get('offered_amount')
        quotation.offered_interest_rate = ai_quotation.get('offered_interest_rate')
        quotation.offered_term_months = ai_quotation.get('offered_term_months')
        quotation.conditions = ai_quotation.get('conditions')
        quotation.covenants = ai_quotation.get('covenants')
        quotation.processing_time_days = ai_quotation.get('processing_time_days')
        quotation.early_repayment_penalty = ai_quotation.get('early_repayment_penalty')
        quotation.collateral_requirements = ai_quotation.get('collateral_requirements')
        quotation.bank_contact_name = ai_quotation.get('bank_contact_name')
        quotation.bank_contact_email = ai_quotation.get('bank_contact_email')
        quotation.response_notes = ai_quotation.get('rationale')
        quotation.status = QuotationStatus.RESPONDED
        quotation.responded_at = datetime.utcnow()
        quotation.fees = ai_quotation.get('fees')
    else:
        quotation.status = QuotationStatus.REJECTED
        quotation.response_notes = ai_quotation.get('decline_reason')

    db.commit()
    db.refresh(quotation)

    return {
        "message": "Quotation regenerated successfully",
        "quotation_id": quotation.id,
        "status": quotation.status,
        "will_participate": ai_quotation.get('will_participate')
    }

async def _generate_ai_quotations(proposal_id: int, quotation_ids: List[int]):
    """Background task to generate AI quotations"""
    from app.core.database import SessionLocal
    db = SessionLocal()

    try:
        # Get proposal and research
        proposal = db.query(LoanProposal).filter(LoanProposal.id == proposal_id).first()
        research = db.query(ClientResearch).filter(
            ClientResearch.loan_proposal_id == proposal_id
        ).first()

        loan_proposal_data = {
            'client_name': proposal.client_name,
            'client_industry': proposal.client_industry,
            'requested_amount': proposal.requested_amount,
            'currency': proposal.currency,
            'loan_purpose': proposal.loan_purpose,
            'desired_term_months': proposal.desired_term_months,
            'max_acceptable_rate': proposal.max_acceptable_rate
        }

        client_research_data = {
            'annual_revenue': research.annual_revenue,
            'credit_rating': research.credit_rating,
            'debt_to_equity_ratio': research.debt_to_equity_ratio,
            'risk_assessment': research.risk_assessment,
            'strengths': research.strengths or []
        }

        generator = QuotationGenerator()

        # Process each quotation
        for quotation_id in quotation_ids:
            quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
            bank = db.query(Bank).filter(Bank.id == quotation.bank_id).first()

            bank_profile = {
                'bank_type': bank.bank_type,
                'headquarters_country': bank.headquarters_country,
                'credit_rating': bank.credit_rating,
                'risk_appetite': bank.risk_appetite,
                'avg_interest_rate': bank.avg_interest_rate,
                'preferred_sectors': bank.preferred_sectors or [],
                'min_loan_amount': bank.min_loan_amount,
                'max_loan_amount': bank.max_loan_amount,
                'contact_email': bank.contact_email
            }

            # Generate AI quotation
            ai_quotation = await generator.generate_quotation(
                bank.name,
                bank_profile,
                loan_proposal_data,
                client_research_data
            )

            # Update quotation in database
            if ai_quotation.get('will_participate'):
                quotation.offered_amount = ai_quotation.get('offered_amount')
                quotation.offered_interest_rate = ai_quotation.get('offered_interest_rate')
                quotation.offered_term_months = ai_quotation.get('offered_term_months')
                quotation.conditions = ai_quotation.get('conditions')
                quotation.covenants = ai_quotation.get('covenants')
                quotation.processing_time_days = ai_quotation.get('processing_time_days')
                quotation.early_repayment_penalty = ai_quotation.get('early_repayment_penalty')
                quotation.collateral_requirements = ai_quotation.get('collateral_requirements')
                quotation.bank_contact_name = ai_quotation.get('bank_contact_name')
                quotation.bank_contact_email = ai_quotation.get('bank_contact_email')
                quotation.response_notes = ai_quotation.get('rationale')
                quotation.status = QuotationStatus.RESPONDED
                quotation.responded_at = datetime.utcnow()
                quotation.fees = ai_quotation.get('fees')
            else:
                quotation.status = QuotationStatus.REJECTED
                quotation.response_notes = ai_quotation.get('decline_reason')

            db.commit()

        # Update proposal status
        proposal.status = ProposalStatus.COLLECTING_QUOTES
        db.commit()

        print(f"✅ Generated {len(quotation_ids)} AI quotations for proposal {proposal_id}")

    except Exception as e:
        print(f"❌ AI quotation generation failed: {str(e)}")
    finally:
        db.close()
