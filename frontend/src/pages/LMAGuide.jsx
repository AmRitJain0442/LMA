import { useState } from 'react';
import {
  BookOpen,
  TrendingDown,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Leaf,
  Scale,
  FileText,
  ArrowRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ScrollSection, AnimatedCard, GradientButton, InfoCard } from '../components/modern';
import lmaKnowledge from '../data/lmaKnowledge';

export default function LMAGuide() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'rfr', label: 'RFR Transition', icon: TrendingDown },
    { id: 'negotiation', label: 'Negotiation Points', icon: Scale },
    { id: 'hot-topics', label: 'Hot Topics', icon: Sparkles },
    { id: 'glossary', label: 'Glossary', icon: FileText }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'badge-secondary';
      case 'medium':
        return 'badge-primary';
      default:
        return 'badge-success';
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb floating-orb-1 absolute -top-40 -right-40 opacity-30" />
        <div className="floating-orb floating-orb-2 absolute bottom-20 -left-40 opacity-30" />
      </div>

      {/* Header */}
      <section className="relative py-20 bg-gradient-dark text-white overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <ScrollSection animation="fade-in-up" className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 mb-6">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-semibold">
                LMA Investment Grade Agreements Guide
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              A Borrower's Guide to <br />
              <span className="text-gradient-secondary">LMA Agreements</span>
            </h1>

            <p className="text-xl text-dark-100 mb-8">
              {lmaKnowledge.overview.edition} • {lmaKnowledge.overview.authors}
            </p>

            <p className="text-lg text-dark-200 leading-relaxed">
              {lmaKnowledge.overview.purpose}
            </p>
          </ScrollSection>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-20 z-40 bg-white bg-opacity-95 backdrop-blur-md border-b border-dark-200 shadow-lg">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap
                  transition-all duration-300
                  ${activeSection === section.id
                    ? 'bg-gradient-duotone text-white shadow-lg'
                    : 'text-dark-700 hover:bg-primary-50 hover:text-primary-700'
                  }
                `}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-12 relative z-10">
        {/* Overview Section */}
        <section id="overview" className="mb-20">
          <ScrollSection animation="fade-in-up">
            <h2 className="text-4xl font-bold mb-8">
              <span className="text-gradient">Overview</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                icon={BookOpen}
                title="Edition"
                description={lmaKnowledge.overview.edition}
                accentColor="primary"
              />
              <InfoCard
                icon={FileText}
                title="Authors"
                description={lmaKnowledge.overview.authors}
                accentColor="secondary"
              />
              <InfoCard
                icon={Info}
                title="Purpose"
                description={lmaKnowledge.overview.purpose}
                accentColor="accent"
              />
            </div>
          </ScrollSection>
        </section>

        {/* RFR Transition Section */}
        <section id="rfr" className="mb-20">
          <ScrollSection animation="fade-in-up">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient">{lmaKnowledge.rfrTransition.title}</span>
            </h2>
            <p className="text-lg text-dark-600 mb-8">
              {lmaKnowledge.rfrTransition.description}
            </p>

            {/* Fundamental Shift */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-primary-600" />
                {lmaKnowledge.rfrTransition.fundamentalShift.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lmaKnowledge.rfrTransition.fundamentalShift.points.map((point, idx) => (
                  <ScrollSection key={idx} animation="scale-in" delay={idx * 100}>
                    <AnimatedCard hoverEffect="lift" glowColor="primary" className="p-6 h-full">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${point.impact === 'high' ? 'bg-secondary-100 text-secondary-600' : 'bg-primary-100 text-primary-600'}`}>
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-2">{point.heading}</h4>
                          <p className="text-dark-600 leading-relaxed">{point.description}</p>
                          <span className={`inline-block mt-3 badge ${point.impact === 'high' ? 'badge-secondary' : 'badge-primary'}`}>
                            {point.impact.toUpperCase()} IMPACT
                          </span>
                        </div>
                      </div>
                    </AnimatedCard>
                  </ScrollSection>
                ))}
              </div>
            </div>

            {/* Key Conventions */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-accent-600" />
                {lmaKnowledge.rfrTransition.keyConventions.title}
              </h3>

              <div className="space-y-4">
                {lmaKnowledge.rfrTransition.keyConventions.conventions.map((convention, idx) => (
                  <ScrollSection key={idx} animation="slide-up" delay={idx * 100}>
                    <AnimatedCard hoverEffect="lift" className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-bold text-primary-700">{convention.name}</h4>
                        <span className={`badge ${getPriorityColor(convention.importance)}`}>
                          {convention.importance}
                        </span>
                      </div>
                      <p className="text-dark-600 mb-3 leading-relaxed">{convention.description}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-lg">
                        <Info className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-primary-700">
                          Typical: {convention.typical}
                        </span>
                      </div>
                    </AnimatedCard>
                  </ScrollSection>
                ))}
              </div>
            </div>

            {/* Credit Adjustment Spread */}
            <ScrollSection animation="fade-in-up">
              <AnimatedCard hoverEffect="lift" glowColor="secondary" className="p-8 bg-gradient-subtle">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-secondary-100">
                    <DollarSign className="w-8 h-8 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {lmaKnowledge.rfrTransition.creditAdjustmentSpread.title}
                    </h3>
                    <p className="text-dark-600 leading-relaxed">
                      {lmaKnowledge.rfrTransition.creditAdjustmentSpread.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lmaKnowledge.rfrTransition.creditAdjustmentSpread.details.map((detail, idx) => (
                    <div key={idx} className="glass-card p-4">
                      <h4 className="font-bold text-dark-800 mb-3">{detail.aspect}</h4>
                      {detail.options ? (
                        <ul className="space-y-2">
                          {detail.options.map((option, oidx) => (
                            <li key={oidx} className="flex items-start gap-2 text-dark-600">
                              <CheckCircle className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
                              <span>{option}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-dark-600">{detail.method}</p>
                      )}
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </ScrollSection>

            {/* RFR Comparison Table */}
            <ScrollSection animation="fade-in-up" className="mt-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-600" />
                {lmaKnowledge.rfrComparison.title}
              </h3>

              <AnimatedCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-duotone text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Currency</th>
                        <th className="px-6 py-4 text-left font-semibold">Legacy (LIBOR)</th>
                        <th className="px-6 py-4 text-left font-semibold">RFR</th>
                        <th className="px-6 py-4 text-left font-semibold">Administrator</th>
                        <th className="px-6 py-4 text-left font-semibold">Transition Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-200">
                      {lmaKnowledge.rfrComparison.currencies.map((currency, idx) => (
                        <tr key={idx} className="hover:bg-primary-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-primary-700">{currency.currency}</td>
                          <td className="px-6 py-4 text-dark-600">{currency.libor}</td>
                          <td className="px-6 py-4 font-medium text-dark-800">{currency.rfr}</td>
                          <td className="px-6 py-4 text-dark-600">{currency.administrator}</td>
                          <td className="px-6 py-4">
                            <span className="badge badge-success">{currency.transitionDate}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AnimatedCard>
            </ScrollSection>
          </ScrollSection>
        </section>

        {/* Negotiation Points Section */}
        <section id="negotiation" className="mb-20">
          <ScrollSection animation="fade-in-up">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient">{lmaKnowledge.negotiationPoints.title}</span>
            </h2>
            <p className="text-lg text-dark-600 mb-8">
              {lmaKnowledge.negotiationPoints.description}
            </p>

            {/* Interest and Costs */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-secondary-600" />
                {lmaKnowledge.negotiationPoints.interestAndCosts.title}
              </h3>

              <div className="space-y-4">
                {lmaKnowledge.negotiationPoints.interestAndCosts.points.map((point, idx) => (
                  <ScrollSection key={idx} animation="slide-left" delay={idx * 100}>
                    <AnimatedCard hoverEffect="lift" className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-bold">{point.clause}</h4>
                        <span className={`badge ${getPriorityColor(point.priority)}`}>
                          {point.priority}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-4 bg-dark-50 rounded-xl border border-dark-200">
                          <div className="text-sm font-semibold text-dark-500 mb-1">Standard Position</div>
                          <p className="text-dark-700">{point.standard}</p>
                        </div>
                        <div className="p-4 bg-accent-50 rounded-xl border border-accent-200">
                          <div className="text-sm font-semibold text-accent-700 mb-1">Borrower Position</div>
                          <p className="text-dark-700">{point.borrowerPosition}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent-600" />
                        <span className="text-sm font-medium text-accent-700">{point.savings}</span>
                      </div>
                    </AnimatedCard>
                  </ScrollSection>
                ))}
              </div>
            </div>

            {/* Tax and Increased Costs */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary-600" />
                {lmaKnowledge.negotiationPoints.taxAndIncreasedCosts.title}
              </h3>

              <div className="space-y-4">
                {lmaKnowledge.negotiationPoints.taxAndIncreasedCosts.points.map((point, idx) => (
                  <ScrollSection key={idx} animation="slide-right" delay={idx * 100}>
                    <AnimatedCard hoverEffect="lift" className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-bold">{point.clause}</h4>
                        <span className={`badge ${getPriorityColor(point.priority)}`}>
                          {point.priority}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold text-dark-500 mb-1">Standard</div>
                          <p className="text-dark-600">{point.standard}</p>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-accent-700 mb-1">Borrower Strategy</div>
                          <p className="text-dark-700">{point.borrowerPosition}</p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-accent-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-accent-600" />
                          <span className="text-sm font-medium text-accent-700">{point.savings}</span>
                        </div>
                      </div>
                    </AnimatedCard>
                  </ScrollSection>
                ))}
              </div>
            </div>

            {/* Representations Undertakings */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Scale className="w-6 h-6 text-accent-600" />
                {lmaKnowledge.negotiationPoints.representationsAndUndertakings.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lmaKnowledge.negotiationPoints.representationsAndUndertakings.points.map((point, idx) => (
                  <ScrollSection key={idx} animation="scale-in" delay={idx * 100}>
                    <AnimatedCard hoverEffect="lift" glowColor="accent" className="p-6 h-full">
                      <div className="flex items-start gap-3 mb-4">
                        <span className={`badge ${getPriorityColor(point.priority)}`}>
                          {point.priority}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold mb-3">{point.clause}</h4>
                      <p className="text-sm text-dark-500 mb-2">Standard: {point.standard}</p>
                      <div className="p-3 bg-accent-50 rounded-lg border border-accent-200">
                        <p className="text-sm text-dark-700">{point.borrowerPosition}</p>
                      </div>
                      <div className="mt-3 text-sm font-medium text-accent-700">
                        💡 {point.savings}
                      </div>
                    </AnimatedCard>
                  </ScrollSection>
                ))}
              </div>
            </div>

            {/* Financial Covenants */}
            <ScrollSection animation="fade-in-up">
              <AnimatedCard hoverEffect="lift" glowColor="secondary" className="p-8 bg-gradient-subtle">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-secondary-600" />
                  {lmaKnowledge.negotiationPoints.financialCovenants.title}
                </h3>

                <div className="space-y-4">
                  {lmaKnowledge.negotiationPoints.financialCovenants.points.map((point, idx) => (
                    <div key={idx} className="glass-card p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold">{point.clause}</h4>
                        <span className={`badge ${getPriorityColor(point.priority)}`}>
                          {point.priority}
                        </span>
                      </div>
                      <p className="text-dark-600 mb-3">{point.standard}</p>
                      <div className="p-4 bg-secondary-50 border-l-4 border-secondary-500 rounded">
                        <p className="font-medium text-dark-800">{point.borrowerPosition}</p>
                        <p className="text-sm text-secondary-700 mt-2">✓ {point.savings}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </ScrollSection>
          </ScrollSection>
        </section>

        {/* Hot Topics Section */}
        <section id="hot-topics" className="mb-20">
          <ScrollSection animation="fade-in-up">
            <h2 className="text-4xl font-bold mb-8">
              <span className="text-gradient">{lmaKnowledge.hotTopics.title}</span>
            </h2>

            {/* Sustainability-Linked Loans */}
            <div className="mb-12">
              <AnimatedCard hoverEffect="lift" glowColor="accent" className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-accent-100">
                    <Leaf className="w-8 h-8 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {lmaKnowledge.hotTopics.sustainabilityLinkedLoans.title}
                    </h3>
                    <p className="text-dark-600">
                      {lmaKnowledge.hotTopics.sustainabilityLinkedLoans.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {lmaKnowledge.hotTopics.sustainabilityLinkedLoans.keyPoints.map((point, idx) => (
                    <div key={idx} className="glass-card p-6">
                      <h4 className="text-lg font-bold mb-3">{point.topic}</h4>
                      <p className="text-dark-600 mb-3">{point.description}</p>

                      {point.examples && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {point.examples.map((example, eidx) => (
                            <span key={eidx} className="badge badge-success">
                              {example}
                            </span>
                          ))}
                        </div>
                      )}

                      {point.borrowerPosition && (
                        <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-200">
                          <p className="text-sm font-medium text-accent-700">
                            <span className="font-bold">Strategy:</span> {point.borrowerPosition}
                          </p>
                        </div>
                      )}

                      {point.impact && (
                        <p className="mt-3 text-sm text-dark-600">
                          <span className="font-semibold">Impact:</span> {point.impact}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            {/* UK Legal Developments */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Scale className="w-6 h-6 text-primary-600" />
                {lmaKnowledge.hotTopics.ukLegalDevelopments.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lmaKnowledge.hotTopics.ukLegalDevelopments.items.map((item, idx) => (
                  <ScrollSection key={idx} animation="scale-in" delay={idx * 100}>
                    <AnimatedCard hoverEffect="lift" glowColor="primary" className="p-6 h-full">
                      <h4 className="text-xl font-bold mb-3 text-primary-700">
                        {item.legislation}
                      </h4>
                      <p className="text-dark-600 mb-4">{item.description}</p>

                      <div className="space-y-3">
                        <div className="p-3 bg-secondary-50 rounded-lg">
                          <p className="text-sm font-semibold text-secondary-700 mb-1">Impact</p>
                          <p className="text-sm text-dark-700">{item.impact}</p>
                        </div>

                        <div className="p-3 bg-accent-50 rounded-lg">
                          <p className="text-sm font-semibold text-accent-700 mb-1">Borrower Action</p>
                          <p className="text-sm text-dark-700">{item.borrowerAction}</p>
                        </div>
                      </div>
                    </AnimatedCard>
                  </ScrollSection>
                ))}
              </div>
            </div>

            {/* Lehman Provisions */}
            <ScrollSection animation="fade-in-up">
              <AnimatedCard hoverEffect="lift" glowColor="secondary" className="p-8 bg-gradient-subtle">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-secondary-100">
                    <Shield className="w-8 h-8 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {lmaKnowledge.hotTopics.lehmanProvisions.title}
                    </h3>
                    <p className="text-dark-600">
                      {lmaKnowledge.hotTopics.lehmanProvisions.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold mb-3">Benefits:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lmaKnowledge.hotTopics.lehmanProvisions.benefits.map((benefit, idx) => (
                      <div key={idx} className="glass-card p-4 flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-dark-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-secondary-50 rounded-xl border-l-4 border-secondary-500">
                  <p className="font-bold text-secondary-800 mb-1">Recommendation:</p>
                  <p className="text-dark-700">{lmaKnowledge.hotTopics.lehmanProvisions.recommendation}</p>
                </div>
              </AnimatedCard>
            </ScrollSection>
          </ScrollSection>
        </section>

        {/* Glossary Section */}
        <section id="glossary" className="mb-20">
          <ScrollSection animation="fade-in-up">
            <h2 className="text-4xl font-bold mb-8">
              <span className="text-gradient">{lmaKnowledge.glossary.title}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lmaKnowledge.glossary.terms.map((item, idx) => (
                <ScrollSection key={idx} animation="scale-in" delay={idx * 50}>
                  <AnimatedCard hoverEffect="scale" className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary-100">
                        <FileText className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-primary-700 mb-1">{item.term}</h4>
                        <p className="text-sm text-dark-600 leading-relaxed">{item.definition}</p>
                      </div>
                    </div>
                  </AnimatedCard>
                </ScrollSection>
              ))}
            </div>
          </ScrollSection>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices" className="mb-20">
          <ScrollSection animation="fade-in-up">
            <h2 className="text-4xl font-bold mb-8">
              <span className="text-gradient">{lmaKnowledge.bestPractices.title}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lmaKnowledge.bestPractices.categories.map((category, idx) => (
                <ScrollSection key={idx} animation="fade-in-up" delay={idx * 150}>
                  <AnimatedCard hoverEffect="lift" glowColor="primary" className="p-6 h-full">
                    <h3 className="text-xl font-bold mb-4 text-primary-700">
                      {category.category}
                    </h3>
                    <ul className="space-y-3">
                      {category.practices.map((practice, pidx) => (
                        <li key={pidx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                          <span className="text-dark-700">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </AnimatedCard>
                </ScrollSection>
              ))}
            </div>
          </ScrollSection>
        </section>

        {/* CTA Section */}
        <ScrollSection animation="scale-in">
          <AnimatedCard glowColor="primary" className="p-12 text-center bg-gradient-subtle">
            <Sparkles className="w-16 h-16 text-primary-600 mx-auto mb-6 animate-pulse-slow" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Apply This Knowledge?
            </h2>
            <p className="text-xl text-dark-600 mb-8 max-w-2xl mx-auto">
              Use our AI-powered platform to analyze your loan documents and automatically extract key terms based on LMA standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton variant="duotone" size="lg" icon={ArrowRight}>
                Analyze Documents
              </GradientButton>
              <GradientButton variant="outline" size="lg">
                Schedule Consultation
              </GradientButton>
            </div>
          </AnimatedCard>
        </ScrollSection>
      </div>
    </div>
  );
}
