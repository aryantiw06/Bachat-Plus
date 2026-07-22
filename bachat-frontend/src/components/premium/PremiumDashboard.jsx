// ============================================
// PremiumDashboard.jsx — Unlocked Pro Experience
// ============================================

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Brain,
  Shield,
  BarChart3,
  Target,
  Bell,
  TrendingUp,
  Sparkles,
  Zap,
  Calendar,
  Users,
  Star,
  CheckCircle2,
  PieChart,
  ArrowRight,
  Headphones,
  LockOpen,
} from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext.jsx';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import AnimatedCounter from '../ui/AnimatedCounter.jsx';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

// SVG Radial Score Ring
function RadialScoreRing({ score, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90" aria-label={`Portfolio score ${score}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="text-amber-500"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function PremiumDashboard({ plan = 'yearly', activatedAt }) {
  const {
    investmentWallet,
    savingsGoal,
    goalName,
    goalProgress,
    totalTransactions,
    averageRoundup,
    monthlyTotal,
    todayRoundup,
    categoryBreakdown,
  } = useWallet();

  // Computations
  const portfolioScore = useMemo(() => {
    const catCount = Object.keys(categoryBreakdown).length;
    const catScore = Math.min(catCount * 20, 40);
    const txScore = Math.min(totalTransactions * 5, 30);
    const walletScore = Math.min(Math.round((investmentWallet / 1000) * 30), 30);
    return Math.min(catScore + txScore + walletScore, 98) || 68;
  }, [categoryBreakdown, totalTransactions, investmentWallet]);

  // 10-Year Projections (12% compounding)
  const monthlySavingsRate = monthlyTotal > 0 ? monthlyTotal : Math.max(averageRoundup * 20, 150);
  const tenYearProjections = useMemo(() => {
    const rate = 0.12;
    return [1, 2, 3, 5, 10].map((yrs) => {
      const futureVal = Math.round(
        investmentWallet * Math.pow(1 + rate, yrs) +
          monthlySavingsRate * 12 * ((Math.pow(1 + rate, yrs) - 1) / rate)
      );
      return { years: yrs, value: futureVal };
    });
  }, [investmentWallet, monthlySavingsRate]);

  // Multi-Goals mock
  const goalsList = [
    { name: goalName || 'Emergency Fund', target: savingsGoal || 5000, current: investmentWallet, color: 'bg-mint' },
    { name: 'Vacation Trip', target: 15000, current: Math.round(investmentWallet * 0.4), color: 'bg-blue-500' },
    { name: 'New Laptop', target: 45000, current: Math.round(investmentWallet * 0.2), color: 'bg-purple-500' },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">

      {/* ===================================================
          1. WELCOME HERO (UNLOCKED)
      =================================================== */}
      <motion.div variants={fadeUp}>
        <Card className="relative overflow-hidden border-2 border-amber-400/40">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-teal/10 pointer-events-none" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 border border-amber-300 shrink-0"
              >
                <Crown size={32} />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone="mint" className="bg-amber-500/10 text-amber-600 border border-amber-200">
                    <LockOpen size={12} className="mr-1" /> Unlocked Pro
                  </Badge>
                  <span className="text-xs text-text-muted">
                    {plan === 'yearly' ? 'Yearly Pass' : 'Monthly Pro'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-navy">
                  👑 Welcome to Bachat+ Premium
                </h1>
                <p className="text-xs text-text-muted mt-1">
                  Your AI Wealth Manager is active and continuously optimizing your portfolio.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Status</span>
                <span className="text-xs font-bold text-mint flex items-center gap-1">
                  <CheckCircle2 size={14} /> Active VIP
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Grid Row 1: AI Coach Pro + Portfolio Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===================================================
            2. AI WEALTH COACH PRO
        =================================================== */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card padding="lg" className="h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Brain size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy">AI Wealth Coach Pro</h2>
                <p className="text-xs text-text-muted">Real-time portfolio intelligence</p>
              </div>
              <Badge tone="mint" className="ml-auto bg-amber-500/10 text-amber-600 border border-amber-200">
                Live AI
              </Badge>
            </div>

            <div className="bg-bg rounded-2xl p-5 border border-border/70 mb-4">
              <div className="flex items-start gap-3">
                <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-navy mb-1">Today's Optimization Strategy</h3>
                  <p className="text-xs text-navy/80 leading-relaxed">
                    Based on your recent ₹{investmentWallet} balance, allocating 40% to Nifty 50 ETF and 25% to Gold ETF improves risk-adjusted returns by 14% over standard savings.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-surface rounded-xl p-3 border border-border/60">
                <span className="text-text-muted block text-[10px] uppercase font-bold">Monthly Target</span>
                <span className="font-bold text-navy text-sm">₹{monthlySavingsRate * 2}</span>
              </div>
              <div className="bg-surface rounded-xl p-3 border border-border/60">
                <span className="text-text-muted block text-[10px] uppercase font-bold">Tax Savings Est.</span>
                <span className="font-bold text-mint text-sm">₹4,200</span>
              </div>
              <div className="bg-surface rounded-xl p-3 border border-border/60 col-span-2 sm:col-span-1">
                <span className="text-text-muted block text-[10px] uppercase font-bold">Rebalance Status</span>
                <span className="font-bold text-amber-600 text-sm">Optimal</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ===================================================
            3. ADVANCED PORTFOLIO SCORE
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card padding="lg" className="h-full flex flex-col items-center justify-between text-center">
            <div className="w-full text-left mb-2">
              <h2 className="text-lg font-bold text-navy">Portfolio Score</h2>
              <p className="text-xs text-text-muted">Pro health index</p>
            </div>

            <div className="relative my-4">
              <RadialScoreRing score={portfolioScore} size={130} strokeWidth={10} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-extrabold text-navy">{portfolioScore}</span>
                <span className="text-[10px] text-text-muted font-bold uppercase">out of 100</span>
              </div>
            </div>

            <p className="text-xs text-navy/80 font-medium">
              {portfolioScore >= 80 ? '🌟 Excellent Diversification' : '👍 Healthy Growth Pattern'}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Grid Row 2: 10-Year Wealth Projection + Tax Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ===================================================
            4. EXCLUSIVE 10-YEAR WEALTH PREDICTION
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                <TrendingUp size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy">10-Year Wealth Engine</h2>
                <p className="text-xs text-text-muted">Compounded projection @ 12% annual return</p>
              </div>
            </div>

            <div className="space-y-3">
              {tenYearProjections.map((proj) => {
                const maxVal = tenYearProjections[tenYearProjections.length - 1].value || 1;
                const pct = Math.max((proj.value / maxVal) * 100, 8);

                return (
                  <div key={proj.years} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-navy">Year {proj.years}</span>
                      <span className="font-display font-extrabold text-navy">
                        ₹{proj.value.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="h-2.5 bg-bg rounded-full overflow-hidden border border-border/50">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-teal rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* ===================================================
            5. TAX SAVING SUGGESTIONS
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
                <Shield size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy">Tax Saving Assistant</h2>
                <p className="text-xs text-text-muted">Section 80C & 8D recommendations</p>
              </div>
              <Badge tone="mint" className="ml-auto bg-emerald-50 text-emerald-600 border border-emerald-200">
                Sec 80C
              </Badge>
            </div>

            <div className="space-y-3">
              {[
                { title: 'ELSS Tax Saver Fund', save: '₹4,680', desc: 'Invest ₹15,000 to save direct income tax.' },
                { title: 'Public Provident Fund (PPF)', save: '₹15,600', desc: 'Max out ₹50,000 annual deposit limit.' },
                { title: 'Health Insurance Premium', save: '₹7,800', desc: 'Claim tax benefit under Sec 80D.' },
              ].map((tax) => (
                <div key={tax.title} className="bg-bg rounded-xl p-3.5 border border-border/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-navy">{tax.title}</h3>
                    <p className="text-[11px] text-text-muted mt-0.5">{tax.desc}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-xs font-bold text-emerald-600 block">Save {tax.save}</span>
                    <span className="text-[9px] text-text-muted">Deduction</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Grid Row 3: Portfolio Optimization + Unlimited Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ===================================================
            6. PORTFOLIO OPTIMIZATION
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <PieChart size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy">Portfolio Optimizer</h2>
                <p className="text-xs text-text-muted">Recommended vs Current Asset Split</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Nifty 50 ETF', pct: 40, color: 'bg-blue-500' },
                { label: 'Gold ETF', pct: 25, color: 'bg-amber-500' },
                { label: 'Index Mutual Fund', pct: 20, color: 'bg-purple-500' },
                { label: 'Fixed Deposit', pct: 10, color: 'bg-teal' },
                { label: 'Liquid Cash', pct: 5, color: 'bg-gray-400' },
              ].map((alloc) => (
                <div key={alloc.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-navy">{alloc.label}</span>
                    <span className="font-bold text-navy">{alloc.pct}% Target</span>
                  </div>
                  <div className="h-2 bg-bg rounded-full overflow-hidden border border-border/40">
                    <motion.div
                      className={`h-full ${alloc.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${alloc.pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ===================================================
            7. UNLIMITED GOALS TRACKER
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Target size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy">Unlimited Goals</h2>
                <p className="text-xs text-text-muted">Multi-goal tracking unlocked</p>
              </div>
              <Badge tone="mint" className="ml-auto">Unlimited</Badge>
            </div>

            <div className="space-y-4">
              {goalsList.map((g) => {
                const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
                return (
                  <div key={g.name} className="bg-bg rounded-xl p-3.5 border border-border/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-navy">{g.name}</span>
                      <span className="text-xs font-bold text-navy">
                        ₹{g.current.toLocaleString('en-IN')} / ₹{g.target.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/40">
                      <motion.div
                        className={`h-full ${g.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Grid Row 4: Smart Notifications + Priority Support */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===================================================
            8. SMART NOTIFICATIONS
        =================================================== */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Bell size={18} />
              </div>
              <h2 className="text-lg font-bold text-navy">Smart Pro Alerts</h2>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Gold ETF price dropped 1.8%', time: '2h ago', tag: 'Market Dip' },
                { title: 'You can invest ₹230 this week', time: '5h ago', tag: 'AI Advice' },
                { title: 'Monthly savings milestone hit! 🎉', time: '1d ago', tag: 'Milestone' },
                { title: 'New Tax Deduction opportunity found', time: '2d ago', tag: 'Tax Pro' },
              ].map((notif) => (
                <div key={notif.title} className="flex items-center justify-between bg-bg rounded-xl p-3 border border-border/50 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="font-semibold text-navy">{notif.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-text-muted text-[10px]">{notif.time}</span>
                    <Badge tone="outline" className="text-[9px]">{notif.tag}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ===================================================
            9. PRIORITY SUPPORT
        =================================================== */}
        <motion.div variants={fadeUp}>
          <Card padding="lg" className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Headphones size={18} />
                </div>
                <h2 className="text-lg font-bold text-navy">VIP Support</h2>
              </div>
              <p className="text-xs text-text-muted leading-relaxed mb-4">
                As a Bachat+ Pro member, you have a dedicated 24/7 financial advisor channel.
              </p>
            </div>

            <Button
              variant="accent"
              fullWidth
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white"
            >
              Contact VIP Support
            </Button>
          </Card>
        </motion.div>
      </div>

    </motion.div>
  );
}
