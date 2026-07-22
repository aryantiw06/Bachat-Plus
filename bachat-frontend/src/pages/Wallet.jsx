// ============================================
// Wallet.jsx — Wealth Wallet Page
// ============================================
// A presentation-only page. All data and calculations come from
// WalletContext. The page consumes pre-computed values and focuses
// purely on rendering a premium financial overview.
//
// Sections:
//   1. Hero — Investment Wallet balance with badges
//   2. Savings Goal Tracker — progress ring + motivational copy
//   3. Savings Journey — premium stat cards
//   4. Spending Analytics — category breakdown bars
//   5. Transaction History — scrollable list
// ============================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PiggyBank,
  Target,
  TrendingUp,
  Trophy,
  ArrowRight,
  Coffee,
  ShoppingBag,
  Zap,
  Car,
  CloudOff,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import AnimatedCounter from '../components/ui/AnimatedCounter.jsx';
import PageLoader from '../components/ui/Loader.jsx';

// ---- Constants ----
const CATEGORY_META = {
  food:      { label: 'Food & Drinks', icon: Coffee, color: 'bg-orange-500' },
  shopping:  { label: 'Shopping',      icon: ShoppingBag, color: 'bg-blue-500' },
  transport: { label: 'Transport',     icon: Car, color: 'bg-purple-500' },
  utility:   { label: 'Utilities',     icon: Zap, color: 'bg-amber-500' },
  other:     { label: 'Other',         icon: TrendingUp, color: 'bg-gray-500' },
};

// Stagger animation for lists
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ---- Helper: Relative time display ----
function timeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ============================================
// Sync Status Indicator
// ============================================
function SyncIndicator({ status }) {
  if (!status) return null;
  const config = {
    Saving: { icon: Loader2, text: 'Saving…', cls: 'text-navy/60 animate-spin' },
    Synced: { icon: CheckCircle2, text: 'Synced', cls: 'text-success' },
    Failed: { icon: CloudOff, text: 'Sync failed', cls: 'text-danger' },
  };
  const c = config[status];
  if (!c) return null;
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <Icon size={14} className={c.cls} />
      <span className={c.cls.replace('animate-spin', '')}>{c.text}</span>
    </span>
  );
}

// ============================================
// Progress Ring (SVG)
// ============================================
function ProgressRing({ progress, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90" aria-label={`${progress}% progress`}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border"
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="text-mint"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ============================================
// Motivational copy based on goal progress
// ============================================
function getMotivation(progress) {
  if (progress === 0) return "Let's start your savings journey! 🚀";
  if (progress < 25) return "Great start! Keep the momentum going. 💪";
  if (progress < 50) return "You're building real wealth. Stay consistent! 📈";
  if (progress < 75) return "More than halfway there — impressive! 🔥";
  if (progress < 100) return "Almost at your goal. The finish line is near! 🏁";
  return "Goal achieved! Time to set a bigger one! 🎉";
}

// ============================================
// Main Page Component
// ============================================
export default function Wallet() {
  const navigate = useNavigate();
  const {
    investmentWallet,
    todayRoundup,
    monthlyTotal,
    savingsGoal,
    goalName,
    goalProgress,
    totalTransactions,
    transactions,
    averageRoundup,
    largestRoundup,
    categoryBreakdown,
    loadingWallet,
    syncStatus,
  } = useWallet();

  if (loadingWallet) {
    return <PageLoader label="Loading your wallet…" />;
  }

  // The maximum spent in any single category (for scaling bars)
  const maxCategorySpent = Math.max(
    ...Object.values(categoryBreakdown).map((c) => c.spent),
    1 // prevent division by zero
  );

  const hasTransactions = totalTransactions > 0;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Wealth Wallet"
        subtitle="Every round-up you've saved, in one place"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* ===================================================
            SECTION 1 — HERO: Investment Wallet Balance
        =================================================== */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-teal opacity-[0.03] pointer-events-none" />

            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left: Balance */}
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-mint/10 flex items-center justify-center border border-mint/20 shrink-0">
                  <PiggyBank size={28} className="text-mint" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">
                    Investment Wallet
                  </p>
                  <AnimatedCounter
                    value={investmentWallet}
                    prefix="₹"
                    className="text-4xl md:text-5xl font-display font-extrabold text-navy"
                  />
                </div>
              </div>

              {/* Right: Badges + Sync */}
              <div className="flex flex-wrap items-center gap-3">
                {todayRoundup > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mint/10 text-mint rounded-full text-xs font-bold border border-mint/20">
                    <TrendingUp size={13} /> +₹{todayRoundup} Today
                  </span>
                )}
                {monthlyTotal > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy/5 text-navy rounded-full text-xs font-bold border border-navy/10">
                    ₹{monthlyTotal} This Month
                  </span>
                )}
                <SyncIndicator status={syncStatus} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Two-column grid for Goal + Journey on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ===================================================
              SECTION 2 — SAVINGS GOAL TRACKER
          =================================================== */}
          <motion.div variants={itemVariants}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center">
                  <Target size={18} className="text-teal" />
                </div>
                <h2 className="text-lg font-bold text-navy">Savings Goal</h2>
              </div>

              <div className="flex flex-col items-center text-center">
                {/* Progress Ring */}
                <div className="relative mb-5">
                  <ProgressRing progress={goalProgress} size={140} strokeWidth={10} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-display font-extrabold text-navy">{goalProgress}%</span>
                    <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">Complete</span>
                  </div>
                </div>

                {/* Goal name & fraction */}
                <p className="text-sm font-bold text-navy mb-1">{goalName}</p>
                <p className="text-text-muted text-sm mb-4">
                  ₹{investmentWallet.toLocaleString('en-IN')} / ₹{savingsGoal.toLocaleString('en-IN')}
                </p>

                {/* Motivational copy */}
                <p className="text-sm text-text-muted italic">
                  {getMotivation(goalProgress)}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* ===================================================
              SECTION 3 — SAVINGS JOURNEY (Stat Cards)
          =================================================== */}
          <motion.div variants={itemVariants}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-mint/10 flex items-center justify-center">
                  <Trophy size={18} className="text-mint" />
                </div>
                <h2 className="text-lg font-bold text-navy">Savings Journey</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Saved', value: `₹${investmentWallet.toLocaleString('en-IN')}`, accent: 'text-mint' },
                  { label: 'Total Payments', value: totalTransactions, accent: 'text-navy' },
                  { label: 'Avg. Round-up', value: `₹${averageRoundup}`, accent: 'text-teal' },
                  { label: 'Biggest Round-up', value: `₹${largestRoundup}`, accent: 'text-navy' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-bg rounded-xl p-4 border border-border/60"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-display font-extrabold ${stat.accent}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===================================================
            SECTION 4 — SPENDING ANALYTICS (Category Breakdown)
        =================================================== */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <TrendingUp size={18} className="text-navy" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">Spending Analytics</h2>
                  <p className="text-xs text-text-muted">Category breakdown from recent payments</p>
                </div>
              </div>

              {!hasTransactions ? (
                <p className="text-center text-text-muted text-sm py-8">
                  No data yet. Make your first payment to see analytics.
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(categoryBreakdown)
                    .sort(([, a], [, b]) => b.spent - a.spent)
                    .map(([catId, data]) => {
                      const meta = CATEGORY_META[catId] || CATEGORY_META.other;
                      const Icon = meta.icon;
                      const barWidth = Math.max((data.spent / maxCategorySpent) * 100, 4);

                      return (
                        <div key={catId} className="flex items-center gap-4">
                          <div className="h-9 w-9 rounded-lg bg-bg flex items-center justify-center border border-border/60 shrink-0">
                            <Icon size={16} className="text-text-muted" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-semibold text-navy truncate">{meta.label}</span>
                              <span className="text-sm font-bold text-navy ml-2 shrink-0">
                                ₹{data.spent.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="h-2 bg-bg rounded-full overflow-hidden border border-border/40">
                              <motion.div
                                className={`h-full rounded-full ${meta.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${barWidth}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                              />
                            </div>
                            <p className="text-[10px] text-text-muted mt-1">
                              {data.count} payment{data.count !== 1 ? 's' : ''} · ₹{data.roundup} invested
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* ===================================================
            SECTION 5 — TRANSACTION HISTORY (Scrollable)
        =================================================== */}
        <motion.div variants={itemVariants}>
          <Card padding="none">
            <div className="p-6 md:p-8 pb-0 md:pb-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-navy">Transaction History</h2>
                <span className="text-xs font-semibold text-text-muted bg-bg px-2.5 py-1 rounded-full border border-border/60">
                  {totalTransactions} total
                </span>
              </div>
            </div>

            {!hasTransactions ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="h-16 w-16 rounded-full bg-bg flex items-center justify-center mb-4 border border-border">
                  <PiggyBank size={28} className="text-text-muted" />
                </div>
                <p className="text-navy font-semibold mb-1">No transactions yet</p>
                <p className="text-text-muted text-sm mb-5">
                  Make your first payment to start investing spare change.
                </p>
                <Button
                  variant="accent"
                  onClick={() => navigate('/payment')}
                  aria-label="Navigate to Payment page"
                >
                  Make a Payment
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto px-6 md:px-8 pb-6 md:pb-8">
                <div className="divide-y divide-border/60">
                  {transactions.map((tx) => {
                    const meta = CATEGORY_META[tx.category] || CATEGORY_META.other;
                    const Icon = meta.icon;

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className={`h-10 w-10 rounded-xl ${meta.color}/10 flex items-center justify-center shrink-0 border border-border/40`}>
                          <Icon size={18} className="text-text-muted" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy truncate">{tx.merchantName}</p>
                          <p className="text-[11px] text-text-muted">
                            {timeAgo(tx.timestamp)} · {meta.label}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-navy">₹{tx.roundedUp}</p>
                          <p className="text-[11px] font-semibold text-mint">+₹{tx.roundup} invested</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}