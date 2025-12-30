from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.document import DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a loan document and trigger AI extraction

    - **file**: PDF document to upload
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    service = DocumentService(db)
    document = await service.upload_document(file)

    background_tasks.add_task(service.process_document, document.id)

    return document

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get document by ID"""
    service = DocumentService(db)
    document = service.get_document(document_id)

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return document

@router.get("/", response_model=List[DocumentResponse])
def list_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all documents"""
    service = DocumentService(db)
    return service.list_documents(skip=skip, limit=limit)

@router.post("/{document_id}/process", response_model=DocumentResponse)
def process_document(document_id: int, db: Session = Depends(get_db)):
    """
    Manually trigger document processing

    - **document_id**: ID of the document to process
    """
    service = DocumentService(db)
    document = service.process_document(document_id)

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return document
