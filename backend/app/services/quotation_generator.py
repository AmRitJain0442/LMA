"""AI-powered quotation generator - simulates bank responses using Gemini"""
import json
import re
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.core.config import settings
import google.generativeai as genai

class QuotationGenerator:
    """Generate synthetic bank quotations using AI"""

    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.client = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.client = None

    async def generate_quotation(
        self,
        bank_name: str,
        bank_profile: Dict[str, Any],
        loan_proposal: Dict[str, Any],
        client_research: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate a quotation from a bank's perspective

        Args:
            bank_name: Name of the bank
            bank_profile: Bank's characteristics (risk appetite, avg rate, etc.)
            loan_proposal: Loan request details
            client_research: Research data about the borrower

        Returns:
            Dictionary with quotation details
        """
        if not self.client:
            return self._generate_mock_quotation(bank_name, bank_profile, loan_proposal)

        try:
            # Create comprehensive prompt from bank's perspective
            prompt = f"""You are a senior credit officer at {bank_name}, a {bank_profile.get('bank_type')} bank headquartered in {bank_profile.get('headquarters_country')}.

**Your Bank's Profile:**
- Credit Rating: {bank_profile.get('credit_rating')}
- Risk Appetite: {bank_profile.get('risk_appetite')}
- Average Interest Rate: {bank_profile.get('avg_interest_rate')}%
- Preferred Sectors: {', '.join(bank_profile.get('preferred_sectors', []))}
- Min Loan Amount: ${bank_profile.get('min_loan_amount'):,.0f}
- Max Loan Amount: ${bank_profile.get('max_loan_amount'):,.0f}

**Loan Request:**
- Borrower: {loan_proposal.get('client_name')}
- Industry: {loan_proposal.get('client_industry')}
- Requested Amount: ${loan_proposal.get('requested_amount'):,.0f}
- Currency: {loan_proposal.get('currency')}
- Purpose: {loan_proposal.get('loan_purpose')}
- Desired Term: {loan_proposal.get('desired_term_months')} months
- Max Acceptable Rate: {loan_proposal.get('max_acceptable_rate')}%

**Borrower Research:**
- Revenue: ${client_research.get('annual_revenue', 0):,.0f}
- Credit Rating: {client_research.get('credit_rating', 'N/A')}
- Debt-to-Equity: {client_research.get('debt_to_equity_ratio', 'N/A')}
- Risk Assessment: {client_research.get('risk_assessment', 'N/A')}
- Strengths: {', '.join(client_research.get('strengths', [])[:3])}

**Your Task:**
As a credit officer at {bank_name}, decide on your quotation for this loan request. Consider:
1. Does this loan fit your bank's risk appetite and sector preferences?
2. What amount are you willing to lend (within your limits)?
3. What interest rate should you offer (consider your avg rate, client risk, and market conditions)?
4. What specific conditions or covenants should you require?
5. How long will it take to process (10-45 days typical)?

**IMPORTANT GUIDELINES:**
- If the borrower's industry matches your preferred sectors, be more competitive
- If risk appetite is "Conservative" and borrower risk is "High", offer higher rates or decline
- If risk appetite is "Aggressive", you can take on higher risk at higher rates
- Your offered amount should not exceed {bank_profile.get('max_loan_amount')}
- Adjust your rate based on:
  * Your bank's average rate: {bank_profile.get('avg_interest_rate')}%
  * Borrower's credit quality (good = -0.5%, poor = +1.5%)
  * Loan size (larger = slight discount)
  * Industry risk (stable = -0.3%, volatile = +0.8%)

Return your response as JSON:
{{
    "will_participate": true/false,
    "offered_amount": <number>,
    "offered_interest_rate": <number>,
    "offered_term_months": <number>,
    "conditions": "<string describing 2-3 key conditions>",
    "covenants": ["<covenant 1>", "<covenant 2>", "<covenant 3>"],
    "processing_time_days": <number 10-45>,
    "early_repayment_penalty": <number 0-3>,
    "collateral_requirements": "<description>",
    "rationale": "<brief explanation of your decision>",
    "fees": {{
        "commitment_fee": <0.1-0.5>,
        "facility_fee": <0.1-0.3>,
        "agent_fee": <0.05-0.2>
    }}
}}

Be realistic and professional. Return ONLY the JSON, no other text.
"""

            response = self.client.generate_content(prompt)
            quotation_data = self._parse_json_from_text(response.text)

            # Validate and enhance
            if not quotation_data.get('will_participate', False):
                return {
                    "will_participate": False,
                    "offered_amount": 0,
                    "offered_interest_rate": 0,
                    "decline_reason": quotation_data.get('rationale', 'Does not meet bank criteria'),
                    "responded_at": datetime.utcnow().isoformat()
                }

            # Add metadata
            quotation_data['bank_contact_name'] = f"{bank_name} Credit Committee"
            quotation_data['bank_contact_email'] = bank_profile.get('contact_email')
            quotation_data['responded_at'] = datetime.utcnow().isoformat()
            quotation_data['expires_at'] = (datetime.utcnow() + timedelta(days=30)).isoformat()

            return quotation_data

        except Exception as e:
            print(f"Quotation generation failed for {bank_name}: {str(e)}")
            return self._generate_mock_quotation(bank_name, bank_profile, loan_proposal)

    async def generate_multiple_quotations(
        self,
        banks: List[Dict[str, Any]],
        loan_proposal: Dict[str, Any],
        client_research: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate quotations from multiple banks"""
        quotations = []

        for bank in banks:
            bank_profile = {
                'bank_type': bank.get('bank_type'),
                'headquarters_country': bank.get('headquarters_country'),
                'credit_rating': bank.get('credit_rating'),
                'risk_appetite': bank.get('risk_appetite'),
                'avg_interest_rate': bank.get('avg_interest_rate'),
                'preferred_sectors': bank.get('preferred_sectors', []),
                'min_loan_amount': bank.get('min_loan_amount'),
                'max_loan_amount': bank.get('max_loan_amount'),
                'contact_email': bank.get('contact_email')
            }

            quotation = await self.generate_quotation(
                bank.get('name'),
                bank_profile,
                loan_proposal,
                client_research
            )

            quotations.append({
                'bank_id': bank.get('id'),
                'bank_name': bank.get('name'),
                **quotation
            })

        return quotations

    def _parse_json_from_text(self, text: str) -> Dict:
        """Extract JSON from AI response"""
        try:
            # Try to find JSON block in markdown
            json_match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(1))

            # Try to find raw JSON
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))

            return {"will_participate": False}
        except:
            return {"will_participate": False}

    def _generate_mock_quotation(
        self,
        bank_name: str,
        bank_profile: Dict[str, Any],
        loan_proposal: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate mock quotation when API unavailable"""
        import random

        base_rate = bank_profile.get('avg_interest_rate', 5.0)
        requested_amount = loan_proposal.get('requested_amount', 0)
        max_amount = bank_profile.get('max_loan_amount', 0)

        # Offer 50-100% of requested amount, capped at bank's max
        offered_amount = min(
            requested_amount * random.uniform(0.5, 1.0),
            max_amount
        )

        # Rate varies +/- 1% from bank's average
        offered_rate = base_rate + random.uniform(-0.5, 1.2)

        return {
            "will_participate": True,
            "offered_amount": round(offered_amount, 2),
            "offered_interest_rate": round(offered_rate, 2),
            "offered_term_months": loan_proposal.get('desired_term_months', 60),
            "conditions": "Standard terms apply - Gemini API not configured for detailed quotation",
            "covenants": ["Maintain minimum DSCR of 1.25x", "No additional debt without consent"],
            "processing_time_days": random.randint(15, 30),
            "early_repayment_penalty": 2.0,
            "collateral_requirements": "First lien on assets",
            "rationale": "Mock quotation - configure Gemini API for AI-generated responses",
            "bank_contact_name": f"{bank_name} Credit Committee",
            "bank_contact_email": bank_profile.get('contact_email'),
            "responded_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
        }
