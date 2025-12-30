import json
import re
from typing import Dict, Any, Optional
from datetime import datetime
from app.core.config import settings
import google.generativeai as genai

class ResearchAgent:
    """AI-powered research agent with internet search capabilities"""

    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            # Use Gemini Pro for research (has Google Search grounding)
            self.client = genai.GenerativeModel(
                'gemini-1.5-flash',
                tools='google_search_retrieval'
            )
        else:
            self.client = None

    async def research_company(
        self,
        company_name: str,
        company_website: Optional[str] = None,
        industry: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Comprehensive company research using AI and web search

        Args:
            company_name: Name of the company to research
            company_website: Company's website URL
            industry: Industry sector

        Returns:
            Dictionary with research findings
        """
        if not self.client:
            return self._generate_mock_research(company_name)

        try:
            research_data = {}

            # 1. Company Overview Research
            overview_prompt = f"""Research the company "{company_name}" and provide:
1. Company description and business model
2. Year founded
3. Headquarters location
4. Number of employees (approximate)
5. Key products or services
6. Market position and competitive landscape
7. Recent news or developments (last 6 months)

Format the response as JSON with these exact keys:
{{
    "company_description": "...",
    "founded_year": 2000,
    "headquarters_location": "...",
    "employee_count": 1000,
    "key_products": ["...", "..."],
    "market_position": "...",
    "recent_news": ["...", "..."]
}}"""

            overview_response = self.client.generate_content(overview_prompt)
            research_data['overview'] = self._parse_json_from_text(overview_response.text)

            # 2. Financial Research
            financial_prompt = f"""Find the latest financial information for "{company_name}":
1. Annual revenue (latest year)
2. Net income
3. Total assets and liabilities
4. EBITDA if available
5. Stock symbol (if publicly traded)
6. Market capitalization (if public)
7. Credit rating (if available)
8. Debt-to-equity ratio

Format as JSON:
{{
    "annual_revenue": 1000000000,
    "net_income": 100000000,
    "total_assets": 5000000000,
    "total_liabilities": 3000000000,
    "stock_symbol": "XYZ",
    "market_cap": 10000000000,
    "credit_rating": "A",
    "debt_to_equity": 0.5
}}

If information is not available, use null."""

            financial_response = self.client.generate_content(financial_prompt)
            research_data['financial'] = self._parse_json_from_text(financial_response.text)

            # 3. Risk Assessment
            risk_prompt = f"""Analyze the credit risk for lending to "{company_name}". Consider:
1. Financial stability
2. Industry trends
3. Competitive position
4. Recent news sentiment
5. Economic factors

Provide:
- Overall risk assessment (Low/Medium/High)
- Key strengths (3-5 points)
- Key weaknesses (3-5 points)
- Opportunities (2-3 points)
- Threats (2-3 points)
- Sentiment score (-1 to 1, where -1 is very negative, 1 is very positive)

Format as JSON:
{{
    "risk_level": "Medium",
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "opportunities": ["...", "..."],
    "threats": ["...", "..."],
    "sentiment_score": 0.5
}}"""

            risk_response = self.client.generate_content(risk_prompt)
            research_data['risk_analysis'] = self._parse_json_from_text(risk_response.text)

            # Combine all research
            return {
                "company_description": research_data['overview'].get('company_description'),
                "founded_year": research_data['overview'].get('founded_year'),
                "employee_count": research_data['overview'].get('employee_count'),
                "headquarters_location": research_data['overview'].get('headquarters_location'),
                "annual_revenue": research_data['financial'].get('annual_revenue'),
                "net_income": research_data['financial'].get('net_income'),
                "total_assets": research_data['financial'].get('total_assets'),
                "total_liabilities": research_data['financial'].get('total_liabilities'),
                "ebitda": research_data['financial'].get('ebitda'),
                "stock_symbol": research_data['financial'].get('stock_symbol'),
                "market_cap": research_data['financial'].get('market_cap'),
                "credit_rating": research_data['financial'].get('credit_rating'),
                "debt_to_equity_ratio": research_data['financial'].get('debt_to_equity'),
                "industry_sector": industry,
                "market_position": research_data['overview'].get('market_position'),
                "recent_news": research_data['overview'].get('recent_news', []),
                "sentiment_score": research_data['risk_analysis'].get('sentiment_score'),
                "risk_assessment": research_data['risk_analysis'].get('risk_level'),
                "strengths": research_data['risk_analysis'].get('strengths', []),
                "weaknesses": research_data['risk_analysis'].get('weaknesses', []),
                "opportunities": research_data['risk_analysis'].get('opportunities', []),
                "threats": research_data['risk_analysis'].get('threats', []),
                "data_sources": ["Google Search", "Gemini AI Analysis"],
                "researched_at": datetime.utcnow().isoformat()
            }

        except Exception as e:
            print(f"Research failed: {str(e)}")
            return self._generate_mock_research(company_name)

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

            return {}
        except:
            return {}

    def _generate_mock_research(self, company_name: str) -> Dict[str, Any]:
        """Generate mock research data when API is unavailable"""
        return {
            "company_description": f"{company_name} is a company requiring research.",
            "founded_year": 2000,
            "employee_count": 500,
            "headquarters_location": "United States",
            "annual_revenue": 100000000.0,
            "market_position": "Unknown - API key not configured",
            "recent_news": ["Research agent requires Gemini API key"],
            "sentiment_score": 0.0,
            "risk_assessment": "Unable to assess - configure Gemini API",
            "strengths": ["Configure Gemini API for real research"],
            "weaknesses": [],
            "opportunities": [],
            "threats": [],
            "data_sources": ["Mock Data"],
            "researched_at": datetime.utcnow().isoformat()
        }
