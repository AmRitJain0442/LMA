import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader, RefreshCw, Building2, Send, FileText, Search } from 'lucide-react'
import { proposalAPI, quotationAPI } from '../services/api'
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge } from '../components/neumorphic'

export default function ProposalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState(null)
  const [research, setResearch] = useState(null)
  const [pitch, setPitch] = useState(null)
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadProposal()
    loadQuotations()
    const interval = setInterval(() => {
      loadProposal()
      loadQuotations()
    }, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [id])

  const loadProposal = async () => {
    try {
      const data = await proposalAPI.getProposal(id)
      setProposal(data)

      if (data.research_completed) {
        const researchData = await proposalAPI.getResearch(id)
        setResearch(researchData)
      }

      if (data.pitch_generated) {
        const pitchData = await proposalAPI.getPitch(id)
        setPitch(pitchData)
      }
    } catch (err) {
      console.error('Error loading proposal:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadQuotations = async () => {
    try {
      const data = await quotationAPI.getQuotationsForProposal(id)
      setQuotations(data)
    } catch (err) {
      console.error('Error loading quotations:', err)
    }
  }

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <NeumorphicCard className="p-8" inset>
          <Loader className="h-8 w-8 animate-spin neu-text-accent mx-auto" />
        </NeumorphicCard>
      </div>
    )
  }

  if (!proposal) {
    return (
      <NeumorphicCard className="p-8 text-center">
        <p className="neu-text-muted font-body">Proposal not found</p>
      </NeumorphicCard>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/proposals')}
          className="flex items-center text-sm neu-text-muted hover:neu-text-accent font-body font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Proposals
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mb-2">
              {proposal.client_name}
            </h1>
            <div className="flex items-center text-base neu-text-muted font-body space-x-3">
              <span>{proposal.client_industry}</span>
              <span>•</span>
              <span>{proposal.client_country}</span>
              <span>•</span>
              <span className="font-semibold neu-text-primary">
                {formatCurrency(proposal.requested_amount, proposal.currency)}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            {proposal.pitch_generated && quotations.length === 0 && (
              <Link to={`/proposals/${id}/banks`}>
                <NeumorphicButton variant="primary" size="md">
                  <Send className="h-4 w-4 mr-2" />
                  Send to Banks
                </NeumorphicButton>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'research', label: 'AI Research', disabled: !research },
          { key: 'pitch', label: 'Pitch Document', disabled: !pitch },
          { key: 'quotations', label: `Quotations (${quotations.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => !tab.disabled && setActiveTab(tab.key)}
            disabled={tab.disabled}
            className={`
              px-6 py-3 rounded-neu-sm text-sm font-display font-semibold
              transition-all duration-300
              ${activeTab === tab.key
                ? 'shadow-neu-inset neu-text-accent'
                : tab.disabled
                ? 'shadow-neu neu-text-muted opacity-40 cursor-not-allowed'
                : 'shadow-neu neu-text-primary hover:shadow-neu-lg hover:-translate-y-0.5'
              }
            `.trim()}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <NeumorphicCard className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-display font-bold neu-text-primary mb-6">
                Proposal Details
              </h3>
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-display font-medium neu-text-muted mb-1">Status</dt>
                  <dd className="mt-1">
                    <NeumorphicBadge variant="accent" size="md">
                      {proposal.status.replace(/_/g, ' ')}
                    </NeumorphicBadge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-display font-medium neu-text-muted mb-1">Created</dt>
                  <dd className="text-base font-body neu-text-primary">
                    {new Date(proposal.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-display font-medium neu-text-muted mb-1">Requested Amount</dt>
                  <dd className="text-base font-body neu-text-primary font-semibold">
                    {formatCurrency(proposal.requested_amount, proposal.currency)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-display font-medium neu-text-muted mb-1">Term</dt>
                  <dd className="text-base font-body neu-text-primary">{proposal.desired_term_months} months</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-display font-medium neu-text-muted mb-1">Purpose</dt>
                  <dd className="text-base font-body neu-text-primary">{proposal.loan_purpose}</dd>
                </div>
              </dl>
            </div>

            {/* Progress Indicators */}
            <div className="pt-6">
              <h3 className="text-2xl font-display font-bold neu-text-primary mb-6">Progress</h3>
              <div className="space-y-4">
                <NeumorphicCard className="p-4" size="sm" inset={!proposal.research_completed}>
                  <div className="flex items-center">
                    {proposal.research_completed ? (
                      <span className="text-neu-success flex items-center font-body font-semibold">
                        ✓ Research Completed
                      </span>
                    ) : (
                      <span className="text-neu-warning flex items-center font-body font-semibold">
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                        Research in progress...
                      </span>
                    )}
                  </div>
                </NeumorphicCard>
                <NeumorphicCard className="p-4" size="sm" inset={!proposal.pitch_generated}>
                  <div className="flex items-center">
                    {proposal.pitch_generated ? (
                      <span className="text-neu-success flex items-center font-body font-semibold">
                        ✓ Pitch Generated
                      </span>
                    ) : (
                      <span className="neu-text-muted flex items-center font-body">
                        ○ Pitch pending
                      </span>
                    )}
                  </div>
                </NeumorphicCard>
                <NeumorphicCard className="p-4" size="sm" inset={quotations.length === 0}>
                  <div className="flex items-center">
                    {quotations.length > 0 ? (
                      <span className="text-neu-success flex items-center font-body font-semibold">
                        ✓ {quotations.length} Quotations Received
                      </span>
                    ) : (
                      <span className="neu-text-muted flex items-center font-body">
                        ○ No quotations yet
                      </span>
                    )}
                  </div>
                </NeumorphicCard>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'research' && research && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-display font-bold neu-text-primary mb-4">Company Overview</h3>
              <p className="text-base font-body neu-text-primary leading-relaxed">
                {research.company_description || 'N/A'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <NeumorphicCard className="p-6 relative overflow-hidden" size="sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gradient opacity-5 rounded-full blur-xl"></div>
                <h4 className="text-lg font-display font-semibold bg-accent-gradient bg-clip-text text-transparent mb-4 relative z-10">
                  Financial Metrics
                </h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-display font-medium neu-text-muted mb-1">Annual Revenue</dt>
                    <dd className="text-base font-body neu-text-primary font-semibold">
                      {research.annual_revenue ? formatCurrency(research.annual_revenue) : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-display font-medium neu-text-muted mb-1">Total Assets</dt>
                    <dd className="text-base font-body neu-text-primary font-semibold">
                      {research.total_assets ? formatCurrency(research.total_assets) : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-display font-medium neu-text-muted mb-1">Credit Rating</dt>
                    <dd className="text-base font-body neu-text-primary font-semibold">
                      {research.credit_rating || 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-display font-medium neu-text-muted mb-1">Debt-to-Equity Ratio</dt>
                    <dd className="text-base font-body neu-text-primary font-semibold">
                      {research.debt_to_equity_ratio || 'N/A'}
                    </dd>
                  </div>
                </dl>
              </NeumorphicCard>

              <NeumorphicCard className="p-6 relative overflow-hidden" size="sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-warning-gradient opacity-5 rounded-full blur-xl"></div>
                <h4 className="text-lg font-display font-semibold bg-warning-gradient bg-clip-text text-transparent mb-4 relative z-10">
                  Risk Assessment
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-display font-medium neu-text-muted block mb-1">
                      Overall Risk:
                    </span>
                    <NeumorphicBadge
                      variant={
                        research.risk_assessment === 'Low' ? 'success' :
                        research.risk_assessment === 'Medium' ? 'warning' : 'danger'
                      }
                      size="md"
                    >
                      {research.risk_assessment || 'N/A'}
                    </NeumorphicBadge>
                  </div>
                  <div>
                    <span className="text-xs font-display font-medium neu-text-muted block mb-1">
                      Sentiment Score:
                    </span>
                    <span className="text-base font-body neu-text-primary font-semibold">
                      {research.sentiment_score ? (research.sentiment_score * 100).toFixed(0) + '%' : 'N/A'}
                    </span>
                  </div>
                </div>
              </NeumorphicCard>
            </div>

            {/* SWOT Analysis */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <NeumorphicCard className="p-6" size="sm">
                <h4 className="text-lg font-display font-semibold text-neu-success mb-4">Strengths</h4>
                <ul className="text-sm font-body neu-text-primary space-y-2 list-disc list-inside">
                  {research.strengths && research.strengths.length > 0 ? (
                    research.strengths.map((s, i) => <li key={i}>{s}</li>)
                  ) : (
                    <li className="neu-text-muted">No data</li>
                  )}
                </ul>
              </NeumorphicCard>
              <NeumorphicCard className="p-6" size="sm">
                <h4 className="text-lg font-display font-semibold text-neu-error mb-4">Weaknesses</h4>
                <ul className="text-sm font-body neu-text-primary space-y-2 list-disc list-inside">
                  {research.weaknesses && research.weaknesses.length > 0 ? (
                    research.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                  ) : (
                    <li className="neu-text-muted">No data</li>
                  )}
                </ul>
              </NeumorphicCard>
            </div>
          </div>
        )}

        {activeTab === 'pitch' && pitch && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display font-bold neu-text-primary mb-2">{pitch.title}</h3>
            </div>
            <NeumorphicCard className="p-6" size="sm" inset>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-base font-body neu-text-primary leading-relaxed">
                  {pitch.full_pitch_markdown || 'No pitch content available'}
                </div>
              </div>
            </NeumorphicCard>
          </div>
        )}

        {activeTab === 'quotations' && (
          <div>
            {quotations.length === 0 ? (
              <div className="text-center py-16">
                <NeumorphicCard className="w-24 h-24 mx-auto mb-6 flex items-center justify-center" inset>
                  <Building2 className="h-12 w-12 neu-text-muted" />
                </NeumorphicCard>
                <h3 className="text-xl font-display font-semibold neu-text-primary mb-2">
                  No quotations yet
                </h3>
                <p className="text-base neu-text-muted font-body mb-8">
                  Send your proposal to banks to receive quotations
                </p>
                {proposal.pitch_generated && (
                  <Link to={`/proposals/${id}/banks`}>
                    <NeumorphicButton variant="primary" size="lg">
                      <Send className="h-5 w-5 mr-2" />
                      Send to Banks
                    </NeumorphicButton>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {quotations.map(quote => (
                  <NeumorphicCard key={quote.id} className="p-6" hover>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-display font-semibold neu-text-primary">
                          {quote.bank_name}
                        </h4>
                        <p className="text-sm neu-text-muted font-body mt-1">
                          {quote.bank_country} • {quote.bank_rating}
                        </p>
                      </div>
                      <NeumorphicBadge
                        variant={
                          quote.status === 'responded' ? 'success' :
                          quote.status === 'sent' ? 'warning' : 'neutral'
                        }
                        size="md"
                      >
                        {quote.status}
                      </NeumorphicBadge>
                    </div>

                    {quote.offered_amount ? (
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs font-display font-medium neu-text-muted mb-1">
                            Offered Amount
                          </p>
                          <p className="text-base font-body neu-text-primary font-semibold">
                            {formatCurrency(quote.offered_amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-display font-medium neu-text-muted mb-1">
                            Interest Rate
                          </p>
                          <p className="text-base font-body neu-text-accent font-semibold">
                            {quote.offered_interest_rate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-display font-medium neu-text-muted mb-1">
                            Term
                          </p>
                          <p className="text-base font-body neu-text-primary font-semibold">
                            {quote.offered_term_months} months
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Loader className="animate-spin h-4 w-4 mr-2 text-neu-warning" />
                        <p className="text-sm text-neu-warning font-body font-medium">
                          Awaiting response...
                        </p>
                      </div>
                    )}
                  </NeumorphicCard>
                ))}

                {quotations.filter(q => q.status === 'responded').length > 0 && (
                  <div className="mt-8 text-center">
                    <Link to={`/proposals/${id}/quotations`}>
                      <NeumorphicButton variant="success" size="lg">
                        Compare & Optimize Quotations
                      </NeumorphicButton>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </NeumorphicCard>
    </div>
  )
}
