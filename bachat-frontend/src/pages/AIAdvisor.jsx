// ============================================
// AIAdvisor.jsx — AI Wealth Advisor (Flagship)
// ============================================
// Presentation-only. Consumes WalletContext data and produces
// personalized, rule-based financial insights. Every section is
// designed so a real AI API can replace the logic later without
// touching the UI components.
//
// Sections:
//   1. AI Hero Card            6. Wealth Forecast
//   2. Today's Insight         7. AI Challenges
//   3. Smart Recommendations   8. AI Daily Tip
//   4. Spending Analysis       9. Financial Health Score
//   5. Goal Prediction        10. Action Center
// ============================================

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  Zap,
  Trophy,
  Lightbulb,
  ArrowRight,
  Calendar,
  Flame,
  Shield,
  BarChart3,
  CreditCard,
  Wallet,
  LineChart,
  CheckCircle2,
  Clock,
  Star,
  Coffee,
  ShoppingBag,
  Car,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useWallet } from '../contexts/WalletContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AnimatedCounter from '../components/ui/AnimatedCounter.jsx';
import PageLoader from '../components/ui/Loader.jsx';

// ---- Animation ----
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

// ---- Category metadata ----
const CAT_META = {
  food: { label: 'Food & Drinks', icon: Coffee },
  shopping: { label: 'Shopping', icon: ShoppingBag },
  transport: { label: 'Transport', icon: Car },
  utility: { label: 'Utilities', icon: Zap },
  other: { label: 'Other', icon: BarChart3 },
};

// ---- Greeting helper ----
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ---- Daily tips pool ----
const DAILY_TIPS = [
  'The best investment is consistency.',
  'Small savings become big wealth.',
  'Round-ups remove the pain of investing.',
  'Your future self will thank you for every ₹1 saved today.',
  'Wealth is not about earning more — it\'s about keeping more.',
  'The best time to invest was yesterday. The second best time is now.',
  'Compound interest is the eighth wonder of the world.',
  'Automate your savings. Remove the human from the equation.',
  'Every great fortune started with a single decision to save.',
  'Consistency beats intensity in investing.',
];

// ============================================
// RULE-BASED ANALYSIS ENGINE
// (Designed to be replaced by AI API later)
// ============================================

function generateHeroSummary(wallet, goalName, savingsGoal, todayRoundup, monthlyTotal, totalTx) {
  const remaining = savingsGoal - wallet;
  if (totalTx === 0) return 'Start making payments to see your AI insights come alive. 🚀';
  if (todayRoundup > 0) return `You invested ₹${todayRoundup} today. Every rupee counts! 💪`;
  if (remaining > 0 && remaining < 500) return `You're only ₹${remaining} away from your ${goalName}! 🎯`;
  if (monthlyTotal > 0) return `₹${monthlyTotal} saved this month through automatic round-ups. 📈`;
  return `Your wealth wallet is at ₹${wallet}. Keep building! 🌱`;
}

function generateTodayInsight(wallet, avgRoundup, totalTx, categoryBreakdown, largestRoundup) {
  if (totalTx === 0) {
    return { text: 'Make your first payment to unlock personalized financial insights.', type: 'info' };
  }
  const cats = Object.entries(categoryBreakdown);
  const topCat = cats.length > 0 ? cats.sort((a, b) => b[1].spent - a[1].spent)[0] : null;

  // Pick the most relevant insight
  if (topCat && topCat[1].count >= 3) {
    const meta = CAT_META[topCat[0]] || CAT_META.other;
    return { text: `${meta.label} is your top spending category with ${topCat[1].count} payments totalling ₹${topCat[1].spent}.`, type: 'analysis' };
  }
  if (wallet >= 100 && wallet < 500) {
    return { text: `Three more payments could unlock Gold ETF investing. You're almost there!`, type: 'opportunity' };
  }
  if (avgRoundup > 0) {
    return { text: `Your average round-up is ₹${avgRoundup}. That's ₹${avgRoundup * 30}/month on autopilot!`, type: 'stat' };
  }
  if (largestRoundup > 0) {
    return { text: `Your biggest single round-up was ₹${largestRoundup}. Nice!`, type: 'achievement' };
  }
  return { text: 'Keep making payments to generate deeper insights.', type: 'info' };
}

function generateRecommendations(wallet, totalTx, avgRoundup, categoryBreakdown, goalProgress) {
  const recs = [];

  // Always recommend continuing
  if (totalTx > 0) {
    recs.push({
      title: 'Continue Round-up Investing',
      priority: 'High',
      impact: 'Compound growth',
      confidence: 92,
      explanation: 'Consistency is the #1 predictor of long-term wealth. Keep every payment auto-investing.',
      icon: TrendingUp,
    });
  }

  if (wallet >= 100) {
    recs.push({
      title: 'Begin Gold ETF',
      priority: 'Medium',
      impact: 'Portfolio diversification',
      confidence: 85,
      explanation: 'Your wallet has crossed ₹100. A small Gold allocation protects against inflation.',
      icon: Shield,
    });
  }

  if (avgRoundup > 0 && avgRoundup < 5) {
    recs.push({
      title: 'Increase Monthly Savings',
      priority: 'High',
      impact: '₹' + (avgRoundup * 2 * 30) + '/month potential',
      confidence: 78,
      explanation: 'Your average round-up is small. Consider making slightly larger purchases or additional top-ups.',
      icon: PiggyBank,
    });
  }

  if (wallet >= 500) {
    recs.push({
      title: 'Diversify Investments',
      priority: 'Medium',
      impact: 'Risk reduction',
      confidence: 88,
      explanation: 'With ₹500+ saved, spreading across ETFs, Gold, and Mutual Funds reduces overall risk.',
      icon: BarChart3,
    });
  }

  const cats = Object.keys(categoryBreakdown);
  if (cats.length === 1 && totalTx >= 3) {
    recs.push({
      title: 'Diversify Spending Categories',
      priority: 'Low',
      impact: 'Better analytics',
      confidence: 65,
      explanation: 'All payments are in one category. Varied spending gives the AI better data for personalized advice.',
      icon: Lightbulb,
    });
  }

  if (goalProgress < 50 && totalTx >= 5) {
    recs.push({
      title: 'Accelerate Goal Progress',
      priority: 'High',
      impact: 'Reach goal faster',
      confidence: 80,
      explanation: `You're at ${goalProgress}% of your savings goal. Consider increasing payment frequency.`,
      icon: Target,
    });
  }

  // Fallback
  if (recs.length === 0) {
    recs.push({
      title: 'Start Making Payments',
      priority: 'High',
      impact: 'Unlock all features',
      confidence: 100,
      explanation: 'Make your first payment to activate AI-powered recommendations.',
      icon: CreditCard,
    });
  }

  return recs;
}

function generateChallenges(wallet, totalTx, todayRoundup) {
  return [
    {
      title: 'Save ₹50 this week',
      icon: Flame,
      target: 50,
      current: Math.min(todayRoundup * 7, 50), // rough weekly estimate
      reward: 'Saver Badge',
    },
    {
      title: 'Make 10 payments',
      icon: Zap,
      target: 10,
      current: Math.min(totalTx, 10),
      reward: 'Consistency Badge',
    },
    {
      title: 'Reach ₹100 Wallet',
      icon: Trophy,
      target: 100,
      current: Math.min(wallet, 100),
      reward: 'Starter Badge',
    },
    {
      title: 'Invest in Gold ETF',
      icon: Star,
      target: 1,
      current: 0, // simulated, no real investments yet
      reward: 'First Investor Badge',
    },
  ];
}

function computeHealthScore(wallet, totalTx, goalProgress, avgRoundup, categoryBreakdown) {
  const catCount = Object.keys(categoryBreakdown).length;

  // Individual scores (0-100)
  const savings = Math.min(Math.round((wallet / 1000) * 100), 100);
  const investment = wallet >= 100 ? Math.min(Math.round((wallet / 500) * 100), 100) : 0;
  const consistency = Math.min(totalTx * 10, 100);
  const goal = goalProgress;
  const overall = Math.round((savings * 0.3 + investment * 0.2 + consistency * 0.3 + goal * 0.2));

  return { overall, savings, investment, consistency, goal };
}

// ============================================
// Mini Progress Ring
// ============================================
function MiniRing({ value, size = 56, strokeWidth = 5, color = 'text-mint' }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(value, 100) / 100) * c;

  return (
    <svg width={size} height={size} className="-rotate-90" aria-label={`${value}% score`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-border" />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeLinecap="round" className={color}
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function AIAdvisor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    investmentWallet,
    savingsGoal,
    goalName,
    goalProgress,
    todayRoundup,
    monthlyTotal,
    totalTransactions,
    transactions,
    averageRoundup,
    largestRoundup,
    categoryBreakdown,
    loadingWallet,
  } = useWallet();

  const displayName = user?.displayName?.split(' ')[0] || 'there';

  // ---- Memoized computations ----
  const heroSummary = useMemo(
    () => generateHeroSummary(investmentWallet, goalName, savingsGoal, todayRoundup, monthlyTotal, totalTransactions),
    [investmentWallet, goalName, savingsGoal, todayRoundup, monthlyTotal, totalTransactions]
  );
  const todayInsight = useMemo(
    () => generateTodayInsight(investmentWallet, averageRoundup, totalTransactions, categoryBreakdown, largestRoundup),
    [investmentWallet, averageRoundup, totalTransactions, categoryBreakdown, largestRoundup]
  );
  const recommendations = useMemo(
    () => generateRecommendations(investmentWallet, totalTransactions, averageRoundup, categoryBreakdown, goalProgress),
    [investmentWallet, totalTransactions, averageRoundup, categoryBreakdown, goalProgress]
  );
  const challenges = useMemo(
    () => generateChallenges(investmentWallet, totalTransactions, todayRoundup),
    [investmentWallet, totalTransactions, todayRoundup]
  );
  const health = useMemo(
    () => computeHealthScore(investmentWallet, totalTransactions, goalProgress, averageRoundup, categoryBreakdown),
    [investmentWallet, totalTransactions, goalProgress, averageRoundup, categoryBreakdown]
  );

  // Goal prediction
  const avgDailyRoundup = totalTransactions > 0
    ? transactions.reduce((s, t) => s + t.roundup, 0) / Math.max(totalTransactions, 1)
    : 0;
  const remaining = Math.max(savingsGoal - investmentWallet, 0);
  const daysToGoal = avgDailyRoundup > 0 ? Math.ceil(remaining / avgDailyRoundup) : null;
  const estDate = daysToGoal !== null
    ? new Date(Date.now() + daysToGoal * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;
  const weeklyNeeded = daysToGoal !== null ? Math.ceil(remaining / (daysToGoal / 7)) : null;

  // Wealth forecast
  const monthlyAvgRoundup = monthlyTotal > 0 ? monthlyTotal : averageRoundup * 20;
  const forecasts = [
    { label: '1 Month', value: Math.round(investmentWallet + monthlyAvgRoundup) },
    { label: '6 Months', value: Math.round((investmentWallet + monthlyAvgRoundup * 6) * 1.06) },
    { label: '1 Year', value: Math.round((investmentWallet + monthlyAvgRoundup * 12) * 1.12) },
    { label: '5 Years', value: Math.round((investmentWallet + monthlyAvgRoundup * 60) * Math.pow(1.12, 5)) },
  ];

  // Spending stats
  const catEntries = Object.entries(categoryBreakdown).sort((a, b) => b[1].spent - a[1].spent);
  const topCategory = catEntries.length > 0 ? catEntries[0] : null;
  const lowCategory = catEntries.length > 1 ? catEntries[catEntries.length - 1] : null;
  const avgPayment = totalTransactions > 0
    ? Math.round(transactions.reduce((s, t) => s + t.purchaseAmount, 0) / totalTransactions)
    : 0;

  // Daily tip (stable per page load)
  const dailyTip = useMemo(() => DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)], []);

  if (loadingWallet) return <PageLoader label="Analyzing your finances…" />;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader title="AI Wealth Advisor" subtitle="Personalized financial coaching powered by your data" badge="AI" />

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">

        {/* =============================================
            1. AI HERO CARD
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card className="relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-teal opacity-95" />
            {/* Pulse ring */}
            <motion.div
              className="absolute top-6 right-6 h-20 w-20 rounded-full border-2 border-mint/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-8 right-8 h-16 w-16 rounded-full border border-mint/20"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: 'easeInOut' }}
            />

            <div className="relative p-6 md:p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                  <Brain size={22} className="text-mint" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-mint">AI Wealth Advisor</p>
                  <h2 className="text-xl md:text-2xl font-bold">{getGreeting()}, {displayName} 👋</h2>
                </div>
              </div>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl">{heroSummary}</p>
            </div>
          </Card>
        </motion.div>

        {/* =============================================
            2. TODAY'S FINANCIAL INSIGHT
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-mint/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-mint/10 flex items-center justify-center">
                  <Lightbulb size={18} className="text-mint" />
                </div>
                <h2 className="text-lg font-bold text-navy">Today's Insight</h2>
                <Badge tone="mint">Live</Badge>
              </div>
              <p className="text-navy/80 text-sm leading-relaxed">{todayInsight.text}</p>
            </div>
          </Card>
        </motion.div>

        {/* =============================================
            3. SMART RECOMMENDATIONS
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-teal" />
                </div>
                <h2 className="text-lg font-bold text-navy">Smart Recommendations</h2>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec, i) => {
                  const Icon = rec.icon;
                  return (
                    <motion.div
                      key={rec.title}
                      variants={fadeUp}
                      className="bg-bg rounded-xl p-4 border border-border/60 flex items-start gap-4"
                    >
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-border/60 shrink-0 mt-0.5">
                        <Icon size={18} className="text-navy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-bold text-navy">{rec.title}</h3>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            rec.priority === 'High' ? 'bg-mint/10 text-mint' :
                            rec.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                            'bg-navy/5 text-navy/60'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed mb-2">{rec.explanation}</p>
                        <div className="flex items-center gap-4 text-[11px] text-text-muted">
                          <span>Impact: <span className="font-semibold text-navy">{rec.impact}</span></span>
                          <span>Confidence: <span className="font-semibold text-navy">{rec.confidence}%</span></span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Two-column: Spending Analysis + Goal Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* =============================================
              4. SPENDING ANALYSIS
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <BarChart3 size={18} className="text-navy" />
                </div>
                <h2 className="text-lg font-bold text-navy">Spending Analysis</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Top Category', value: topCategory ? (CAT_META[topCategory[0]]?.label || 'Other') : '—', accent: 'text-navy' },
                  { label: 'Least Category', value: lowCategory ? (CAT_META[lowCategory[0]]?.label || 'Other') : '—', accent: 'text-text-muted' },
                  { label: 'Avg. Payment', value: `₹${avgPayment}`, accent: 'text-navy' },
                  { label: 'Avg. Round-up', value: `₹${averageRoundup}`, accent: 'text-teal' },
                  { label: 'Total Payments', value: totalTransactions, accent: 'text-navy' },
                  { label: 'Total Saved', value: `₹${investmentWallet.toLocaleString('en-IN')}`, accent: 'text-mint' },
                ].map((s) => (
                  <div key={s.label} className="bg-bg rounded-xl p-3.5 border border-border/50">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">{s.label}</p>
                    <p className={`text-lg font-display font-extrabold ${s.accent} truncate`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* =============================================
              5. GOAL PREDICTION
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center">
                  <Target size={18} className="text-teal" />
                </div>
                <h2 className="text-lg font-bold text-navy">Goal Prediction</h2>
              </div>

              <div className="mb-5">
                <p className="text-sm text-text-muted mb-1">{goalName}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-extrabold text-navy">₹{investmentWallet.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-text-muted">/ ₹{savingsGoal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-bg rounded-full overflow-hidden border border-border/40 mb-5">
                <motion.div
                  className="h-full bg-gradient-to-r from-mint to-teal rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {daysToGoal !== null && remaining > 0 ? (
                <div className="space-y-3">
                  {[
                    { label: 'Days Remaining', value: `${daysToGoal} days`, icon: Calendar },
                    { label: 'Est. Completion', value: estDate, icon: Clock },
                    { label: 'Weekly Target', value: `₹${weeklyNeeded}/week`, icon: Target },
                  ].map((row) => {
                    const RowIcon = row.icon;
                    return (
                      <div key={row.label} className="flex items-center justify-between bg-bg rounded-xl px-4 py-2.5 border border-border/50">
                        <div className="flex items-center gap-2.5">
                          <RowIcon size={15} className="text-text-muted" />
                          <span className="text-xs text-text-muted font-medium">{row.label}</span>
                        </div>
                        <span className="text-sm font-bold text-navy">{row.value}</span>
                      </div>
                    );
                  })}
                </div>
              ) : remaining <= 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm font-bold text-mint">🎉 Goal Achieved!</p>
                  <p className="text-xs text-text-muted mt-1">Time to set a bigger target!</p>
                </div>
              ) : (
                <p className="text-center text-sm text-text-muted py-4">
                  Make your first payment to see goal predictions.
                </p>
              )}
            </Card>
          </motion.div>
        </div>

        {/* =============================================
            6. WEALTH FORECAST
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-mint/10 flex items-center justify-center">
                  <LineChart size={18} className="text-mint" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">Wealth Forecast</h2>
                  <p className="text-xs text-text-muted">Projected growth based on your savings pattern</p>
                </div>
              </div>

              {totalTransactions > 0 ? (
                <>
                  {/* Bar chart */}
                  <div className="flex items-end justify-between gap-3 mb-6 h-40">
                    {forecasts.map((f, i) => {
                      const maxVal = Math.max(...forecasts.map(ff => ff.value), 1);
                      const barH = Math.max((f.value / maxVal) * 100, 8);
                      return (
                        <div key={f.label} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-[11px] font-bold text-navy">₹{f.value.toLocaleString('en-IN')}</span>
                          <motion.div
                            className="w-full rounded-t-lg bg-gradient-to-t from-mint to-teal"
                            initial={{ height: 0 }}
                            animate={{ height: `${barH}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                          />
                          <span className="text-[10px] font-semibold text-text-muted text-center">{f.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-text-muted text-center">
                    Assumes current savings rate of ~₹{monthlyAvgRoundup}/month with 12% annual compounding.
                  </p>
                </>
              ) : (
                <p className="text-center text-sm text-text-muted py-8">
                  Make payments to generate your personalized wealth forecast.
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Two-column: Challenges + Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* =============================================
              7. AI CHALLENGES
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Flame size={18} className="text-amber-500" />
                </div>
                <h2 className="text-lg font-bold text-navy">AI Challenges</h2>
              </div>

              <div className="space-y-3">
                {challenges.map((ch) => {
                  const Icon = ch.icon;
                  const pct = ch.target > 0 ? Math.min(Math.round((ch.current / ch.target) * 100), 100) : 0;
                  const done = pct >= 100;

                  return (
                    <div key={ch.title} className="bg-bg rounded-xl p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} className={done ? 'text-mint' : 'text-amber-500'} />
                          <span className="text-sm font-semibold text-navy">{ch.title}</span>
                        </div>
                        <span className={`text-xs font-bold ${done ? 'text-mint' : 'text-navy'}`}>{pct}%</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 bg-white rounded-full overflow-hidden border border-border/40 mb-2">
                        <motion.div
                          className={`h-full rounded-full ${done ? 'bg-mint' : 'bg-amber-400'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy size={12} className="text-text-muted" />
                        <span className="text-[10px] text-text-muted font-medium">
                          Reward: {ch.reward}
                        </span>
                        {done && <CheckCircle2 size={12} className="text-mint ml-auto" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* =============================================
              9. FINANCIAL HEALTH SCORE
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <Shield size={18} className="text-navy" />
                </div>
                <h2 className="text-lg font-bold text-navy">Financial Health</h2>
              </div>

              {/* Overall Score */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <MiniRing value={health.overall} size={100} strokeWidth={8} color="text-mint" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-display font-extrabold text-navy">{health.overall}</span>
                    <span className="text-[9px] text-text-muted font-bold uppercase">Score</span>
                  </div>
                </div>
              </div>

              {/* Individual scores */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Savings', value: health.savings, color: 'text-mint' },
                  { label: 'Investment', value: health.investment, color: 'text-teal' },
                  { label: 'Consistency', value: health.consistency, color: 'text-blue-500' },
                  { label: 'Goal Progress', value: health.goal, color: 'text-navy' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3 bg-bg rounded-xl p-3 border border-border/50">
                    <MiniRing value={s.value} size={40} strokeWidth={4} color={s.color} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{s.label}</p>
                      <p className={`text-lg font-display font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* =============================================
            8. AI DAILY TIP
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card className="bg-gradient-to-r from-navy to-navy-light text-white overflow-hidden relative">
            <motion.div
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
              initial={{ x: '-200%' }}
              animate={{ x: '400%' }}
              transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 5 }}
            />
            <div className="relative p-6 md:p-8 flex items-center gap-5">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                <Lightbulb size={22} className="text-mint" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mint mb-1">Daily Tip</p>
                <p className="text-sm md:text-base text-white/90 italic leading-relaxed">"{dailyTip}"</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* =============================================
            10. ACTION CENTER
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-navy mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Make Payment', icon: CreditCard, route: '/payment', variant: 'accent' },
                  { label: 'View Wallet', icon: Wallet, route: '/wallet', variant: 'secondary' },
                  { label: 'Investments', icon: TrendingUp, route: '/investments', variant: 'secondary' },
                  { label: 'Settings', icon: Target, route: '/settings', variant: 'secondary' },
                ].map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={action.label}
                      variant={action.variant}
                      className="flex-col gap-2 py-4"
                      onClick={() => navigate(action.route)}
                      aria-label={`Navigate to ${action.label}`}
                    >
                      <ActionIcon size={20} />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}