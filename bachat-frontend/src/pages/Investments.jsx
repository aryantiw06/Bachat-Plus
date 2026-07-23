// ============================================
// Investments.jsx — Premium Investment Discovery Page
// ============================================
// Presentation-only. All wallet data comes from WalletContext.
// Investment products, recommendations, and portfolio data are
// structured so a real backend API can replace them later
// without changing the UI components.
// ============================================

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  PiggyBank,
  Target,
  Sparkles,
  BarChart3,
  ArrowRight,
  Shield,
  Gem,
  Landmark,
  Bitcoin,
  LineChart,
  BookOpen,
  Calculator,
  Clock,
  Zap,
  ChevronRight,
  Info,
  Wallet,
  Eye,
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AnimatedCounter from '../components/ui/AnimatedCounter.jsx';
import PageLoader from '../components/ui/Loader.jsx';

// ---- Animation Variants ----
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ============================================
// DATA — Structured for future API replacement
// ============================================

const INVESTMENT_PRODUCTS = [
  {
    id: 'nifty50',
    name: 'Nifty 50 ETF',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    description: 'Track India\'s top 50 companies with one investment.',
    risk: 'Moderate',
    riskColor: 'text-amber-600',
    expectedReturn: '12–15%',
    minInvestment: 500,
    recommendedFor: 'Long-term wealth building',
  },
  {
    id: 'gold',
    name: 'Gold ETF',
    icon: Gem,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    description: 'Digital gold that protects against inflation.',
    risk: 'Low',
    riskColor: 'text-green-600',
    expectedReturn: '8–10%',
    minInvestment: 100,
    recommendedFor: 'Safe-haven diversification',
  },
  {
    id: 'indexfund',
    name: 'Index Mutual Fund',
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    description: 'Professionally managed fund mirroring market indices.',
    risk: 'Moderate',
    riskColor: 'text-amber-600',
    expectedReturn: '10–14%',
    minInvestment: 500,
    recommendedFor: 'Passive investors',
  },
  {
    id: 'fd',
    name: 'Fixed Deposit',
    icon: Landmark,
    color: 'text-teal',
    bgColor: 'bg-teal/5',
    borderColor: 'border-teal/20',
    description: 'Guaranteed returns with zero market risk.',
    risk: 'Very Low',
    riskColor: 'text-green-600',
    expectedReturn: '6–7.5%',
    minInvestment: 1000,
    recommendedFor: 'Risk-averse savers',
  },
  {
    id: 'stocks',
    name: 'Stocks',
    icon: LineChart,
    color: 'text-navy',
    bgColor: 'bg-navy/5',
    borderColor: 'border-navy/10',
    description: 'Direct equity for maximum growth potential.',
    risk: 'High',
    riskColor: 'text-red-500',
    expectedReturn: '15–25%',
    minInvestment: 1000,
    recommendedFor: 'Experienced investors',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    icon: Bitcoin,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100',
    description: 'Experimental allocation for high-risk appetite.',
    risk: 'Very High',
    riskColor: 'text-red-600',
    expectedReturn: '20–100%+',
    minInvestment: 500,
    recommendedFor: 'High-risk explorers',
    badge: 'Experimental',
  },
];

const PORTFOLIO_ALLOCATION = [
  { label: 'ETF', pct: 40, color: '#3b82f6' },
  { label: 'Gold', pct: 25, color: '#f59e0b' },
  { label: 'Mutual Fund', pct: 20, color: '#8b5cf6' },
  { label: 'FD', pct: 10, color: '#14b8a6' },
  { label: 'Cash', pct: 5, color: '#94a3b8' },
];

const EDUCATION_CARDS = [
  {
    title: 'Why Round-up Investing Works',
    body: 'Small spare change adds up fast. ₹5–₹9 per payment compounds into real wealth over time — without changing your spending habits.',
    icon: PiggyBank,
  },
  {
    title: 'Power of Compounding',
    body: 'At 12% annual return, ₹100/month becomes ₹23,000+ in 10 years. The earlier you start, the harder your money works for you.',
    icon: TrendingUp,
  },
  {
    title: 'Risk vs Return',
    body: 'Higher potential returns come with higher risk. Diversifying across assets reduces your overall risk while maintaining growth.',
    icon: Shield,
  },
  {
    title: 'Dollar Cost Averaging',
    body: 'Investing small amounts regularly (like round-ups) means you buy more when prices are low and less when high — smoothing out volatility.',
    icon: BarChart3,
  },
];

// ---- AI Recommendation Engine ----
function getRecommendation(walletBalance) {
  if (walletBalance < 100) {
    return {
      title: 'Keep Saving',
      subtitle: 'Build your wallet to ₹100 to unlock your first investment.',
      product: null,
      risk: '—',
      expectedReturn: '—',
      why: 'A small buffer ensures you can invest meaningfully. Keep making payments and watch your wallet grow!',
      horizon: '—',
    };
  }
  if (walletBalance < 500) {
    return {
      title: 'Gold ETF',
      subtitle: 'A safe starting point for your first investment.',
      product: 'gold',
      risk: 'Low',
      expectedReturn: '8–10% annually',
      why: 'Gold is a stable store of value. With your current savings, a small Gold ETF allocation lets you start building wealth safely.',
      horizon: '1–3 years',
    };
  }
  if (walletBalance < 1500) {
    return {
      title: 'Nifty 50 ETF',
      subtitle: 'Ride India\'s growth with top 50 companies.',
      product: 'nifty50',
      risk: 'Moderate',
      expectedReturn: '12–15% annually',
      why: 'Your wallet is now large enough for a diversified equity ETF. The Nifty 50 gives you broad market exposure in a single investment.',
      horizon: '3–5 years',
    };
  }
  if (walletBalance < 5000) {
    return {
      title: 'Index Mutual Fund',
      subtitle: 'Professional management meets passive investing.',
      product: 'indexfund',
      risk: 'Moderate',
      expectedReturn: '10–14% annually',
      why: 'With ₹1,500+ saved, a professionally managed index fund gives you excellent diversification and compounding potential.',
      horizon: '3–7 years',
    };
  }
  return {
    title: 'Diversified Portfolio',
    subtitle: 'You\'ve earned the right to diversify across asset classes.',
    product: null,
    risk: 'Balanced',
    expectedReturn: '10–18% annually',
    why: 'Your savings are significant. Spreading across ETFs, Gold, Mutual Funds, and FDs gives you the best risk-adjusted returns.',
    horizon: '5–10 years',
  };
}

// ============================================
// Donut Chart Component (SVG)
// ============================================
function DonutChart({ data, size = 180 }) {
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <svg width={size} height={size} className="-rotate-90" aria-label="Portfolio allocation chart">
      {data.map((segment) => {
        const segmentLength = (segment.pct / 100) * circumference;
        const offset = circumference - segmentLength;
        const rotation = (cumulativeOffset / circumference) * 360;
        cumulativeOffset += segmentLength;

        return (
          <motion.circle
            key={segment.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        );
      })}
    </svg>
  );
}

// ============================================
// Main Page Component
// ============================================
export default function Investments() {
  const {
    investmentWallet,
    savingsGoal,
    goalName,
    goalProgress,
    totalTransactions,
    loadingWallet,
    investments,
    invest,
  } = useWallet();

  // ---- Investment Simulator State ----
  const [simAmount, setSimAmount] = useState('');
  const [investingProductId, setInvestingProductId] = useState(null);
  const [investmentFeedback, setInvestmentFeedback] = useState(null);
  const simValue = parseFloat(simAmount) || 0;
  const simCapped = Math.min(simValue, investmentWallet);
  const simRemaining = Math.max(investmentWallet - simCapped, 0);
  const simAnnualReturn = Math.round(simCapped * 0.12);
  const simFiveYear = Math.round(simCapped * Math.pow(1.12, 5));

  // ---- AI Recommendation ----
  const recommendation = useMemo(
    () => getRecommendation(investmentWallet),
    [investmentWallet]
  );

  async function handleInvest(product) {
    if (investmentWallet < product.minInvestment || investingProductId) return;

    setInvestmentFeedback(null);
    setInvestingProductId(product.id);
    const result = await invest({
      amount: product.minInvestment,
      investmentType: product.id,
      riskLevel: product.risk,
    });
    setInvestingProductId(null);
    setInvestmentFeedback(
      result.success
        ? { type: 'success', message: `₹${product.minInvestment} invested in ${product.name}.` }
        : { type: 'error', message: result.error || 'Investment could not be completed.' }
    );
  }

  if (loadingWallet) {
    return <PageLoader label="Loading investments…" />;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Investments"
        subtitle="Grow your round-up savings into real wealth"
      />

      {investmentFeedback && (
        <div
          role="status"
          className={`mb-5 rounded-xl px-4 py-3 text-sm font-semibold ${
            investmentFeedback.type === 'success'
              ? 'bg-success/10 text-success border border-success/20'
              : 'bg-danger/10 text-danger border border-danger/20'
          }`}
        >
          {investmentFeedback.message}
        </div>
      )}

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">

        {/* ===================================================
            SECTION 1 — HERO PORTFOLIO CARD
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-teal opacity-[0.03] pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Primary Balance */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-mint/10 flex items-center justify-center border border-mint/20">
                      <Wallet size={22} className="text-mint" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Investment Wallet</p>
                      <p className="text-xs text-text-muted">Available to Invest</p>
                    </div>
                  </div>

                  <AnimatedCounter
                    value={investmentWallet}
                    prefix="₹"
                    className="text-4xl md:text-5xl font-display font-extrabold text-navy block mb-6"
                  />

                  <Button
                    variant="accent"
                    className="shadow-lg shadow-mint/20"
                    onClick={() => {
                      const el = document.getElementById('invest-simulator');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label="Scroll to investment simulator"
                  >
                    Start Investing
                    <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>

                {/* Right: Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Saved', value: `₹${investmentWallet.toLocaleString('en-IN')}`, accent: 'text-mint' },
                    { label: 'Payments Made', value: totalTransactions, accent: 'text-navy' },
                    { label: 'Savings Goal', value: goalName, accent: 'text-teal', small: true },
                    { label: 'Goal Progress', value: `${goalProgress}%`, accent: 'text-navy' },
                  ].map((s) => (
                    <div key={s.label} className="bg-bg rounded-xl p-4 border border-border/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">{s.label}</p>
                      <p className={`${s.small ? 'text-base' : 'text-xl'} font-display font-extrabold ${s.accent} truncate`}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ===================================================
            SECTION 2 — AI INVESTMENT RECOMMENDATION
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-mint/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-mint/20 to-teal/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-mint" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">AI Recommendation</h2>
                  <p className="text-xs text-text-muted">Based on your ₹{investmentWallet.toLocaleString('en-IN')} wallet</p>
                </div>
              </div>

              <div className="bg-bg rounded-2xl p-5 md:p-6 border border-border/60">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-navy">{recommendation.title}</h3>
                    <p className="text-sm text-text-muted mt-0.5">{recommendation.subtitle}</p>
                  </div>
                  <Badge tone="mint">AI Pick</Badge>
                </div>

                <p className="text-sm text-navy/80 leading-relaxed mb-5">{recommendation.why}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Risk Level', value: recommendation.risk },
                    { label: 'Expected Return', value: recommendation.expectedReturn },
                    { label: 'Horizon', value: recommendation.horizon },
                    { label: 'Wallet Needed', value: recommendation.product ? `₹${INVESTMENT_PRODUCTS.find(p => p.id === recommendation.product)?.minInvestment || '—'}` : '—' },
                  ].map((m) => (
                    <div key={m.label} className="bg-white rounded-xl p-3 border border-border/40">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">{m.label}</p>
                      <p className="text-sm font-bold text-navy">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ===================================================
            SECTION 3 — INVESTMENT OPPORTUNITIES
        =================================================== */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-navy">Investment Opportunities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INVESTMENT_PRODUCTS.map((product) => {
              const Icon = product.icon;
              const canInvest = investmentWallet >= product.minInvestment;

              return (
                <motion.div key={product.id} variants={fadeUp}>
                  <Card hoverable className="h-full flex flex-col">
                    <div className="p-5 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-11 w-11 rounded-xl ${product.bgColor} flex items-center justify-center border ${product.borderColor}`}>
                          <Icon size={20} className={product.color} />
                        </div>
                        {product.badge && <Badge tone="outline">{product.badge}</Badge>}
                      </div>

                      {/* Info */}
                      <h3 className="text-base font-bold text-navy mb-1">{product.name}</h3>
                      <p className="text-xs text-text-muted mb-4 leading-relaxed flex-1">{product.description}</p>

                      {/* Metrics */}
                      <div className="space-y-2 mb-5">
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">Risk</span>
                          <span className={`font-semibold ${product.riskColor}`}>{product.risk}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">Expected Return</span>
                          <span className="font-semibold text-navy">{product.expectedReturn}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">Min. Investment</span>
                          <span className="font-semibold text-navy">₹{product.minInvestment}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">Recommended For</span>
                          <span className="font-semibold text-navy truncate ml-2">{product.recommendedFor}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Button variant="secondary" size="sm" className="flex-1">
                          <Eye size={14} className="mr-1" /> Preview
                        </Button>
                        <Button
                          variant={canInvest ? 'accent' : 'secondary'}
                          size="sm"
                          className="flex-1"
                          disabled={!canInvest || investingProductId !== null}
                          onClick={() => handleInvest(product)}
                          aria-label={canInvest ? `Invest in ${product.name}` : `Need ₹${product.minInvestment} to invest`}
                        >
                          {investingProductId === product.id ? 'Investing…' : canInvest ? 'Invest' : `Need ₹${product.minInvestment}`}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Two-column layout: Diversification + Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ===================================================
              SECTION 4 — PORTFOLIO DIVERSIFICATION
          =================================================== */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <BarChart3 size={18} className="text-navy" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">Recommended Allocation</h2>
                  <p className="text-xs text-text-muted">Ideal portfolio split for balanced growth</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                {/* Donut Chart */}
                <div className="relative mb-6">
                  <DonutChart data={PORTFOLIO_ALLOCATION} size={180} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Portfolio</span>
                    <span className="text-lg font-display font-extrabold text-navy">100%</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="w-full space-y-2.5">
                  {PORTFOLIO_ALLOCATION.map((seg) => (
                    <div key={seg.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: seg.color }}
                        />
                        <span className="text-sm text-navy font-medium">{seg.label}</span>
                      </div>
                      <span className="text-sm font-bold text-navy">{seg.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ===================================================
              SECTION 5 — INVESTMENT SIMULATOR
          =================================================== */}
          <motion.div variants={fadeUp} id="invest-simulator">
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center">
                  <Calculator size={18} className="text-teal" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">Investment Simulator</h2>
                  <p className="text-xs text-text-muted">See how your money can grow</p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Amount to Invest
                </label>
                <div className="flex items-baseline gap-2 border-b-2 border-border pb-2 focus-within:border-mint transition-colors">
                  <span className="text-2xl font-light text-text-muted">₹</span>
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    placeholder="0"
                    max={investmentWallet}
                    className="w-full text-3xl font-display font-bold text-navy bg-transparent border-none p-0 focus:ring-0 focus:outline-none placeholder:text-text-muted/30"
                    aria-label="Investment simulator amount"
                  />
                </div>
                <p className="text-[11px] text-text-muted mt-2">
                  Available: ₹{investmentWallet.toLocaleString('en-IN')}
                  {simValue > investmentWallet && (
                    <span className="text-danger ml-1">(capped to wallet balance)</span>
                  )}
                </p>
              </div>

              {/* Results */}
              {simCapped > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {[
                    { label: 'Remaining Wallet', value: `₹${simRemaining.toLocaleString('en-IN')}`, icon: Wallet },
                    { label: 'Est. Annual Return (12%)', value: `₹${simAnnualReturn.toLocaleString('en-IN')}`, icon: TrendingUp },
                    { label: 'Est. 5-Year Value', value: `₹${simFiveYear.toLocaleString('en-IN')}`, icon: Target },
                  ].map((row) => {
                    const RowIcon = row.icon;
                    return (
                      <div key={row.label} className="flex items-center justify-between bg-bg rounded-xl px-4 py-3 border border-border/50">
                        <div className="flex items-center gap-3">
                          <RowIcon size={16} className="text-text-muted" />
                          <span className="text-sm text-text-muted font-medium">{row.label}</span>
                        </div>
                        <span className="text-sm font-bold text-navy">{row.value}</span>
                      </div>
                    );
                  })}

                  <div className="flex items-start gap-2 pt-2">
                    <Info size={14} className="text-text-muted shrink-0 mt-0.5" />
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      This is a simplified projection assuming 12% annual compounding. Actual returns may vary based on market conditions.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-6 text-sm text-text-muted">
                  Enter an amount above to see a growth projection.
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* ===================================================
            SECTION 6 — FINANCIAL EDUCATION
        =================================================== */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={18} className="text-navy" />
            <h2 className="text-lg font-bold text-navy">Learn About Investing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EDUCATION_CARDS.map((card) => {
              const EduIcon = card.icon;
              return (
                <Card key={card.title} hoverable>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-mint/10 flex items-center justify-center border border-mint/20 shrink-0">
                        <EduIcon size={18} className="text-mint" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-navy mb-1.5">{card.title}</h3>
                        <p className="text-xs text-text-muted leading-relaxed">{card.body}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* ===================================================
            SECTION 7 — RECENT INVESTMENT ACTIVITY
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <Clock size={18} className="text-navy" />
                </div>
                <h2 className="text-lg font-bold text-navy">Recent Investment Activity</h2>
              </div>

              {investments.length > 0 ? (
                <div className="space-y-3">
                  {investments.map((investment) => {
                    const product = INVESTMENT_PRODUCTS.find((item) => item.id === investment.investmentType);
                    return (
                      <div key={investment.id} className="flex items-center justify-between rounded-xl border border-border bg-bg px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-navy">{product?.name || investment.investmentType}</p>
                          <p className="text-xs text-text-muted">{investment.riskLevel || '—'} risk · {new Date(investment.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <p className="text-sm font-extrabold text-mint">₹{investment.amount.toLocaleString('en-IN')}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-20 w-20 rounded-full bg-bg flex items-center justify-center mb-5 border border-border">
                  <Gem size={32} className="text-text-muted" />
                </div>
                <h3 className="text-base font-bold text-navy mb-1">No investments yet</h3>
                <p className="text-sm text-text-muted max-w-xs mb-6">
                  Your round-up savings are ready. Start investing to see your wealth grow here.
                </p>
                <Button
                  variant="accent"
                  onClick={() => {
                    const el = document.getElementById('invest-simulator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label="Scroll to investment simulator to begin"
                >
                  Try the Simulator
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
              )}
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
