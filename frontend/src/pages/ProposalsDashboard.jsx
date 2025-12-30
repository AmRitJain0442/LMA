import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus, Loader, TrendingUp, Building2, DollarSign, Calendar } from 'lucide-react'
import { proposalAPI } from '../services/api'

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
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      mla_bidding: 'bg-purple-100 text-purple-800',
      research_in_progress: 'bg-yellow-100 text-yellow-800',
      pitch_generated: 'bg-blue-100 text-blue-800',
      sent_to_banks: 'bg-indigo-100 text-indigo-800',
      collecting_quotes: 'bg-orange-100 text-orange-800',
      optimization_complete: 'bg-green-100 text-green-800',
      approved: 'bg-green-100 text-green-800',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace(/_/g, ' ')}
      </span>
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
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Proposals</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage syndicated loan proposals and track their progress
          </p>
        </div>
        <Link
          to="/proposals/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Proposal
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Proposals</dt>
                  <dd className="text-lg font-semibold text-gray-900">{proposals.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {proposals.filter(p => !['approved', 'rejected'].includes(p.status)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(proposals.reduce((sum, p) => sum + (p.requested_amount || 0), 0))}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {proposals.filter(p => p.status === 'approved').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-2">
        {['all', 'draft', 'pitch_generated', 'sent_to_banks', 'collecting_quotes', 'approved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 text-sm rounded ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {proposals.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No proposals yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new loan proposal</p>
            <div className="mt-6">
              <Link
                to="/proposals/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Proposal
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {proposals.map((proposal) => (
              <Link
                key={proposal.id}
                to={`/proposals/${proposal.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {proposal.client_name}
                          </p>
                          <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                            <span>{proposal.client_industry || 'N/A'}</span>
                            <span>•</span>
                            <span>{proposal.client_country || 'N/A'}</span>
                            <span>•</span>
                            <span>{formatCurrency(proposal.requested_amount, proposal.currency)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-4">
                      {getStatusBadge(proposal.status)}
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(proposal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${getProgress(proposal.status)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                    {proposal.research_completed && (
                      <span className="flex items-center text-green-600">
                        ✓ Research Complete
                      </span>
                    )}
                    {proposal.pitch_generated && (
                      <span className="flex items-center text-green-600">
                        ✓ Pitch Generated
                      </span>
                    )}
                    {proposal.loan_purpose && (
                      <span className="truncate max-w-md">
                        Purpose: {proposal.loan_purpose}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
