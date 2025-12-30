from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.loan_proposal import LoanProposal, ProposalStatus
from app.models.client_research import ClientResearch
from app.models.pitch import Pitch
from app.schemas.loan_proposal import LoanProposalCreate, LoanProposalResponse, LoanProposalDetail
from app.services.research_agent import ResearchAgent
from app.services.pitch_generator import PitchGenerator

router = APIRouter()

@router.post("/", response_model=LoanProposalResponse)
def create_loan_proposal(
    proposal: LoanProposalCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Create a new loan proposal

    This initiates the syndication workflow
    """
    db_proposal = LoanProposal(
        **proposal.dict(),
        status=ProposalStatus.DRAFT
    )
    db.add(db_proposal)
    db.commit()
    db.refresh(db_proposal)

    # Trigger research in background
    background_tasks.add_task(
        _research_and_pitch,
        db_proposal.id,
        proposal.client_name,
        proposal.client_website,
        proposal.client_industry
    )

    return db_proposal

@router.get("/{proposal_id}", response_model=LoanProposalDetail)
def get_loan_proposal(proposal_id: int, db: Session = Depends(get_db)):
    """Get loan proposal details"""
    proposal = db.query(LoanProposal).filter(LoanProposal.id == proposal_id).first()

    if not proposal:
        raise HTTPException(status_code=404, detail="Loan proposal not found")

    # Add computed fields
    response_data = LoanProposalDetail.from_orm(proposal)
    response_data.mla_bids_count = len(proposal.mla_bids)
    response_data.quotations_count = len(proposal.quotations)
    response_data.has_syndicate = proposal.syndicate is not None

    return response_data

@router.get("/", response_model=List[LoanProposalResponse])
def list_loan_proposals(
    skip: int = 0,
    limit: int = 100,
    status: ProposalStatus = None,
    db: Session = Depends(get_db)
):
    """List all loan proposals"""
    query = db.query(LoanProposal)

    if status:
        query = query.filter(LoanProposal.status == status)

    proposals = query.offset(skip).limit(limit).all()
    return proposals

@router.post("/{proposal_id}/research", response_model=dict)
async def trigger_research(proposal_id: int, db: Session = Depends(get_db)):
    """
    Manually trigger AI research for a proposal
    """
    proposal = db.query(LoanProposal).filter(LoanProposal.id == proposal_id).first()

    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    # Run research
    agent = ResearchAgent()
    research_data = await agent.research_company(
        proposal.client_name,
        proposal.client_website,
        proposal.client_industry
    )

    # Save research
    db_research = ClientResearch(
        loan_proposal_id=proposal.id,
        **research_data
    )
    db.add(db_research)

    proposal.status = ProposalStatus.RESEARCH_IN_PROGRESS
    proposal.research_completed = True
    db.commit()

    return {"message": "Research completed", "research_id": db_research.id}

@router.post("/{proposal_id}/pitch", response_model=dict)
async def generate_pitch(proposal_id: int, db: Session = Depends(get_db)):
    """
    Generate AI pitch document for a proposal
    """
    proposal = db.query(LoanProposal).filter(LoanProposal.id == proposal_id).first()

    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    # Get research data
    research = db.query(ClientResearch).filter(
        ClientResearch.loan_proposal_id == proposal.id
    ).first()

    if not research:
        raise HTTPException(status_code=400, detail="Research not completed. Run research first.")

    # Generate pitch
    generator = PitchGenerator()
    pitch_data = await generator.generate_pitch(
        proposal.client_name,
        proposal.requested_amount,
        proposal.loan_purpose or "General corporate purposes",
        {
            "company_description": research.company_description,
            "annual_revenue": research.annual_revenue,
            "employee_count": research.employee_count,
            "headquarters_location": research.headquarters_location,
            "credit_rating": research.credit_rating,
            "strengths": research.strengths or [],
            "market_position": research.market_position
        },
        proposal.currency
    )

    # Save pitch
    db_pitch = Pitch(
        loan_proposal_id=proposal.id,
        **pitch_data
    )
    db.add(db_pitch)

    proposal.status = ProposalStatus.PITCH_GENERATED
    proposal.pitch_generated = True
    db.commit()

    return {"message": "Pitch generated", "pitch_id": db_pitch.id}

@router.get("/{proposal_id}/research")
def get_research(proposal_id: int, db: Session = Depends(get_db)):
    """Get research data for a proposal"""
    research = db.query(ClientResearch).filter(
        ClientResearch.loan_proposal_id == proposal_id
    ).first()

    if not research:
        raise HTTPException(status_code=404, detail="Research not found")

    return research

@router.get("/{proposal_id}/pitch")
def get_pitch(proposal_id: int, db: Session = Depends(get_db)):
    """Get pitch document for a proposal"""
    pitch = db.query(Pitch).filter(
        Pitch.loan_proposal_id == proposal_id
    ).first()

    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")

    return pitch

async def _research_and_pitch(
    proposal_id: int,
    client_name: str,
    client_website: str,
    client_industry: str
):
    """Background task to research and generate pitch"""
    from app.core.database import SessionLocal
    db = SessionLocal()

    try:
        # Research
        agent = ResearchAgent()
        research_data = await agent.research_company(client_name, client_website, client_industry)

        db_research = ClientResearch(loan_proposal_id=proposal_id, **research_data)
        db.add(db_research)
        db.commit()

        # Get proposal
        proposal = db.query(LoanProposal).filter(LoanProposal.id == proposal_id).first()
        proposal.research_completed = True
        proposal.status = ProposalStatus.PITCH_GENERATED
        db.commit()

        # Generate pitch
        generator = PitchGenerator()
        pitch_data = await generator.generate_pitch(
            client_name,
            proposal.requested_amount,
            proposal.loan_purpose or "General corporate purposes",
            research_data,
            proposal.currency
        )

        db_pitch = Pitch(loan_proposal_id=proposal_id, **pitch_data)
        db.add(db_pitch)

        proposal.pitch_generated = True
        db.commit()

    except Exception as e:
        print(f"Background research/pitch failed: {e}")
    finally:
        db.close()
