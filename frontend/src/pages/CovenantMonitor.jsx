import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, Loader, TrendingDown } from 'lucide-react'
import { covenantAPI, loanAPI } from '../services/api'

export default function CovenantMonitor() {
  const [covenants, setCovenants] = useState([])
  const [loans, setLoans] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const covenantsData = await covenantAPI.listCovenants()
      setCovenants(covenantsData)

      const uniqueLoanIds = [...new Set(covenantsData.map(c => c.loan_id))]
      const loansData = await Promise.all(
        uniqueLoanIds.map(id => loanAPI.getLoan(id))
      )

      const loansMap = {}
      loansData.forEach(loan => {
        loansMap[loan.id] = loan
      })
      setLoans(loansMap)
    } catch (err) {
      console.error('Error loading covenants:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'breach':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      compliant: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      breach: 'bg-red-100 text-red-800',
      unknown: 'bg-gray-100 text-gray-800',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const getCovenantTypeBadge = (type) => {
    const styles = {
      financial: 'bg-blue-100 text-blue-800',
      affirmative: 'bg-purple-100 text-purple-800',
      negative: 'bg-pink-100 text-pink-800',
      reporting: 'bg-indigo-100 text-indigo-800',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    )
  }

  const filteredCovenants = covenants.filter(covenant => {
    if (filter === 'all') return true
    return covenant.status === filter
  })

  const stats = {
    total: covenants.length,
    compliant: covenants.filter(c => c.status === 'compliant').length,
    warning: covenants.filter(c => c.status === 'warning').length,
    breach: covenants.filter(c => c.status === 'breach').length,
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Covenant Monitor</h1>
        <p className="mt-2 text-sm text-gray-600">
          Real-time monitoring of loan covenants and compliance status
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Covenants</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Compliant</p>
                <p className="mt-1 text-2xl font-semibold text-green-600">{stats.compliant}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Warning</p>
                <p className="mt-1 text-2xl font-semibold text-yellow-600">{stats.warning}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Breach</p>
                <p className="mt-1 text-2xl font-semibold text-red-600">{stats.breach}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Covenant List</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('breach')}
                className={`px-3 py-1 text-sm rounded ${
                  filter === 'breach'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Breach
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`px-3 py-1 text-sm rounded ${
                  filter === 'warning'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Warning
              </button>
              <button
                onClick={() => setFilter('compliant')}
                className={`px-3 py-1 text-sm rounded ${
                  filter === 'compliant'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Compliant
              </button>
            </div>
          </div>
        </div>

        {/* Covenant Table */}
        <div className="overflow-x-auto">
          {filteredCovenants.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No covenants found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? 'Upload loan documents to extract covenants'
                  : `No covenants with ${filter} status`}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Covenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threshold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    30d Risk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCovenants.map((covenant) => {
                  const loan = loans[covenant.loan_id]
                  return (
                    <tr key={covenant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(covenant.status)}
                          <span className="ml-2">{getStatusBadge(covenant.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{covenant.covenant_name}</div>
                        <div className="text-xs text-gray-500">{covenant.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCovenantTypeBadge(covenant.covenant_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan?.borrower_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {covenant.metric_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {covenant.threshold_value
                          ? `${covenant.comparison_operator} ${covenant.threshold_value}`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {covenant.current_value || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {covenant.breach_probability_30d ? (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  covenant.breach_probability_30d > 0.7
                                    ? 'bg-red-500'
                                    : covenant.breach_probability_30d > 0.4
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${covenant.breach_probability_30d * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round(covenant.breach_probability_30d * 100)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Covenant Monitoring Features</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Real-time tracking of financial and non-financial covenants</li>
          <li>Automated breach risk prediction (30/60/90-day forecasts)</li>
          <li>Color-coded alerts for compliance status</li>
          <li>Integration with loan documentation for complete visibility</li>
        </ul>
      </div>
    </div>
  )
}
