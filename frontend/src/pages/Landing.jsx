import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Globe,
  Sparkles,
  CheckCircle,
  BarChart3,
  Brain,
  Clock,
  DollarSign
} from 'lucide-react'
import { NeumorphicCard, NeumorphicButton } from '../components/neumorphic'

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[id^="animate-"]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const stats = [
    { label: 'Loan Volume', value: '$2.5B+', icon: DollarSign },
    { label: 'AI Accuracy', value: '99.8%', icon: Brain },
    { label: 'Time Saved', value: '95%', icon: Clock },
    { label: 'Banks Connected', value: '200+', icon: Globe },
  ]

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Research',
      description: 'Gemini AI analyzes companies in seconds, providing comprehensive financial insights and risk assessments.',
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      icon: Sparkles,
      title: 'Auto Pitch Generation',
      description: 'Generate professional loan pitch documents automatically with AI-driven content tailored to each client.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Smart Optimization',
      description: 'AI algorithms optimize syndicate formation to minimize rates while meeting loan requirements.',
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Real-time credit scoring and SWOT analysis powered by web search and financial data.',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: Users,
      title: 'Bank Marketplace',
      description: '200+ EMEA banks with AI-powered matching based on risk appetite and sector preferences.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Instant Quotations',
      description: 'Receive AI-generated quotations from multiple banks simultaneously in minutes, not days.',
      gradient: 'from-emerald-500 to-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-neu-gradient overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-20 -left-20 w-96 h-96 bg-accent-gradient opacity-10 rounded-full blur-3xl animate-neu-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/3 -right-20 w-80 h-80 bg-success-gradient opacity-10 rounded-full blur-3xl animate-neu-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-72 h-72 bg-warning-gradient opacity-10 rounded-full blur-3xl animate-neu-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 bg-gradient-to-r from-neu-bg-start/80 via-neu-bg/80 to-neu-bg-end/80 backdrop-blur-lg shadow-neu sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 animate-[slideInLeft_0.6s_ease-out]">
              <h1 className="text-3xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent">
                LoanLattice
              </h1>
              <span className="px-3 py-1 text-xs font-display font-semibold bg-accent-gradient text-white rounded-full shadow-lg">
                AI-Powered
              </span>
            </div>
            <Link to="/proposals" className="animate-[slideInRight_0.6s_ease-out]">
              <NeumorphicButton variant="primary" size="md">
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </NeumorphicButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Animated Badge */}
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-neu-bg-start to-neu-bg-end shadow-neu animate-[fadeInDown_0.8s_ease-out]"
            >
              <Sparkles className="h-4 w-4 text-neu-accent animate-pulse" />
              <span className="text-sm font-display font-semibold neu-text-primary">
                Revolutionizing Syndicated Lending
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold leading-tight animate-[fadeInUp_1s_ease-out]">
              <span className="bg-accent-gradient bg-clip-text text-transparent animate-[gradientShift_3s_ease-in-out_infinite]">
                AI-Powered
              </span>
              <br />
              <span className="neu-text-primary">
                Loan Syndication
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl neu-text-muted font-body max-w-3xl mx-auto leading-relaxed animate-[fadeInUp_1.2s_ease-out]">
              Automate research, generate pitches, and optimize syndicates with Gemini AI.
              Close deals 10x faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fadeInUp_1.4s_ease-out]">
              <Link to="/proposals">
                <NeumorphicButton variant="primary" size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </NeumorphicButton>
              </Link>
              <a href="#features">
                <NeumorphicButton variant="secondary" size="lg">
                  See How It Works
                </NeumorphicButton>
              </a>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto pt-16 animate-[fadeInUp_1.6s_ease-out]">
              {stats.map((stat, index) => (
                <NeumorphicCard
                  key={stat.label}
                  className="p-6 text-center transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  hover
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-5 transition-opacity" />
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-neu-accent group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm neu-text-muted font-body">{stat.label}</div>
                </NeumorphicCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            id="animate-features-header"
            className={`text-center mb-20 transition-all duration-1000 ${
              isVisible['animate-features-header']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl sm:text-6xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mb-6">
              Powered by AI
            </h2>
            <p className="text-xl neu-text-muted font-body max-w-2xl mx-auto">
              From research to optimization, every step enhanced with Gemini AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                id={`animate-feature-${index}`}
                className={`transition-all duration-1000 ${
                  isVisible[`animate-feature-${index}`]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <NeumorphicCard className="p-8 h-full group hover:shadow-neu-xl transition-all duration-500 relative overflow-hidden">
                  {/* Gradient Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {/* Animated Icon */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity rounded-full`} />
                    <NeumorphicCard className="w-16 h-16 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300" inset>
                      <feature.icon className={`h-8 w-8 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} />
                    </NeumorphicCard>
                  </div>

                  {/* Content */}
                  <h3 className={`text-xl font-display font-bold mb-3 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="neu-text-muted font-body leading-relaxed">
                    {feature.description}
                  </p>
                </NeumorphicCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            id="animate-workflow-header"
            className={`text-center mb-20 transition-all duration-1000 ${
              isVisible['animate-workflow-header']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl sm:text-6xl font-display font-bold bg-success-gradient bg-clip-text text-transparent mb-6">
              From Pitch to Close
            </h2>
            <p className="text-xl neu-text-muted font-body max-w-2xl mx-auto">
              Automated workflow that handles everything
            </p>
          </div>

          <div className="relative">
            {/* Animated Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-gradient via-success-gradient to-warning-gradient opacity-20 hidden lg:block" />

            {/* Steps */}
            {[
              { step: 1, title: 'Enter Client Details', desc: 'Basic company information', icon: Users },
              { step: 2, title: 'AI Research', desc: 'Gemini analyzes financials & risks', icon: Brain },
              { step: 3, title: 'Generate Pitch', desc: 'Professional document created', icon: BarChart3 },
              { step: 4, title: 'Send to Banks', desc: 'AI matches with 200+ banks', icon: Globe },
              { step: 5, title: 'Receive Quotes', desc: 'AI generates quotations', icon: DollarSign },
              { step: 6, title: 'Optimize Syndicate', desc: 'Best rates, minimal banks', icon: TrendingUp },
            ].map((item, index) => (
              <div
                key={item.step}
                id={`animate-step-${index}`}
                className={`relative mb-16 last:mb-0 transition-all duration-1000 ${
                  isVisible[`animate-step-${index}`]
                    ? 'opacity-100 translate-x-0'
                    : `opacity-0 ${index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'}`
                }`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className={`lg:flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className="lg:w-5/12">
                    <NeumorphicCard className="p-8 group hover:shadow-neu-xl transition-all duration-500">
                      <div className="flex items-start space-x-4">
                        <NeumorphicCard className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-accent-gradient" inset>
                          <item.icon className="h-6 w-6 text-white" />
                        </NeumorphicCard>
                        <div className="flex-1">
                          <h3 className="text-2xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mb-2">
                            {item.title}
                          </h3>
                          <p className="neu-text-muted font-body">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </NeumorphicCard>
                  </div>

                  {/* Step Number */}
                  <div className="hidden lg:flex lg:w-2/12 justify-center my-8 lg:my-0">
                    <div className="relative">
                      <NeumorphicCard
                        className="w-20 h-20 flex items-center justify-center animate-neu-pulse"
                        inset
                      >
                        <span className="text-3xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent">
                          {item.step}
                        </span>
                      </NeumorphicCard>
                    </div>
                  </div>

                  <div className="lg:w-5/12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <NeumorphicCard
            id="animate-cta"
            className={`p-16 text-center relative overflow-hidden transition-all duration-1000 ${
              isVisible['animate-cta']
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-accent-gradient opacity-5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gradient opacity-10 rounded-full blur-3xl animate-neu-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-success-gradient opacity-10 rounded-full blur-3xl animate-neu-pulse" style={{ animationDelay: '1s' }} />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-5xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent mb-6">
                Ready to Transform Your Lending?
              </h2>
              <p className="text-xl neu-text-muted font-body mb-10 max-w-2xl mx-auto">
                Join leading financial institutions using AI to close deals faster
              </p>
              <Link to="/proposals">
                <NeumorphicButton variant="primary" size="lg" className="group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </NeumorphicButton>
              </Link>
            </div>
          </NeumorphicCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-neu-shadow-dark/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h3 className="text-2xl font-display font-bold bg-accent-gradient bg-clip-text text-transparent">
              LoanLattice
            </h3>
            <span className="px-2 py-1 text-xs font-display font-semibold bg-accent-gradient text-white rounded-full">
              AI
            </span>
          </div>
          <p className="neu-text-muted font-body text-sm">
            Powered by Gemini AI • Built for the Future of Finance
          </p>
          <p className="neu-text-muted font-body text-xs mt-2">
            © 2025 LoanLattice. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}
