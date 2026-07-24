// ============================================
// Wallet.jsx — Smart Investment Wallet Page
// ============================================
// Dedicated financial dashboard consuming WalletContext.
// Terminology: Standardized to "Smart Investment Wallet".
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
  ShieldCheck,
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import AnimatedCounter from '../components/ui/AnimatedCounter.jsx';
import PageLoader from '../components/ui/Loader.jsx';

const CATEGORY_META = {
  food:      { label: 'Food & Drinks', icon: Coffee, color: 'bg-orange-500' },
  shopping:  { label: 'Shopping',      icon: ShoppingBag, color: 'bg-blue-500' },
  transport: { label: 'Transport',     icon: Car, color: 'bg-purple-500' },
  utility:   { label: 'Utilities',     icon: Zap, color: 'bg-amber-500' },
  other:     { label: 'Other',         icon: TrendingUp, color: 'bg-gray-500' },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function timeAgo(isoString) {
  if (!isoString) return '';
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

function SyncIndicator({ status }) {
  if (!status) return null;
  const config = {
    Saving: { icon: Loader2, text: 'Saving…', cls: 'text-navy/60 animate-spin' },
    Synced: { icon: CheckCircle2, text: 'Synced', cls: 'text-emerald-600' },
    Failed: { icon: CloudOff, text: 'Sync failed', cls: 'text-rose-600' },
  };
  const c = config[status];
  if (!c) return null;
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
      <Icon size={14} className={c.cls} />
      <span className={c.cls.replace('animate-spin', '')}>{c.text}</span>
    </span>
  );
}

function ProgressRing({ progress, size = 130, strokeWidth = 9 }) {
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

function getMotivation(progress) {
  if (progress === 0) return "Let's start your auto-investing journey! 🚀";
  if (progress < 25) return "Great start! Keep the momentum going. 💪";
  if (progress < 50) return "You're building real wealth automatically. Stay consistent! 📈";
  if (progress < 75) return "More than halfway there — impressive! 🔥";
  if (progress < 100) return "Almost at your goal. The finish line is near! 🏁";
  return "Goal achieved! Time to set a bigger milestone! 🎉";
}

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
    return <PageLoader label="Loading Smart Investment Wallet…" />;
  }

  const maxCategorySpent = Math.max(
    ...Object.values(categoryBreakdown).map((c) => c.spent),
    1
  );

  const hasTransactions = totalTransactions > 0;

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      <PageHeader
        title="Smart Investment Wallet"
        subtitle="Track your accumulated spare change, auto-investment goals, and monthly growth."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* HERO: Smart Investment Wallet Balance */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border border-border/80 shadow-xl bg-white">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-mint/10 flex items-center justify-center border border-mint/20 shrink-0">
                  <PiggyBank size={32} className="text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-text-muted">
                      Smart Investment Wallet
                    </p>
                    <ShieldCheck size={16} className="text-emerald-700" />
                  </div>
                  <AnimatedCounter
                    value={investmentWallet}
                    prefix="₹"
                    className="text-4xl md:text-5xl font-display font-extrabold text-navy"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {todayRoundup > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mint/10 text-emerald-800 rounded-full text-xs font-extrabold border border-mint/20">
                    <TrendingUp size={13} /> +₹{todayRoundup} Saved Today
                  </span>
                )}
                {monthlyTotal > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy/5 text-navy rounded-full text-xs font-extrabold border border-navy/10">
                    ₹{monthlyTotal} This Month
                  </span>
                )}
                <SyncIndicator status={syncStatus} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Goal + Journey Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SAVINGS GOAL TRACKER */}
          <motion.div variants={itemVariants}>
            <Card padding="lg" className="h-full border border-border/80 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center">
                  <Target size={18} className="text-teal" />
                </div>
                <h2 className="text-lg font-bold text-navy">Auto-Investment Goal</h2>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <ProgressRing progress={goalProgress} size={140} strokeWidth={10} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-display font-extrabold text-navy">{goalProgress}%</span>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wide">Achieved</span>
                  </div>
                </div>

                <p className="text-sm font-bold text-navy mb-1">{goalName}</p>
                <p className="text-text-muted text-xs font-semibold mb-4">
                  ₹{investmentWallet.toLocaleString('en-IN')} saved of ₹{savingsGoal.toLocaleString('en-IN')} target
                </p>

                <p className="text-xs font-medium text-navy/70 bg-bg p-3 rounded-xl border border-border/60 w-full">
                  {getMotivation(goalProgress)}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* SAVINGS JOURNEY STATS */}
          <motion.div variants={itemVariants}>
            <Card padding="lg" className="h-full border border-border/80 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-mint/10 flex items-center justify-center">
                  <Trophy size={18} className="text-emerald-700" />
                </div>
                <h2 className="text-lg font-bold text-navy">Savings Journey</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Saved', value: `₹${investmentWallet.toLocaleString('en-IN')}`, accent: 'text-emerald-700' },
                  { label: 'Total Payments', value: totalTransactions, accent: 'text-navy' },
                  { label: 'Avg. Round-up', value: `₹${averageRoundup}`, accent: 'text-teal' },
                  { label: 'Biggest Round-up', value: `₹${largestRoundup}`, accent: 'text-navy' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-bg rounded-2xl p-4 border border-border/70">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted mb-1">
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

        {/* SPENDING ANALYTICS */}
        <motion.div variants={itemVariants}>
          <Card className="border border-border/80 shadow-md">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <TrendingUp size={18} className="text-navy" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">Category Spending & Yield</h2>
                  <p className="text-xs text-text-muted">Auto-investment breakdown by merchant category</p>
                </div>
              </div>

              {!hasTransactions ? (
                <p className="text-center text-text-muted text-xs py-8 font-medium">
                  No payment data recorded yet. Make a payment to view breakdown.
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
                          <div className="h-9 w-9 rounded-xl bg-bg flex items-center justify-center border border-border/60 shrink-0">
                            <Icon size={16} className="text-navy" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-navy truncate">{meta.label}</span>
                              <span className="text-xs font-extrabold text-navy ml-2 shrink-0">
                                ₹{data.spent.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="h-2 bg-bg rounded-full overflow-hidden border border-border/40">
                              <motion.div
                                className={`h-full rounded-full ${meta.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${barWidth}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            </div>
                            <p className="text-[10px] text-text-muted font-semibold mt-1">
                              {data.count} transaction{data.count !== 1 ? 's' : ''} · ₹{data.roundup} saved
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

        {/* TRANSACTION HISTORY */}
        <motion.div variants={itemVariants}>
          <Card padding="none" className="border border-border/80 shadow-md">
            <div className="p-6 md:p-8 pb-0 md:pb-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-navy">Smart Investment History</h2>
                <span className="text-xs font-extrabold text-navy bg-bg px-2.5 py-1 rounded-full border border-border/60">
                  {totalTransactions} total
                </span>
              </div>
            </div>

            {!hasTransactions ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="h-14 w-14 rounded-full bg-bg flex items-center justify-center mb-3 border border-border">
                  <PiggyBank size={24} className="text-text-muted" />
                </div>
                <p className="text-navy font-bold text-sm mb-1">No transaction records</p>
                <p className="text-text-muted text-xs mb-5">
                  Make your first payment to build your Smart Investment Wallet.
                </p>
                <Button variant="accent" onClick={() => navigate('/payment')} className="text-xs font-extrabold">
                  Make a Payment <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto px-6 md:px-8 pb-6 md:pb-8">
                <div className="divide-y divide-border/60">
                  {transactions.map((tx, idx) => {
                    const meta = CATEGORY_META[tx.category] || CATEGORY_META.other;
                    const Icon = meta.icon;

                    return (
                      <div key={tx.id || idx} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                        <div className="h-10 w-10 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0 border border-navy/10">
                          <Icon size={18} className="text-navy" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-navy truncate">{tx.merchantName || tx.merchant || 'UPI Payee'}</p>
                          <p className="text-[11px] text-text-muted">
                            {timeAgo(tx.timestamp || tx.createdAt)} · {meta.label}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-extrabold text-navy">₹{tx.roundedUp || (tx.purchaseAmount + tx.roundup)}</p>
                          <p className="text-[11px] font-extrabold text-emerald-700">+₹{tx.roundup} saved</p>
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