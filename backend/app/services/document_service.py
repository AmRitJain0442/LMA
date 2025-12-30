import os
import shutil
from typing import Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.document import Document, DocumentStatus
from app.models.loan import Loan
from app.models.covenant import Covenant, CovenantType, CovenantStatus
from app.services.pdf_extractor import PDFExtractor
from app.services.ai_extractor import AIExtractor
from app.core.config import settings

class DocumentService:
    """Service for handling document upload and processing"""

    def __init__(self, db: Session):
        self.db = db
        self.pdf_extractor = PDFExtractor()
        self.ai_extractor = AIExtractor()

    async def upload_document(self, file: UploadFile) -> Document:
        """Upload and save document"""
        file_path = os.path.join(settings.UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = os.path.getsize(file_path)

        document = Document(
            filename=file.filename,
            file_path=file_path,
            file_type=file.content_type or "application/pdf",
            file_size=file_size,
            status=DocumentStatus.UPLOADED
        )

        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)

        return document

    def process_document(self, document_id: int) -> Optional[Document]:
        """Extract text and loan data from document"""
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            return None

        try:
            document.status = DocumentStatus.PROCESSING
            self.db.commit()

            extracted_text = self.pdf_extractor.extract_text(document.file_path)

            if not extracted_text:
                document.status = DocumentStatus.FAILED
                document.error_message = "Failed to extract text from PDF"
                self.db.commit()
                return document

            document.extracted_text = extracted_text

            loan_data = self.ai_extractor.extract_loan_data(extracted_text)

            loan = self._create_loan_from_data(document.id, loan_data)
            self.db.add(loan)

            if "covenants" in loan_data and loan_data["covenants"]:
                for cov_data in loan_data["covenants"]:
                    covenant = self._create_covenant_from_data(loan, cov_data)
                    self.db.add(covenant)

            document.status = DocumentStatus.COMPLETED
            self.db.commit()
            self.db.refresh(document)

            return document

        except Exception as e:
            document.status = DocumentStatus.FAILED
            document.error_message = str(e)
            self.db.commit()
            return document

    def _create_loan_from_data(self, document_id: int, data: dict) -> Loan:
        """Create Loan object from extracted data"""
        return Loan(
            document_id=document_id,
            borrower_name=data.get("borrower_name"),
            facility_type=data.get("facility_type"),
            loan_amount=data.get("loan_amount"),
            currency=data.get("currency", "USD"),
            interest_rate=data.get("interest_rate"),
            maturity_date=data.get("maturity_date"),
            origination_date=data.get("origination_date"),
            agent_bank=data.get("agent_bank"),
            lead_arrangers=data.get("lead_arrangers"),
            purpose=data.get("purpose"),
            governing_law=data.get("governing_law"),
            extraction_confidence=data.get("extraction_confidence", 0.0),
            raw_extracted_data=data
        )

    def _create_covenant_from_data(self, loan: Loan, data: dict) -> Covenant:
        """Create Covenant object from extracted data"""
        covenant_type_str = data.get("covenant_type", "financial")
        try:
            covenant_type = CovenantType(covenant_type_str)
        except ValueError:
            covenant_type = CovenantType.FINANCIAL

        return Covenant(
            loan_id=loan.id,
            covenant_type=covenant_type,
            covenant_name=data.get("covenant_name", "Unknown"),
            description=data.get("description"),
            metric_name=data.get("metric_name"),
            threshold_value=data.get("threshold_value"),
            comparison_operator=data.get("comparison_operator"),
            testing_frequency=data.get("testing_frequency"),
            status=CovenantStatus.UNKNOWN
        )

    def get_document(self, document_id: int) -> Optional[Document]:
        """Get document by ID"""
        return self.db.query(Document).filter(Document.id == document_id).first()

    def list_documents(self, skip: int = 0, limit: int = 100):
        """List all documents"""
        return self.db.query(Document).offset(skip).limit(limit).all()
