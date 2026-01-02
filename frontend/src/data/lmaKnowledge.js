// LMA Investment Grade Agreements Knowledge Base
// Based on "A Borrower's Guide to the LMA's Investment Grade Agreements" (6th Edition, Nov 2022)

export const lmaKnowledge = {
  overview: {
    title: "LMA Investment Grade Agreements",
    edition: "6th Edition, November 2022",
    authors: "Association of Corporate Treasurers (ACT) and Slaughter and May",
    purpose: "Guide for corporate treasurers navigating Loan Market Association (LMA) standard forms"
  },

  rfrTransition: {
    title: "Navigating the Transition to Risk-Free Rates (RFRs)",
    description: "Technical and documentary changes required by the shift from LIBOR to Risk-Free Rates",

    fundamentalShift: {
      title: "The Fundamental Shift",
      points: [
        {
          heading: "Nature of Rates",
          description: "Unlike LIBOR, which was a forward-looking term rate including a credit risk premium, RFRs are backward-looking, overnight rates that are virtually risk-free.",
          impact: "high"
        },
        {
          heading: "Calculation Method",
          description: "Interest is typically calculated using a 'compounded in arrears' methodology. The rate is applied to the outstanding principal daily, but the total interest due is only known at the end of the period.",
          impact: "high"
        }
      ]
    },

    keyConventions: {
      title: "Key Conventions for Borrowers",
      conventions: [
        {
          name: "Lookback Period",
          description: "Because RFRs are backward-looking, the interest amount is not known until the payment date. To allow time for payment processing, a 'lookback' (typically 5 banking days) is used. The observation period for interest calculation ends 5 days before the interest period ends.",
          typical: "5 banking days",
          importance: "critical"
        },
        {
          name: "Non-Cumulative Compounding (NCCR)",
          description: "For loans, the 'Non-Cumulative Compounded Rate' is preferred over the cumulative method used in derivatives. This generates a daily interest amount, which helps with intra-period prepayments and trading.",
          typical: "Daily interest calculation",
          importance: "high"
        },
        {
          name: "Observation Shift",
          description: "Borrowers need to decide whether to use an 'Observation Shift' (weighting days according to the observation period) or 'Observation Lag' (weighting according to the interest period). The LMA standard for Sterling is currently without observation shift, though a shift may be used to align with hedging (ISDA).",
          typical: "Without observation shift (Sterling)",
          importance: "medium"
        }
      ]
    },

    creditAdjustmentSpread: {
      title: "Credit Adjustment Spread (CAS)",
      description: "Because RFRs lack the credit risk premium of LIBOR, a Credit Adjustment Spread (CAS) is often added to the interest rate to prevent a transfer of value during transition.",
      details: [
        {
          aspect: "Pricing Structure",
          options: [
            "Three-part pricing: RFR + CAS + Margin",
            "Two-part pricing: RFR + increased Margin"
          ]
        },
        {
          aspect: "Calculation",
          method: "For legacy transitions, the CAS was often the 5-year historic median difference between LIBOR and the RFR (the '5YHLB')."
        }
      ]
    }
  },

  negotiationPoints: {
    title: "Commercial Negotiation Points (Clause by Clause)",
    description: "Detailed commentary on the LMA Investment Grade Agreement highlighting areas where borrowers should push back",

    interestAndCosts: {
      title: "Interest and Costs",
      points: [
        {
          clause: "Break Costs",
          standard: "Borrowers historically paid 'Break Costs' for prepaying mid-period",
          borrowerPosition: "For compounded RFR loans, Break Costs should typically NOT apply because there is no matched term funding risk for lenders",
          priority: "high",
          savings: "Significant cost savings on prepayments"
        },
        {
          clause: "Market Disruption",
          standard: "Lenders include a clause allowing them to charge their actual 'cost of funds' if market disruption occurs",
          borrowerPosition: "Argue this is redundant for RFR loans (which track overnight rates) or request a high trigger threshold (e.g., 35-50% of lenders)",
          priority: "medium",
          savings: "Prevents excessive funding costs"
        },
        {
          clause: "Zero Floors",
          standard: "Lenders often floor the interest rate at zero",
          borrowerPosition: "Ensure the floor applies to the aggregate of the RFR plus the CAS, not just the RFR, to maintain economic parity",
          priority: "high",
          savings: "Maintains LIBOR-era economics"
        }
      ]
    },

    taxAndIncreasedCosts: {
      title: "Tax and Increased Costs",
      points: [
        {
          clause: "Qualifying Lenders",
          standard: "Borrowers must gross-up payments for withholding tax",
          borrowerPosition: "Ensure gross-up only applies if the lender is a 'Qualifying Lender.' The definition of 'Treaty Lender' often has a blank condition that must be carefully drafted",
          priority: "high",
          savings: "Limits tax exposure"
        },
        {
          clause: "Basel III Costs",
          standard: "The 'Increased Costs' clause allows lenders to pass on regulatory costs",
          borrowerPosition: "Negotiate to EXCLUDE costs related to Basel III (capital requirements), arguing these are known costs that should be priced into the margin",
          priority: "medium",
          savings: "Prevents double-charging"
        }
      ]
    },

    representationsAndUndertakings: {
      title: "Representations and Undertakings",
      points: [
        {
          clause: "Materiality Qualifiers",
          standard: "Absolute representations required",
          borrowerPosition: "Qualify representations with 'Material Adverse Effect' (MAE) or knowledge qualifiers (e.g., 'to the best of the Company's knowledge') where absolute statements are too risky",
          priority: "high",
          savings: "Reduces default risk"
        },
        {
          clause: "Negative Pledge & Disposals",
          standard: "Restrictions on granting security or selling assets",
          borrowerPosition: "Need robust exceptions (or 'baskets') for ordinary course business, such as netting arrangements, liens, and disposals of obsolete assets",
          priority: "high",
          savings: "Maintains operational flexibility"
        },
        {
          clause: "Sanctions",
          standard: "Lenders frequently demand sanctions clauses (not standard LMA)",
          borrowerPosition: "Limit these to specific regimes (UK, US, EU) and ensure they do not accidentally trigger defaults due to minor or unconnected issues",
          priority: "medium",
          savings: "Reduces compliance risk"
        }
      ]
    },

    financialCovenants: {
      title: "Financial Covenants",
      points: [
        {
          clause: "Leverage & Interest Cover",
          standard: "Financial ratio tests required",
          borrowerPosition: "'Borrowings' should exclude items like fair value of derivatives. 'EBITDA' should allow for add-backs of one-off costs or 'aspirational' synergies from acquisitions",
          priority: "critical",
          savings: "Prevents technical defaults"
        },
        {
          clause: "Frozen GAAP",
          standard: "Covenants calculated under current accounting standards",
          borrowerPosition: "Request 'Frozen GAAP' clauses so that changes in accounting standards (like IFRS 16 on leases) do not inadvertently trigger a covenant breach",
          priority: "high",
          savings: "Protects against accounting changes"
        }
      ]
    }
  },

  hotTopics: {
    title: "Hot Topics and Emerging Trends",

    sustainabilityLinkedLoans: {
      title: "Sustainability-Linked Loans (SLLs)",
      description: "SLLs tie the loan margin to the borrower's performance against ESG targets",
      keyPoints: [
        {
          topic: "KPIs & SPTs",
          description: "Borrowers select Key Performance Indicators (e.g., carbon emissions) and set Sustainability Performance Targets",
          examples: [
            "Carbon emissions reduction",
            "Renewable energy usage",
            "Diversity and inclusion metrics",
            "Water consumption targets"
          ]
        },
        {
          topic: "Declassification Risk",
          description: "A major risk is 'declassification,' where a loan loses its SLL status due to reporting failures",
          borrowerPosition: "Should resist 'automatic' declassification and negotiate grace periods",
          priority: "high"
        },
        {
          topic: "Two-Way Pricing",
          description: "Margins can now decrease OR increase depending on performance (a 'two-way ratchet')",
          impact: "Can result in both cost savings and penalties",
          trend: "Increasingly common"
        }
      ]
    },

    ukLegalDevelopments: {
      title: "UK Legal Developments",
      items: [
        {
          legislation: "Pensions Schemes Act 2021",
          description: "Introduces criminal offences for compromising defined benefit (DB) pension schemes",
          impact: "Lenders are more cautious about transactions that might devalue the employer covenant to a pension scheme",
          borrowerAction: "Be prepared for enhanced due diligence on pension obligations"
        },
        {
          legislation: "National Security and Investment Act 2021 (NSIA)",
          description: "Gives the UK government power to review acquisitions in sensitive sectors",
          impact: "Can impact deal timelines and conditions precedent in acquisition financing",
          borrowerAction: "Factor in additional approval time for sensitive sectors"
        }
      ]
    },

    lehmanProvisions: {
      title: "The 'Lehman Provisions'",
      description: "Optional clauses that protect the borrower if a lender defaults (e.g., goes bust)",
      benefits: [
        "Allow the borrower to cancel the undrawn commitments of a 'Defaulting Lender'",
        "Disenfranchise defaulting lenders from voting",
        "Prevent a 'zombie' lender from blocking waivers or amendments"
      ],
      recommendation: "Borrowers should generally ensure these are included",
      priority: "high"
    }
  },

  rfrComparison: {
    title: "RFR vs LIBOR Comparison",
    currencies: [
      {
        currency: "GBP",
        libor: "GBP LIBOR",
        rfr: "SONIA (Sterling Overnight Index Average)",
        administrator: "Bank of England",
        transitionDate: "December 31, 2021"
      },
      {
        currency: "USD",
        libor: "USD LIBOR",
        rfr: "SOFR (Secured Overnight Financing Rate)",
        administrator: "Federal Reserve Bank of New York",
        transitionDate: "June 30, 2023"
      },
      {
        currency: "EUR",
        libor: "EURIBOR (still available)",
        rfr: "€STR (Euro Short-Term Rate)",
        administrator: "European Central Bank",
        transitionDate: "Parallel rates available"
      },
      {
        currency: "CHF",
        libor: "CHF LIBOR",
        rfr: "SARON (Swiss Average Rate Overnight)",
        administrator: "SIX Swiss Exchange",
        transitionDate: "December 31, 2021"
      },
      {
        currency: "JPY",
        libor: "JPY LIBOR",
        rfr: "TONAR (Tokyo Overnight Average Rate)",
        administrator: "Bank of Japan",
        transitionDate: "December 31, 2021"
      }
    ]
  },

  glossary: {
    title: "Key Terms Glossary",
    terms: [
      { term: "RFR", definition: "Risk-Free Rate - A benchmark interest rate that reflects the cost of borrowing overnight in the wholesale market, nearly risk-free" },
      { term: "LIBOR", definition: "London Interbank Offered Rate - The former benchmark rate at which banks lend to each other, phased out due to manipulation concerns" },
      { term: "CAS", definition: "Credit Adjustment Spread - An additional spread added to RFRs to compensate for the credit risk premium that was embedded in LIBOR" },
      { term: "NCCR", definition: "Non-Cumulative Compounded Rate - A method of calculating compounded interest that generates daily interest amounts" },
      { term: "MAE", definition: "Material Adverse Effect - A qualifier used to limit the scope of representations to material matters only" },
      { term: "SLL", definition: "Sustainability-Linked Loan - A loan where the margin is tied to the borrower's ESG performance" },
      { term: "KPI", definition: "Key Performance Indicator - A measurable value used to track performance against targets" },
      { term: "SPT", definition: "Sustainability Performance Target - Specific ESG goals set by the borrower in an SLL" },
      { term: "Basel III", definition: "International regulatory framework for banks regarding capital adequacy, stress testing, and liquidity" },
      { term: "Frozen GAAP", definition: "A covenant provision that fixes accounting standards at a point in time to prevent changes from triggering defaults" }
    ]
  },

  bestPractices: {
    title: "Best Practices for Borrowers",
    categories: [
      {
        category: "Preparation",
        practices: [
          "Engage experienced legal counsel early in the process",
          "Understand your company's specific business needs and operational constraints",
          "Prepare detailed financial models showing covenant compliance headroom",
          "Identify all existing hedging arrangements that may need alignment"
        ]
      },
      {
        category: "Negotiation",
        practices: [
          "Focus on high-priority items: break costs, increased costs exclusions, covenant definitions",
          "Request specific examples of when discretionary lender rights have been exercised",
          "Negotiate exceptions and baskets that match your business model",
          "Ensure consistency between loan documentation and hedging agreements"
        ]
      },
      {
        category: "Documentation",
        practices: [
          "Review all defined terms carefully - definitions drive economic outcomes",
          "Ensure CAS application is economically neutral to LIBOR",
          "Verify all calculation examples in schedules",
          "Maintain a comparison matrix of standard LMA vs. negotiated terms"
        ]
      },
      {
        category: "Post-Closing",
        practices: [
          "Establish robust compliance monitoring systems",
          "Maintain detailed audit trails for covenant calculations",
          "Set up early warning systems for potential covenant breaches",
          "Regularly review market developments and refinancing opportunities"
        ]
      }
    ]
  }
};

export default lmaKnowledge;
