import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Brain,
  Clock,
  DollarSign,
  Globe,
  Users,
  Sparkles,
  CheckCircle,
  Upload,
  Search,
  BarChart3
} from 'lucide-react';
import {
  GradientButton,
  ScrollSection,
  InfoCard,
  StatCard,
  AnimatedCard
} from '../components/modern';

export default function LandingNew() {
  const stats = [
    {
      icon: DollarSign,
      label: 'Loan Volume Processed',
      value: 2500000000,
      prefix: '$',
      suffix: '+',
      trend: 'up',
      trendValue: '+23%',
      accentColor: 'primary'
    },
    {
      icon: Brain,
      label: 'AI Accuracy Rate',
      value: 99.8,
      suffix: '%',
      trend: 'up',
      trendValue: '+2.3%',
      accentColor: 'accent'
    },
    {
      icon: Clock,
      label: 'Time Saved',
      value: 85,
      suffix: '%',
      trend: 'up',
      trendValue: '+15%',
      accentColor: 'secondary'
    },
    {
      icon: FileText,
      label: 'Documents Processed',
      value: 12500,
      suffix: '+',
      trend: 'up',
      trendValue: '+180',
      accentColor: 'primary'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced machine learning algorithms analyze loan documents with human-level accuracy, extracting key terms and covenants automatically.',
      accentColor: 'primary'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Processing',
      description: 'Process complex loan agreements in seconds, not hours. Our platform reduces document review time by up to 85%.',
      accentColor: 'secondary'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and compliance with global financial regulations ensure your sensitive data is always protected.',
      accentColor: 'accent'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Monitoring',
      description: 'Track covenant compliance in real-time with automated alerts and comprehensive dashboards for proactive risk management.',
      accentColor: 'primary'
    },
    {
      icon: Globe,
      title: 'Multi-Currency Support',
      description: 'Handle loans in any currency with automatic conversion and multi-jurisdiction compliance built-in.',
      accentColor: 'secondary'
    },
    {
      icon: Users,
      title: 'Collaborative Workflows',
      description: 'Streamline team collaboration with shared workspaces, comments, and approval workflows.',
      accentColor: 'accent'
    }
  ];

  const workflow = [
    {
      step: '01',
      icon: Upload,
      title: 'Upload Documents',
      description: 'Simply drag and drop your loan agreements. We support PDF, Word, and scanned documents.',
      color: 'primary'
    },
    {
      step: '02',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our AI engine extracts covenants, terms, and key metrics with 99.8% accuracy in seconds.',
      color: 'secondary'
    },
    {
      step: '03',
      icon: Search,
      title: 'Review & Validate',
      description: 'Review extracted data in an intuitive interface. Make adjustments and add notes as needed.',
      color: 'accent'
    },
    {
      step: '04',
      icon: BarChart3,
      title: 'Monitor & Report',
      description: 'Access real-time dashboards, automated alerts, and comprehensive reporting tools.',
      color: 'primary'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Floating Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb floating-orb-1 absolute -top-40 -left-40" />
        <div className="floating-orb floating-orb-2 absolute top-1/3 -right-40" />
        <div className="floating-orb floating-orb-3 absolute bottom-20 left-1/4" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10">
          <ScrollSection animation="fade-in-up" className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-duotone bg-opacity-10 backdrop-blur-sm border border-primary-200 mb-8">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">
                Powered by Advanced AI
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-gradient block mb-2">
                Transform Loan
              </span>
              <span className="text-dark-900">
                Management
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-dark-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Automate document processing, monitor covenants in real-time, and manage syndicated loans
              with AI-powered precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <GradientButton
                variant="duotone"
                size="lg"
                icon={ArrowRight}
                onClick={() => window.location.href = '/dashboard'}
              >
                Get Started Free
              </GradientButton>

              <GradientButton
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Features
              </GradientButton>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 items-center opacity-60">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-dark-700">SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-dark-700">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-dark-700">Bank-Grade Security</span>
              </div>
            </div>
          </ScrollSection>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollSection animation="fade-in-up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <ScrollSection
                  key={index}
                  animation="scale-in"
                  delay={index * 100}
                >
                  <StatCard {...stat} />
                </ScrollSection>
              ))}
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollSection animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              Everything you need to streamline loan management and reduce operational risk.
            </p>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollSection
                key={index}
                animation="fade-in-up"
                delay={index * 100}
              >
                <InfoCard {...feature} />
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 bg-gradient-dark text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <ScrollSection animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto">
              Get started in minutes with our streamlined workflow.
            </p>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((item, index) => (
              <ScrollSection
                key={index}
                animation="fade-in-up"
                delay={index * 150}
              >
                <AnimatedCard
                  className="glass-card-dark p-8 h-full"
                  hoverEffect="lift"
                  glowColor={item.color}
                >
                  {/* Step Number */}
                  <div className={`text-6xl font-bold text-gradient-${item.color} opacity-30 mb-4`}>
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm">
                      <item.icon className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-dark-200 leading-relaxed">{item.description}</p>
                </AnimatedCard>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <ScrollSection animation="scale-in">
            <AnimatedCard className="max-w-4xl mx-auto p-12 text-center" glowColor="primary">
              <Sparkles className="w-16 h-16 text-primary-600 mx-auto mb-6 animate-pulse-slow" />

              <h2 className="text-5xl font-bold mb-6">
                Ready to <span className="text-gradient">Transform</span> Your Workflow?
              </h2>

              <p className="text-xl text-dark-600 mb-10 max-w-2xl mx-auto">
                Join leading financial institutions using AI to streamline loan management
                and reduce operational costs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton
                  variant="duotone"
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Start Free Trial
                </GradientButton>

                <GradientButton
                  variant="ghost"
                  size="lg"
                >
                  Schedule Demo
                </GradientButton>
              </div>

              <p className="mt-8 text-sm text-dark-500">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </AnimatedCard>
          </ScrollSection>
        </div>
      </section>
    </div>
  );
}
