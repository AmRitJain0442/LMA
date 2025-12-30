import PyPDF2
from typing import Optional

class PDFExtractor:
    """Extract text content from PDF documents"""

    @staticmethod
    def extract_text(file_path: str) -> Optional[str]:
        """
        Extract text from a PDF file

        Args:
            file_path: Path to the PDF file

        Returns:
            Extracted text as string, or None if extraction fails
        """
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""

                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text() + "\n"

                return text.strip()

        except Exception as e:
            print(f"Error extracting text from PDF: {str(e)}")
            return None

    @staticmethod
    def get_metadata(file_path: str) -> dict:
        """Extract metadata from PDF"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                metadata = pdf_reader.metadata

                return {
                    "title": metadata.get("/Title", ""),
                    "author": metadata.get("/Author", ""),
                    "subject": metadata.get("/Subject", ""),
                    "creator": metadata.get("/Creator", ""),
                    "producer": metadata.get("/Producer", ""),
                    "pages": len(pdf_reader.pages)
                }
        except Exception as e:
            print(f"Error extracting metadata: {str(e)}")
            return {}
