from typing import Dict, Any
from datetime import datetime
from app.core.config import settings
import google.generativeai as genai

class PitchGenerator:
    """AI-powered pitch document generator for loan proposals"""

    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.client = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.client = None

    async def generate_pitch(
        self,
        company_name: str,
        loan_amount: float,
        loan_purpose: str,
        research_data: Dict[str, Any],
        currency: str = "USD"
    ) -> Dict[str, str]:
        """
        Generate a professional loan pitch document

        Args:
            company_name: Name of the borrowing company
            loan_amount: Requested loan amount
            loan_purpose: Purpose of the loan
            research_data: Company research data
            currency: Currency code

        Returns:
            Dictionary with pitch sections
        """
        if not self.client:
            return self._generate_mock_pitch(company_name, loan_amount, loan_purpose)

        try:
            # Format currency
            formatted_amount = f"{currency} {loan_amount:,.2f}"

            # Create comprehensive prompt
            prompt = f"""You are a senior financial advisor creating a professional syndicated loan pitch document.

**Client:** {company_name}
**Loan Amount Requested:** {formatted_amount}
**Purpose:** {loan_purpose}

**Company Research:**
- Description: {research_data.get('company_description', 'N/A')}
- Revenue: {research_data.get('annual_revenue', 'N/A')}
- Employees: {research_data.get('employee_count', 'N/A')}
- Location: {research_data.get('headquarters_location', 'N/A')}
- Credit Rating: {research_data.get('credit_rating', 'N/A')}
- Strengths: {', '.join(research_data.get('strengths', []))}
- Market Position: {research_data.get('market_position', 'N/A')}

Create a comprehensive pitch document with these sections:

1. **Executive Summary** (3-4 paragraphs)
   - Brief overview of the opportunity
   - Why this is an attractive lending opportunity
   - Key highlights

2. **Company Overview** (2-3 paragraphs)
   - Business model and operations
   - Market position and competitive advantages
   - Historical performance

3. **Financial Highlights** (bullet points and analysis)
   - Revenue and profitability
   - Balance sheet strength
   - Key financial ratios
   - Growth trajectory

4. **Loan Structure** (detailed)
   - Proposed loan amount and purpose
   - Suggested term and repayment structure
   - Pricing recommendations
   - Security and collateral

5. **Risk Mitigation** (3-4 paragraphs)
   - How risks are minimized
   - Company strengths that reduce risk
   - Covenants and protections
   - Exit strategies

6. **Market Opportunity** (2 paragraphs)
   - Industry outlook
   - Growth drivers
   - Competitive positioning

7. **Use of Proceeds** (detailed breakdown)
   - Specific allocation of funds
   - Expected outcomes
   - Timeline for deployment

8. **Repayment Plan** (clear structure)
   - Cash flow analysis
   - Repayment schedule
   - Sources of repayment

Make it professional, compelling, and data-driven. Use markdown formatting.
Return ONLY the pitch content in markdown format, starting with "# Syndicated Loan Proposal".
"""

            response = self.client.generate_content(prompt)
            full_pitch = response.text

            # Parse sections from the generated pitch
            sections = self._parse_pitch_sections(full_pitch)

            return {
                "title": f"Syndicated Loan Proposal - {company_name}",
                "executive_summary": sections.get("executive_summary", ""),
                "company_overview": sections.get("company_overview", ""),
                "financial_highlights": sections.get("financial_highlights", ""),
                "loan_structure": sections.get("loan_structure", ""),
                "risk_mitigation": sections.get("risk_mitigation", ""),
                "market_opportunity": sections.get("market_opportunity", ""),
                "use_of_proceeds": sections.get("use_of_proceeds", ""),
                "repayment_plan": sections.get("repayment_plan", ""),
                "full_pitch_markdown": full_pitch,
                "generated_at": datetime.utcnow().isoformat()
            }

        except Exception as e:
            print(f"Pitch generation failed: {str(e)}")
            return self._generate_mock_pitch(company_name, loan_amount, loan_purpose)

    def _parse_pitch_sections(self, full_pitch: str) -> Dict[str, str]:
        """Parse pitch into sections based on headers"""
        sections = {}
        current_section = None
        current_content = []

        lines = full_pitch.split('\n')

        section_map = {
            "executive summary": "executive_summary",
            "company overview": "company_overview",
            "financial highlights": "financial_highlights",
            "loan structure": "loan_structure",
            "risk mitigation": "risk_mitigation",
            "market opportunity": "market_opportunity",
            "use of proceeds": "use_of_proceeds",
            "repayment plan": "repayment_plan"
        }

        for line in lines:
            # Check if line is a header
            if line.startswith('##'):
                # Save previous section
                if current_section:
                    sections[current_section] = '\n'.join(current_content).strip()

                # Start new section
                header_text = line.replace('#', '').strip().lower()
                current_section = section_map.get(header_text)
                current_content = []
            elif current_section:
                current_content.append(line)

        # Save last section
        if current_section:
            sections[current_section] = '\n'.join(current_content).strip()

        return sections

    def _generate_mock_pitch(self, company_name: str, loan_amount: float, loan_purpose: str) -> Dict[str, str]:
        """Generate mock pitch when API is unavailable"""
        return {
            "title": f"Syndicated Loan Proposal - {company_name}",
            "executive_summary": f"This is a mock pitch for {company_name}. Configure Gemini API for AI-generated content.",
            "company_overview": f"{company_name} requires a loan of ${loan_amount:,.2f} for {loan_purpose}.",
            "financial_highlights": "Financial data unavailable - Gemini API not configured.",
            "loan_structure": f"Proposed loan amount: ${loan_amount:,.2f}",
            "risk_mitigation": "Risk analysis requires Gemini API configuration.",
            "market_opportunity": "Market analysis unavailable.",
            "use_of_proceeds": loan_purpose,
            "repayment_plan": "Repayment structure to be determined.",
            "full_pitch_markdown": f"# Mock Pitch\n\nConfigure Gemini API to generate professional pitch documents.",
            "generated_at": datetime.utcnow().isoformat()
        }
