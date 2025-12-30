import json
import re
from typing import Dict, Any, Optional
from app.core.config import settings

class AIExtractor:
    """AI-powered extraction of structured loan data from document text"""

    def __init__(self):
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize AI client (Google Gemini)"""
        if settings.GEMINI_API_KEY:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.client = genai.GenerativeModel('gemini-1.5-flash')
            self.provider = "gemini"
        else:
            self.provider = None

    def extract_loan_data(self, document_text: str) -> Dict[str, Any]:
        """
        Extract structured loan data from document text using AI

        Args:
            document_text: Raw text extracted from loan document

        Returns:
            Dictionary containing extracted loan information
        """
        if not self.client:
            return self._extract_with_regex(document_text)

        try:
            if self.provider == "gemini":
                return self._extract_with_gemini(document_text)
        except Exception as e:
            print(f"AI extraction failed: {str(e)}, falling back to regex")
            return self._extract_with_regex(document_text)

    def _extract_with_gemini(self, text: str) -> Dict[str, Any]:
        """Extract using Google Gemini"""
        prompt = self._create_extraction_prompt(text)

        response = self.client.generate_content(prompt)
        content = response.text
        return self._parse_ai_response(content)

    def _create_extraction_prompt(self, text: str) -> str:
        """Create prompt for AI extraction"""
        return f"""You are an expert in syndicated loan documentation. Extract key information from this loan document.

Document text:
{text[:4000]}

Extract the following information and return as JSON:
{{
    "borrower_name": "string",
    "facility_type": "string (e.g., Term Loan, Revolving Credit Facility)",
    "loan_amount": number,
    "currency": "string (USD, EUR, etc.)",
    "interest_rate": number (as percentage),
    "maturity_date": "string (YYYY-MM-DD if possible)",
    "origination_date": "string (YYYY-MM-DD if possible)",
    "agent_bank": "string",
    "lead_arrangers": ["array of strings"],
    "purpose": "string",
    "governing_law": "string",
    "covenants": [
        {{
            "covenant_type": "financial|affirmative|negative|reporting",
            "covenant_name": "string",
            "description": "string",
            "metric_name": "string (e.g., Debt-to-EBITDA)",
            "threshold_value": number,
            "comparison_operator": "string (<=, >=, ==)",
            "testing_frequency": "string (quarterly, annually, etc.)"
        }}
    ],
    "extraction_confidence": number (0.0 to 1.0)
}}

Return ONLY the JSON object, no additional text."""

    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse AI response into structured data"""
        try:
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return data
            else:
                print("No JSON found in AI response")
                return {}
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {str(e)}")
            return {}

    def _extract_with_regex(self, text: str) -> Dict[str, Any]:
        """Fallback: Basic regex-based extraction"""
        data = {
            "extraction_confidence": 0.3,
            "covenants": []
        }

        amount_match = re.search(r'\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:million|billion)?', text, re.IGNORECASE)
        if amount_match:
            amount_str = amount_match.group(1).replace(',', '')
            amount = float(amount_str)
            if 'million' in amount_match.group(0).lower():
                amount *= 1_000_000
            elif 'billion' in amount_match.group(0).lower():
                amount *= 1_000_000_000
            data["loan_amount"] = amount

        borrower_match = re.search(r'Borrower[:\s]+([A-Z][A-Za-z\s&.,]+?)(?:\n|,|Ltd|Inc|LLC|Corp)', text)
        if borrower_match:
            data["borrower_name"] = borrower_match.group(1).strip()

        return data
