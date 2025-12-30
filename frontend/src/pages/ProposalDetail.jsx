import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader, RefreshCw, Building2, Send, FileText, Search } from 'lucide-react'
import { proposalAPI, quotationAPI } from '../services/api'

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
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!proposal) {
    return <div>Proposal not found</div>
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/proposals')}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Proposals
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{proposal.client_name}</h1>
            <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
              <span>{proposal.client_industry}</span>
              <span>•</span>
              <span>{proposal.client_country}</span>
              <span>•</span>
              <span>{formatCurrency(proposal.requested_amount, proposal.currency)}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            {proposal.pitch_generated && quotations.length === 0 && (
              <Link
                to={`/proposals/${id}/banks`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Banks
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
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
                ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Proposal Details</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{proposal.status.replace(/_/g, ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(proposal.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Requested Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatCurrency(proposal.requested_amount, proposal.currency)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Term</dt>
                  <dd className="mt-1 text-sm text-gray-900">{proposal.desired_term_months} months</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                  <dd className="mt-1 text-sm text-gray-900">{proposal.loan_purpose}</dd>
                </div>
              </dl>
            </div>

            {/* Progress Indicators */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  {proposal.research_completed ? (
                    <span className="text-green-600 flex items-center">✓ Research Completed</span>
                  ) : (
                    <span className="text-yellow-600 flex items-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Research in progress...
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {proposal.pitch_generated ? (
                    <span className="text-green-600 flex items-center">✓ Pitch Generated</span>
                  ) : (
                    <span className="text-gray-400">○ Pitch pending</span>
                  )}
                </div>
                <div className="flex items-center">
                  {quotations.length > 0 ? (
                    <span className="text-green-600 flex items-center">
                      ✓ {quotations.length} Quotations Received
                    </span>
                  ) : (
                    <span className="text-gray-400">○ No quotations yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'research' && research && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Company Overview</h3>
              <p className="text-sm text-gray-700">{research.company_description || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Financial Metrics</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs text-gray-500">Annual Revenue</dt>
                    <dd className="text-sm font-medium">
                      {research.annual_revenue ? formatCurrency(research.annual_revenue) : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Total Assets</dt>
                    <dd className="text-sm font-medium">
                      {research.total_assets ? formatCurrency(research.total_assets) : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Credit Rating</dt>
                    <dd className="text-sm font-medium">{research.credit_rating || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Debt-to-Equity Ratio</dt>
                    <dd className="text-sm font-medium">{research.debt_to_equity_ratio || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Risk Assessment</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Overall Risk:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                      research.risk_assessment === 'Low' ? 'bg-green-100 text-green-800' :
                      research.risk_assessment === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {research.risk_assessment || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Sentiment Score:</span>
                    <span className="ml-2 text-sm font-medium">
                      {research.sentiment_score ? (research.sentiment_score * 100).toFixed(0) + '%' : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SWOT Analysis */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-green-900 mb-2">Strengths</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  {research.strengths && research.strengths.length > 0 ? (
                    research.strengths.map((s, i) => <li key={i}>{s}</li>)
                  ) : (
                    <li className="text-gray-400">No data</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-900 mb-2">Weaknesses</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  {research.weaknesses && research.weaknesses.length > 0 ? (
                    research.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                  ) : (
                    <li className="text-gray-400">No data</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pitch' && pitch && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{pitch.title}</h3>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {pitch.full_pitch_markdown || 'No pitch content available'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quotations' && (
          <div>
            {quotations.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No quotations yet</h3>
                <p className="mt-1 text-sm text-gray-500">Send your proposal to banks to receive quotations</p>
                {proposal.pitch_generated && (
                  <div className="mt-6">
                    <Link
                      to={`/proposals/${id}/banks`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send to Banks
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {quotations.map(quote => (
                  <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{quote.bank_name}</h4>
                        <p className="text-xs text-gray-500">{quote.bank_country} • {quote.bank_rating}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        quote.status === 'responded' ? 'bg-green-100 text-green-800' :
                        quote.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quote.status}
                      </span>
                    </div>

                    {quote.offered_amount ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Offered Amount</p>
                          <p className="text-sm font-medium">{formatCurrency(quote.offered_amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Interest Rate</p>
                          <p className="text-sm font-medium">{quote.offered_interest_rate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Term</p>
                          <p className="text-sm font-medium">{quote.offered_term_months} months</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-yellow-600">Awaiting response...</p>
                    )}
                  </div>
                ))}

                {quotations.filter(q => q.status === 'responded').length > 0 && (
                  <div className="mt-6">
                    <Link
                      to={`/proposals/${id}/quotations`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Compare & Optimize Quotations
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
