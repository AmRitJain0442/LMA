import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { FileText, BarChart3, AlertCircle, Building2, Briefcase } from 'lucide-react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import DocumentUpload from './pages/DocumentUpload'
import CovenantMonitor from './pages/CovenantMonitor'
import ProposalsDashboard from './pages/ProposalsDashboard'
import CreateProposal from './pages/CreateProposal'
import ProposalDetail from './pages/ProposalDetail'

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation()
  const isActive = location.pathname === to ||
    (to === '/proposals' && location.pathname.startsWith('/proposals'))

  return (
    <Link
      to={to}
      className={`
        inline-flex items-center px-4 py-2 rounded-neu-sm
        text-sm font-display font-semibold
        transition-all duration-300
        ${isActive
          ? 'shadow-neu-inset neu-text-accent'
          : 'shadow-neu neu-text-primary hover:shadow-neu-lg hover:-translate-y-0.5'
        }
      `.trim()}
    >
      <Icon className="w-4 h-4 mr-2" />
      {children}
    </Link>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen bg-neu-gradient">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-neu-bg-start via-neu-bg to-neu-bg-end shadow-neu sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <h1 className="text-3xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent cursor-pointer">
                    LoanLattice
                  </h1>
                </Link>
                <span className="ml-3 px-3 py-1 text-xs font-display font-semibold bg-accent-gradient text-white rounded-full shadow-lg">
                  AI-Powered
                </span>
              </div>
            </div>

            <div className="hidden sm:flex sm:space-x-4">
              <NavLink to="/proposals" icon={Briefcase}>
                Proposals
              </NavLink>
              <NavLink to="/documents" icon={BarChart3}>
                Documents
              </NavLink>
              <NavLink to="/upload" icon={FileText}>
                Upload
              </NavLink>
              <NavLink to="/covenants" icon={AlertCircle}>
                Covenants
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <Routes>
          {/* Syndication Marketplace */}
          <Route path="/proposals" element={<ProposalsDashboard />} />
          <Route path="/proposals/create" element={<CreateProposal />} />
          <Route path="/proposals/:id" element={<ProposalDetail />} />

          {/* Document Processing (Original MVP) */}
          <Route path="/documents" element={<Dashboard />} />
          <Route path="/upload" element={<DocumentUpload />} />
          <Route path="/covenants" element={<CovenantMonitor />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* App Routes with Navbar */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}

export default App
