import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { FileText, BarChart3, AlertCircle, Building2, Briefcase } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import DocumentUpload from './pages/DocumentUpload'
import CovenantMonitor from './pages/CovenantMonitor'
import ProposalsDashboard from './pages/ProposalsDashboard'
import CreateProposal from './pages/CreateProposal'
import ProposalDetail from './pages/ProposalDetail'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-2xl font-bold text-blue-600">LoanLattice</h1>
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">v0.2</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/proposals"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:border-gray-300"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Proposals
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:border-gray-300"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Documents
                  </Link>
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:border-gray-300"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Upload
                  </Link>
                  <Link
                    to="/covenants"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:border-gray-300"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Covenants
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            {/* Syndication Marketplace */}
            <Route path="/proposals" element={<ProposalsDashboard />} />
            <Route path="/proposals/create" element={<CreateProposal />} />
            <Route path="/proposals/:id" element={<ProposalDetail />} />

            {/* Document Processing (Original MVP) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<DocumentUpload />} />
            <Route path="/covenants" element={<CovenantMonitor />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
