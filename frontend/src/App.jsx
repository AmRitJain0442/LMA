import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { FileText, BarChart3, AlertCircle, Building2, Briefcase, BookOpen } from 'lucide-react'
import LandingNew from './pages/LandingNew'
import Dashboard from './pages/Dashboard'
import DocumentUpload from './pages/DocumentUpload'
import CovenantMonitor from './pages/CovenantMonitor'
import ProposalsDashboard from './pages/ProposalsDashboard'
import CreateProposal from './pages/CreateProposal'
import ProposalDetail from './pages/ProposalDetail'
import LMAGuide from './pages/LMAGuide'

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation()
  const isActive = location.pathname === to ||
    (to === '/proposals' && location.pathname.startsWith('/proposals'))

  return (
    <Link
      to={to}
      className={`
        inline-flex items-center px-5 py-2.5 rounded-xl
        text-sm font-semibold
        transition-all duration-300
        ${isActive
          ? 'bg-gradient-duotone text-white shadow-lg'
          : 'text-dark-700 hover:bg-primary-50 hover:text-primary-700'
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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card sticky top-0 z-50 border-b border-dark-200 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <h1 className="text-3xl font-display font-bold text-gradient cursor-pointer">
                    LoanLattice
                  </h1>
                </Link>
                <span className="ml-3 px-3 py-1.5 text-xs font-semibold bg-gradient-duotone text-white rounded-full shadow-lg">
                  AI-Powered
                </span>
              </div>
            </div>

            <div className="hidden sm:flex sm:space-x-2">
              <NavLink to="/lma-guide" icon={BookOpen}>
                LMA Guide
              </NavLink>
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
          {/* LMA Knowledge Base */}
          <Route path="/lma-guide" element={<LMAGuide />} />

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
        <Route path="/" element={<LandingNew />} />

        {/* App Routes with Navbar */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}

export default App
