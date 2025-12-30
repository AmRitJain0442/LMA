import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react'
import { proposalAPI } from '../services/api'
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '../components/neumorphic'

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
      <div className="max-w-3xl mx-auto">
        <NeumorphicCard className="p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-success-gradient opacity-5"></div>
          <NeumorphicCard className="w-20 h-20 mx-auto mb-6 flex items-center justify-center relative z-10 bg-success-gradient" inset>
            <CheckCircle className="h-12 w-12 text-white" />
          </NeumorphicCard>
          <h2 className="text-3xl font-display font-bold bg-success-gradient bg-clip-text text-transparent mb-3 relative z-10">
            Proposal Created Successfully!
          </h2>
          <p className="text-base neu-text-muted font-body mb-4 relative z-10">
            AI research is now running in the background...
          </p>
          <p className="text-sm bg-accent-gradient bg-clip-text text-transparent font-body font-semibold relative z-10">
            Redirecting to proposal details...
          </p>
        </NeumorphicCard>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/proposals')}
          className="flex items-center text-sm neu-text-muted hover:neu-text-accent font-body font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Proposals
        </button>
        <h1 className="text-5xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mb-2">
          Create Loan Proposal
        </h1>
        <p className="text-base neu-text-muted font-body">
          Fill in the details below. AI will automatically research the client and generate a pitch.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <NeumorphicCard className="p-4 bg-neu-error bg-opacity-10" inset>
          <p className="text-sm text-neu-error font-body">{error}</p>
        </NeumorphicCard>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <NeumorphicCard className="p-8 space-y-8">
          {/* Client Information */}
          <div>
            <h3 className="text-xl font-display font-bold neu-text-primary mb-6">
              Client Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <NeumorphicInput
                  label="Company Name"
                  name="client_name"
                  required
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="e.g., Tesla Inc"
                />
              </div>

              <NeumorphicInput
                label="Industry"
                name="client_industry"
                required
                value={formData.client_industry}
                onChange={handleChange}
                placeholder="e.g., Automotive"
              />

              <NeumorphicInput
                label="Country"
                name="client_country"
                required
                value={formData.client_country}
                onChange={handleChange}
                placeholder="e.g., United States"
              />

              <div className="sm:col-span-2">
                <NeumorphicInput
                  label="Website"
                  type="url"
                  name="client_website"
                  value={formData.client_website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  helperText="AI will use this for research"
                />
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="pt-6">
            <h3 className="text-xl font-display font-bold neu-text-primary mb-6">
              Loan Requirements
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <NeumorphicInput
                label="Requested Amount"
                type="number"
                name="requested_amount"
                required
                min="0"
                step="0.01"
                value={formData.requested_amount}
                onChange={handleChange}
                placeholder="250000000"
                helperText="Enter amount in selected currency"
              />

              <div>
                <label className="block text-sm font-medium neu-text-primary mb-2 font-display">
                  Currency <span className="text-neu-error ml-1">*</span>
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="neu-input w-full px-4 py-2.5 neu-text-primary font-body"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                  <option value="SAR">SAR</option>
                </select>
              </div>

              <NeumorphicInput
                label="Desired Term (Months)"
                type="number"
                name="desired_term_months"
                required
                min="1"
                value={formData.desired_term_months}
                onChange={handleChange}
              />

              <NeumorphicInput
                label="Max Acceptable Rate (%)"
                type="number"
                name="max_acceptable_rate"
                min="0"
                max="100"
                step="0.1"
                value={formData.max_acceptable_rate}
                onChange={handleChange}
                placeholder="5.5"
                helperText="Optional - banks will consider this"
              />

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium neu-text-primary mb-2 font-display">
                  Loan Purpose <span className="text-neu-error ml-1">*</span>
                </label>
                <textarea
                  name="loan_purpose"
                  required
                  rows="3"
                  value={formData.loan_purpose}
                  onChange={handleChange}
                  className="neu-input w-full px-4 py-2.5 neu-text-primary placeholder:neu-text-muted font-body"
                  placeholder="e.g., Expansion of manufacturing facilities and working capital"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 flex items-center justify-between">
            <NeumorphicButton
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate('/proposals')}
            >
              Cancel
            </NeumorphicButton>
            <NeumorphicButton
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={loading}
            >
              Create Proposal
            </NeumorphicButton>
          </div>
        </NeumorphicCard>
      </form>

      {/* Info */}
      <NeumorphicCard className="p-6">
        <h4 className="text-base font-display font-semibold neu-text-accent mb-3">
          What happens next?
        </h4>
        <ul className="text-sm neu-text-muted font-body space-y-2 list-disc list-inside">
          <li>AI will research your client using web search</li>
          <li>Financial analysis and credit assessment will be generated</li>
          <li>A professional pitch document will be created automatically</li>
          <li>You can then select banks and request quotations</li>
        </ul>
      </NeumorphicCard>
    </div>
  )
}
