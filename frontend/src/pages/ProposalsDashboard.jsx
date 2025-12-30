import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus, Loader, TrendingUp, Building2, DollarSign, Calendar } from 'lucide-react'
import { proposalAPI } from '../services/api'
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge } from '../components/neumorphic'

export default function ProposalsDashboard() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadProposals()
  }, [filter])

  const loadProposals = async () => {
    try {
      setLoading(true)
      const data = await proposalAPI.listProposals(filter === 'all' ? null : filter)
      setProposals(data)
    } catch (err) {
      console.error('Error loading proposals:', err)
    } finally {
      setLoading(false)
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

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'neutral',
      mla_bidding: 'accent',
      research_in_progress: 'warning',
      pitch_generated: 'accent',
      sent_to_banks: 'accent',
      collecting_quotes: 'warning',
      optimization_complete: 'success',
      approved: 'success',
    }
    return (
      <NeumorphicBadge variant={variants[status] || 'neutral'} size="sm">
        {status.replace(/_/g, ' ')}
      </NeumorphicBadge>
    )
  }

  const getProgress = (status) => {
    const stages = {
      draft: 10,
      research_in_progress: 30,
      pitch_generated: 50,
      sent_to_banks: 70,
      collecting_quotes: 85,
      optimization_complete: 95,
      approved: 100,
    }
    return stages[status] || 0
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mb-2">
            Loan Proposals
          </h1>
          <p className="text-base neu-text-muted font-body">
            Manage syndicated loan proposals and track their progress
          </p>
        </div>
        <Link to="/proposals/create">
          <NeumorphicButton variant="primary" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Proposal
          </NeumorphicButton>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <NeumorphicCard className="p-6 relative overflow-hidden" hover>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gradient opacity-5 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex-shrink-0">
              <NeumorphicCard className="p-3" size="sm" inset>
                <FileText className="h-6 w-6 neu-text-muted" />
              </NeumorphicCard>
            </div>
            <div className="flex-1">
              <dt className="text-sm font-display font-medium neu-text-muted truncate">
                Total Proposals
              </dt>
              <dd className="text-2xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mt-1">
                {proposals.length}
              </dd>
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6 relative overflow-hidden" hover>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gradient opacity-5 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex-shrink-0">
              <NeumorphicCard className="p-3" size="sm" inset>
                <TrendingUp className="h-6 w-6 neu-text-accent" />
              </NeumorphicCard>
            </div>
            <div className="flex-1">
              <dt className="text-sm font-display font-medium neu-text-muted truncate">
                Active
              </dt>
              <dd className="text-2xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mt-1">
                {proposals.filter(p => !['approved', 'rejected'].includes(p.status)).length}
              </dd>
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6 relative overflow-hidden" hover>
          <div className="absolute top-0 right-0 w-32 h-32 bg-success-gradient opacity-5 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex-shrink-0">
              <NeumorphicCard className="p-3" size="sm" inset>
                <DollarSign className="h-6 w-6 text-neu-success" />
              </NeumorphicCard>
            </div>
            <div className="flex-1">
              <dt className="text-sm font-display font-medium neu-text-muted truncate">
                Total Value
              </dt>
              <dd className="text-2xl font-display font-bold bg-success-gradient bg-clip-text text-transparent mt-1">
                {formatCurrency(proposals.reduce((sum, p) => sum + (p.requested_amount || 0), 0))}
              </dd>
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6 relative overflow-hidden" hover>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gradient opacity-5 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex-shrink-0">
              <NeumorphicCard className="p-3" size="sm" inset>
                <Building2 className="h-6 w-6 neu-text-accent" />
              </NeumorphicCard>
            </div>
            <div className="flex-1">
              <dt className="text-sm font-display font-medium neu-text-muted truncate">
                Completed
              </dt>
              <dd className="text-2xl font-display font-bold bg-success-gradient bg-clip-text text-transparent mt-1">
                {proposals.filter(p => p.status === 'approved').length}
              </dd>
            </div>
          </div>
        </NeumorphicCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {['all', 'draft', 'pitch_generated', 'sent_to_banks', 'collecting_quotes', 'approved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`
              px-4 py-2 rounded-neu-sm text-sm font-display font-semibold
              transition-all duration-300
              ${filter === status
                ? 'shadow-neu-inset neu-text-accent'
                : 'shadow-neu neu-text-primary hover:shadow-neu-lg hover:-translate-y-0.5'
              }
            `.trim()}
          >
            {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <NeumorphicCard className="overflow-hidden">
        {proposals.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <NeumorphicCard className="w-20 h-20 mx-auto mb-6 flex items-center justify-center" inset>
              <FileText className="h-10 w-10 neu-text-muted" />
            </NeumorphicCard>
            <h3 className="text-lg font-display font-semibold neu-text-primary mb-2">
              No proposals yet
            </h3>
            <p className="text-sm neu-text-muted font-body mb-8">
              Get started by creating a new loan proposal
            </p>
            <Link to="/proposals/create">
              <NeumorphicButton variant="primary" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                New Proposal
              </NeumorphicButton>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neu-shadow-dark divide-opacity-20">
            {proposals.map((proposal) => (
              <Link
                key={proposal.id}
                to={`/proposals/${proposal.id}`}
                className="block group"
              >
                <div className="px-6 py-5 hover:bg-neu-bg hover:bg-opacity-50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <NeumorphicCard className="p-2" size="sm" inset>
                          <Building2 className="h-5 w-5 neu-text-accent" />
                        </NeumorphicCard>
                        <div className="flex-1">
                          <p className="text-base font-display font-semibold neu-text-primary truncate group-hover:neu-text-accent transition-colors">
                            {proposal.client_name}
                          </p>
                          <div className="mt-1 flex items-center text-sm neu-text-muted font-body space-x-3">
                            <span>{proposal.client_industry || 'N/A'}</span>
                            <span>•</span>
                            <span>{proposal.client_country || 'N/A'}</span>
                            <span>•</span>
                            <span className="font-semibold neu-text-primary">
                              {formatCurrency(proposal.requested_amount, proposal.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-4">
                      {getStatusBadge(proposal.status)}
                      <div className="text-right">
                        <p className="text-xs neu-text-muted font-body">
                          {new Date(proposal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <NeumorphicCard className="h-3 overflow-hidden" size="sm" inset>
                      <div
                        className="h-full bg-accent-gradient rounded-neu-sm transition-all duration-500 shadow-lg"
                        style={{ width: `${getProgress(proposal.status)}%` }}
                      ></div>
                    </NeumorphicCard>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center text-xs space-x-4">
                    {proposal.research_completed && (
                      <span className="flex items-center text-neu-success font-body font-medium">
                        ✓ Research Complete
                      </span>
                    )}
                    {proposal.pitch_generated && (
                      <span className="flex items-center text-neu-success font-body font-medium">
                        ✓ Pitch Generated
                      </span>
                    )}
                    {proposal.loan_purpose && (
                      <span className="truncate max-w-md neu-text-muted font-body">
                        Purpose: {proposal.loan_purpose}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </NeumorphicCard>
    </div>
  )
}
