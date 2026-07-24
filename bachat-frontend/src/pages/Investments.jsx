// ============================================
// Investments.jsx — Production-Quality FinTech Investment Experience
// ============================================
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  PiggyBank,
  Sparkles,
  BarChart3,
  ArrowRight,
  Shield,
  Gem,
  Landmark,
  Bitcoin,
  LineChart,
  Wallet,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  PieChart,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Layers,
  Info,
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AnimatedCounter from '../components/ui/AnimatedCounter.jsx';
import PageLoader from '../components/ui/Loader.jsx';
import investmentService, { PRODUCTS } from '../services/investment.service.js';

// Icon Map for dynamic lookup
const ICON_MAP = {
  Gem: Gem,
  TrendingUp: TrendingUp,
  BarChart3: BarChart3,
  LineChart: LineChart,
  Bitcoin: Bitcoin,
  Landmark: Landmark,
};

// Animation Variants
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ============================================
// Donut Chart Component (SVG)
// ============================================
function DonutChart({ data = [], size = 180 }) {
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  const validData = data.length > 0 ? data : [{ label: 'Cash', pct: 100, color: '#94a3b8' }];

  return (
    <svg width={size} height={size} className="-rotate-90" aria-label="Portfolio allocation chart">
      {validData.map((segment) => {
        const segmentLength = (segment.pct / 100) * circumference;
        const rotation = (cumulativeOffset / circumference) * 360;
        cumulativeOffset += segmentLength;

        return (
          <circle
            key={segment.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color || '#3b82f6'}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={0}
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}
          />
        );
      })}
    </svg>
  );
}

export default function Investments() {
  const {
    investmentWallet,
    totalRoundups,
    manualDeposits,
    portfolio,
    investments,
    loadingWallet,
    addMoney,
    invest,
  } = useWallet();

  // ---- State Modals & Selection ----
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('1000');
  const [isAddingMoney, setIsAddingMoney] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  const [feedback, setFeedback] = useState(null);

  // Auto clear feedback after 5s
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // AI Recommendation derived from wallet balance
  const recommendation = useMemo(() => {
    if (investmentWallet < 100) {
      return {
        product: PRODUCTS[0],
        reason: 'Build your wallet balance to ₹100 using round-ups or Add Money to unlock your first Gold ETF investment.',
        confidence: '95%',
        expectedReturn: '9.0%',
        risk: 'Low',
        alternatives: [PRODUCTS[1], PRODUCTS[5]],
      };
    }
    if (investmentWallet < 500) {
      return {
        product: PRODUCTS[0],
        reason: 'Gold ETF has low volatility and is the perfect starting asset for your available ₹' + investmentWallet.toLocaleString('en-IN') + ' balance.',
        confidence: '94%',
        expectedReturn: '9.0%',
        risk: 'Low',
        alternatives: [PRODUCTS[2]],
      };
    }
    if (investmentWallet < 1500) {
      return {
        product: PRODUCTS[1],
        reason: 'Your ₹' + investmentWallet.toLocaleString('en-IN') + ' balance is ideal for Nifty 50 ETF, granting instant exposure to India\'s top 50 companies.',
        confidence: '92%',
        expectedReturn: '13.5%',
        risk: 'Moderate',
        alternatives: [PRODUCTS[0], PRODUCTS[2]],
      };
    }
    return {
      product: PRODUCTS[3],
      reason: 'With ₹' + investmentWallet.toLocaleString('en-IN') + ' in your Smart Investment Wallet, diversifying into Bluechip Equity maximizes long-term compounding.',
      confidence: '89%',
      expectedReturn: '16.5%',
      risk: 'High Growth',
      alternatives: [PRODUCTS[1], PRODUCTS[4], PRODUCTS[5]],
    };
  }, [investmentWallet]);

  // Handle Simulated Add Money
  async function handleAddMoneySubmit(e) {
    e.preventDefault();
    const num = parseFloat(addAmount);
    if (!num || num <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid deposit amount.' });
      return;
    }

    setIsAddingMoney(true);
    const res = await addMoney(num);
    setIsAddingMoney(false);

    if (res.success) {
      setFeedback({ type: 'success', message: `₹${num.toLocaleString('en-IN')} added to your Smart Investment Wallet successfully!` });
      setIsAddMoneyOpen(false);
      setAddAmount('1000');
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to add money.' });
    }
  }

  // Handle Execute Investment
  async function handleExecuteInvestment(e) {
    e.preventDefault();
    if (!selectedProduct) return;

    const num = parseFloat(investAmount) || selectedProduct.minInvestment;
    if (num < selectedProduct.minInvestment) {
      setFeedback({ type: 'error', message: `Minimum investment for ${selectedProduct.name} is ₹${selectedProduct.minInvestment}.` });
      return;
    }

    if (num > investmentWallet) {
      setFeedback({ type: 'error', message: `Insufficient Smart Investment Wallet balance. Please add money first.` });
      return;
    }

    setIsInvesting(true);
    const res = await invest({ productId: selectedProduct.id, amount: num });
    setIsInvesting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: `₹${num.toLocaleString('en-IN')} invested in ${selectedProduct.name} successfully!` });
      setSelectedProduct(null);
      setInvestAmount('');
    } else {
      setFeedback({ type: 'error', message: res.error || 'Investment execution failed.' });
    }
  }

  if (loadingWallet) {
    return <PageLoader label="Loading your investments & portfolio…" />;
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <PageHeader
        title="Investment Hub"
        subtitle="Turn your round-up savings into a high-yielding portfolio"
      />

      {/* Global Feedback Alert */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-6 rounded-2xl p-4 flex items-center justify-between shadow-md ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-700'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-rose-600 shrink-0" size={20} />
            )}
            <span className="text-sm font-semibold">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </motion.div>
      )}

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">

        {/* ===================================================
            SECTION 1 — TWO DISTINCT BALANCES HERO
        =================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CARD 1: INVESTMENT WALLET (Available to Invest) */}
          <motion.div variants={fadeUp}>
            <Card className="relative overflow-hidden h-full border border-mint/30 bg-gradient-to-br from-white via-mint/5 to-white shadow-lg">
              <div className="p-6 md:p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-mint/20 flex items-center justify-center border border-mint/30 shadow-inner">
                        <Wallet size={24} className="text-emerald-700" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800">
                          Smart Investment Wallet
                        </span>
                        <p className="text-xs text-text-muted">Available to Invest</p>
                      </div>
                    </div>

                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => setIsAddMoneyOpen(true)}
                      className="shadow-md shadow-mint/20 py-2 px-3 text-xs"
                    >
                      <PlusCircle size={15} className="mr-1.5" />
                      Add Money
                    </Button>
                  </div>

                  <div className="mb-6">
                    <AnimatedCounter
                      value={investmentWallet}
                      prefix="₹"
                      className="text-4xl md:text-5xl font-display font-extrabold text-navy block"
                    />
                  </div>
                </div>

                {/* Sources Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
                  <div className="bg-white/80 rounded-xl p-3 border border-border/40">
                    <div className="flex items-center gap-1.5 mb-1">
                      <PiggyBank size={14} className="text-mint" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Round-up Savings</span>
                    </div>
                    <p className="text-base font-extrabold text-navy">₹{totalRoundups.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="bg-white/80 rounded-xl p-3 border border-border/40">
                    <div className="flex items-center gap-1.5 mb-1">
                      <PlusCircle size={14} className="text-teal" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Manual Deposits</span>
                    </div>
                    <p className="text-base font-extrabold text-navy">₹{manualDeposits.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CARD 2: INVESTMENT PORTFOLIO (Money Invested) */}
          <motion.div variants={fadeUp}>
            <Card className="relative overflow-hidden h-full border border-navy/10 bg-gradient-to-br from-navy via-navy-light to-navy text-white shadow-xl">
              <div className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <Briefcase size={24} className="text-mint" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-mint">
                          Investment Portfolio
                        </span>
                        <p className="text-xs text-white/70">Money Already Invested</p>
                      </div>
                    </div>

                    <Badge tone="mint" className="bg-mint/20 text-mint border-none">
                      Active Portfolio
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <AnimatedCounter
                      value={portfolio.currentValue || 0}
                      prefix="₹"
                      className="text-4xl md:text-5xl font-display font-extrabold text-white block"
                    />
                  </div>
                </div>

                {/* Portfolio Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Total Invested</span>
                    <p className="text-base font-bold text-white mt-0.5">₹{(portfolio.totalInvested || 0).toLocaleString('en-IN')}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Current Value</span>
                    <p className="text-base font-bold text-white mt-0.5">₹{(portfolio.currentValue || 0).toLocaleString('en-IN')}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Total Profit</span>
                    <p className="text-base font-extrabold text-mint mt-0.5 flex items-center">
                      <ArrowUpRight size={14} className="mr-0.5" />
                      +₹{(portfolio.profit || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===================================================
            SECTION 2 — AI RECOMMENDATION (Flagship)
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card className="relative overflow-hidden border border-mint/30 bg-gradient-to-r from-mint/5 via-white to-teal/5">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-mint to-teal flex items-center justify-center text-white shadow-md">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-navy flex items-center gap-2">
                      AI Wealth Recommendation
                    </h2>
                    <p className="text-xs text-text-muted">Personalized for your ₹{investmentWallet.toLocaleString('en-IN')} wallet</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge tone="mint">Confidence: {recommendation.confidence}</Badge>
                  <Badge tone="indigo">Risk: {recommendation.risk}</Badge>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-border/80 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint">Top Recommended Asset</span>
                    <h3 className="text-2xl font-bold text-navy">{recommendation.product.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-text-muted">Expected Annual Return</span>
                    <p className="text-xl font-extrabold text-emerald-600">{recommendation.expectedReturn}</p>
                  </div>
                </div>

                <p className="text-sm text-navy/80 leading-relaxed mb-6 bg-bg/50 p-3.5 rounded-xl border border-border/40">
                  💡 <span className="font-semibold text-navy">AI Rationale:</span> {recommendation.reason}
                </p>

                {/* CTA & Alternatives */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                  <Button
                    variant="accent"
                    onClick={() => {
                      setSelectedProduct(recommendation.product);
                      setInvestAmount(recommendation.product.minInvestment.toString());
                    }}
                  >
                    Invest in {recommendation.product.name}
                    <ArrowRight size={16} className="ml-1.5" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-medium">Alternative Options:</span>
                    {recommendation.alternatives.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => {
                          setSelectedProduct(alt);
                          setInvestAmount(alt.minInvestment.toString());
                        }}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-bg border border-border hover:bg-white text-navy transition-colors"
                      >
                        {alt.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ===================================================
            SECTION 3 — INVESTMENT PRODUCTS CATALOG
        =================================================== */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-navy">Investment Products</h2>
              <p className="text-xs text-text-muted">Select an asset class to invest your accumulated wallet funds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => {
              const IconComponent = ICON_MAP[product.icon] || TrendingUp;
              const isAffordable = investmentWallet >= product.minInvestment;

              return (
                <Card key={product.id} hoverable className="h-full flex flex-col justify-between border border-border/80">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: `${product.color}15`, color: product.color }}
                      >
                        <IconComponent size={22} />
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.riskColor} bg-gray-100`}>
                        {product.risk} Risk
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-navy mb-1">{product.name}</h3>
                    <p className="text-xs text-text-muted mb-4 leading-relaxed line-clamp-2">{product.description}</p>

                    <div className="space-y-2 py-3 border-t border-b border-border/50 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Expected Annual Return</span>
                        <span className="font-extrabold text-emerald-600">{product.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Minimum Investment</span>
                        <span className="font-bold text-navy">₹{product.minInvestment.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Recommended For</span>
                        <span className="font-medium text-navy truncate max-w-[140px]">{product.recommendedFor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Button
                      variant={isAffordable ? 'accent' : 'secondary'}
                      fullWidth
                      onClick={() => {
                        setSelectedProduct(product);
                        setInvestAmount(product.minInvestment.toString());
                      }}
                      className={isAffordable ? 'shadow-md shadow-mint/20' : ''}
                    >
                      {isAffordable ? 'Invest Now' : `Need ₹${product.minInvestment}`}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* ===================================================
            SECTION 4 — PORTFOLIO ANALYTICS & ALLOCATION
        =================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Allocation Donut Chart */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <Card padding="lg" className="h-full border border-border/80">
              <div className="flex items-center gap-2 mb-6">
                <PieChart size={20} className="text-navy" />
                <h3 className="text-base font-bold text-navy">Asset Allocation</h3>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <DonutChart data={portfolio.allocation || []} size={180} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Holdings</span>
                    <span className="text-lg font-extrabold text-navy">{portfolio.holdingsCount || 0} Assets</span>
                  </div>
                </div>

                <div className="w-full space-y-2.5">
                  {(portfolio.allocation || []).map((seg) => (
                    <div key={seg.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="font-semibold text-navy">{seg.label}</span>
                      </div>
                      <span className="font-extrabold text-navy">{seg.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Analytics Stat Cards Grid */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <Card padding="lg" className="h-full border border-border/80">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={20} className="text-navy" />
                <h3 className="text-base font-bold text-navy">Portfolio Performance Analytics</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-bg rounded-2xl p-4 border border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Total Invested</span>
                  <p className="text-xl font-extrabold text-navy">₹{(portfolio.totalInvested || 0).toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-bg rounded-2xl p-4 border border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Current Value</span>
                  <p className="text-xl font-extrabold text-navy">₹{(portfolio.currentValue || 0).toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-bg rounded-2xl p-4 border border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Overall Gain</span>
                  <p className="text-xl font-extrabold text-emerald-600 flex items-center">
                    <ArrowUpRight size={16} className="mr-0.5" />
                    +{portfolio.overallGainPercentage || 0}%
                  </p>
                </div>

                <div className="bg-bg rounded-2xl p-4 border border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Today's Gain</span>
                  <p className="text-xl font-extrabold text-emerald-600">+₹{(portfolio.todayGain || 0).toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-bg rounded-2xl p-4 border border-border/60 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Best Performing Asset</span>
                  <p className="text-base font-extrabold text-navy truncate">{portfolio.bestAsset || 'None'}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===================================================
            SECTION 5 — RECENT INVESTMENT ACTIVITY
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card padding="lg" className="border border-border/80">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-navy" />
                <h3 className="text-lg font-bold text-navy">Recent Investment Activity</h3>
              </div>
              <Badge tone="mint">{investments.length} Investments Active</Badge>
            </div>

            {investments.length > 0 ? (
              <div className="divide-y divide-border/60">
                {investments.map((inv) => (
                  <div key={inv.id} className="py-4 flex items-center justify-between flex-wrap gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-navy/5 flex items-center justify-center font-bold text-navy text-sm">
                        {inv.productName ? inv.productName.charAt(0) : 'I'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy">{inv.productName || inv.productId}</h4>
                        <p className="text-xs text-text-muted">
                          Purchased {new Date(inv.createdAt).toLocaleDateString('en-IN')} · <span className="text-emerald-600 font-semibold">Active</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-extrabold text-navy">₹{(inv.currentValue || inv.amount).toLocaleString('en-IN')}</p>
                      <p className="text-xs font-bold text-emerald-600 flex items-center justify-end">
                        <ArrowUpRight size={12} className="mr-0.5" />
                        +₹{(inv.profit || 0).toLocaleString('en-IN')} ({inv.profitPct || 0}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-bg/50 rounded-2xl border border-dashed border-border">
                <Briefcase size={36} className="text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-navy mb-1">No Active Investments Yet</h4>
                <p className="text-xs text-text-muted max-w-sm mx-auto mb-4">
                  Select a product above or use the AI Recommendation to start growing your wealth.
                </p>
              </div>
            )}
          </Card>
        </motion.div>

      </motion.div>

      {/* ===================================================
          MODAL 1: ADD MONEY (SIMULATED TOP-UP)
      =================================================== */}
      <AnimatePresence>
        {isAddMoneyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-border relative"
            >
              <button
                onClick={() => setIsAddMoneyOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-mint/20 flex items-center justify-center border border-mint/30">
                  <PlusCircle size={24} className="text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-navy">Add Money</h3>
                  <p className="text-xs text-text-muted">Simulated top-up to Smart Investment Wallet</p>
                </div>
              </div>

              <form onSubmit={handleAddMoneySubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Select Quick Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {['500', '1000', '2000', '5000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAddAmount(amt)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          addAmount === amt
                            ? 'bg-navy text-white border-navy shadow-md'
                            : 'bg-bg text-navy border-border hover:bg-white'
                        }`}
                      >
                        +₹{parseInt(amt).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Or Enter Custom Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-bold text-navy text-lg focus:outline-none focus:ring-2 focus:ring-mint"
                    autoFocus
                  />
                </div>

                <div className="bg-mint/10 p-3.5 rounded-xl border border-mint/20 text-xs text-navy">
                  <p className="font-semibold mb-0.5">Wallet Preview:</p>
                  <p className="text-text-muted">
                    Available balance will increase from <span className="font-bold text-navy">₹{investmentWallet.toLocaleString('en-IN')}</span> to{' '}
                    <span className="font-extrabold text-emerald-700">
                      ₹{(investmentWallet + (parseFloat(addAmount) || 0)).toLocaleString('en-IN')}
                    </span>
                  </p>
                </div>

                <Button variant="accent" type="submit" fullWidth disabled={isAddingMoney} className="py-3 text-base">
                  {isAddingMoney ? 'Adding Funds…' : 'Confirm Deposit'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================
          MODAL 2: EXECUTE INVESTMENT ORDER
      =================================================== */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-border relative"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${selectedProduct.color}15`, color: selectedProduct.color }}
                >
                  {(() => {
                    const IconComp = ICON_MAP[selectedProduct.icon] || TrendingUp;
                    return <IconComp size={24} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-navy">Invest in {selectedProduct.name}</h3>
                  <p className="text-xs text-text-muted">Expected Return: {selectedProduct.expectedReturn}</p>
                </div>
              </div>

              <form onSubmit={handleExecuteInvestment} className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                      Investment Amount (₹)
                    </label>
                    <span className="text-xs text-text-muted">
                      Available: <span className="font-bold text-navy">₹{investmentWallet.toLocaleString('en-IN')}</span>
                    </span>
                  </div>

                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    min={selectedProduct.minInvestment}
                    max={investmentWallet}
                    placeholder={`Min. ₹${selectedProduct.minInvestment}`}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-bold text-navy text-lg focus:outline-none focus:ring-2 focus:ring-mint"
                    autoFocus
                  />
                  <p className="text-[11px] text-text-muted mt-1.5">
                    Minimum investment required: ₹{selectedProduct.minInvestment.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-bg p-4 rounded-2xl border border-border/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Wallet Available</span>
                    <span className="font-semibold text-navy">₹{investmentWallet.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Amount Deducted</span>
                    <span className="font-bold text-rose-600">-₹{(parseFloat(investAmount) || selectedProduct.minInvestment).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/40">
                    <span className="font-semibold text-navy">Wallet Balance After</span>
                    <span className="font-extrabold text-navy">
                      ₹{Math.max(0, investmentWallet - (parseFloat(investAmount) || selectedProduct.minInvestment)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Button
                  variant="accent"
                  type="submit"
                  fullWidth
                  disabled={isInvesting || investmentWallet < selectedProduct.minInvestment}
                  className="py-3 text-base shadow-lg shadow-mint/20"
                >
                  {isInvesting ? 'Executing Order…' : `Confirm ₹${(parseFloat(investAmount) || selectedProduct.minInvestment).toLocaleString('en-IN')} Investment`}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
