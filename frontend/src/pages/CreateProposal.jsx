import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react'
import { proposalAPI } from '../services/api'

export default function CreateProposal() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    client_name: '',
    client_industry: '',
    client_country: '',
    client_website: '',
    requested_amount: '',
    currency: 'USD',
    loan_purpose: '',
    desired_term_months: '60',
    max_acceptable_rate: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Convert strings to numbers
      const payload = {
        ...formData,
        requested_amount: parseFloat(formData.requested_amount),
        desired_term_months: parseInt(formData.desired_term_months),
        max_acceptable_rate: formData.max_acceptable_rate ? parseFloat(formData.max_acceptable_rate) : null,
      }

      const result = await proposalAPI.createProposal(payload)

      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/proposals/${result.id}`)
      }, 2000)

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create proposal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-50 rounded-lg p-12 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">Proposal Created Successfully!</h2>
            <p className="text-green-700 mb-4">AI research is now running in the background...</p>
            <p className="text-sm text-green-600">Redirecting to proposal details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/proposals')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Proposals
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create Loan Proposal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below. AI will automatically research the client and generate a pitch.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="px-6 py-8 space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    required
                    value={formData.client_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Tesla Inc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Industry *
                  </label>
                  <input
                    type="text"
                    name="client_industry"
                    required
                    value={formData.client_industry}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Automotive"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="client_country"
                    required
                    value={formData.client_country}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., United States"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    name="client_website"
                    value={formData.client_website}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">AI will use this for research</p>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Requirements</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Requested Amount *
                  </label>
                  <input
                    type="number"
                    name="requested_amount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.requested_amount}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="250000000"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter amount in selected currency</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AED">AED</option>
                    <option value="SAR">SAR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Desired Term (Months) *
                  </label>
                  <input
                    type="number"
                    name="desired_term_months"
                    required
                    min="1"
                    value={formData.desired_term_months}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Acceptable Rate (%)
                  </label>
                  <input
                    type="number"
                    name="max_acceptable_rate"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.max_acceptable_rate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5.5"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional - banks will consider this</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Purpose *
                  </label>
                  <textarea
                    name="loan_purpose"
                    required
                    rows="3"
                    value={formData.loan_purpose}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Expansion of manufacturing facilities and working capital"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/proposals')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                'Create Proposal'
              )}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>AI will research your client using web search</li>
            <li>Financial analysis and credit assessment will be generated</li>
            <li>A professional pitch document will be created automatically</li>
            <li>You can then select banks and request quotations</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
