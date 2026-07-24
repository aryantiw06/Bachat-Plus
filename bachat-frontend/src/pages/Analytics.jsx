// ============================================
// Analytics.jsx — Financial Analytics Dashboard
// ============================================
// Presentation-only. All data derived from WalletContext.
// Uses Recharts for charts. Every computation is memoized
// and structured so backend APIs can replace local
// calculations later without changing the UI.
//
// Sections:
//   1.  Analytics Hero         7. Top Merchants
//   2.  Spending Overview      8. Wealth Growth Projection
//   3.  Spending by Category   9. Financial Score Breakdown
//   4.  Monthly Savings Trend 10. AI Insights
//   5.  Round-up Analysis     11. Export Report
//   6.  Spending Heatmap
// ============================================

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import {
  TrendingUp,
  PiggyBank,
  Target,
  BarChart3,
  Calendar,
  Users,
  Download,
  Share2,
  FileText,
  Sparkles,
  Shield,
  Zap,
  Award,
  Coffee,
  ShoppingBag,
  Car,
  Lightbulb,
} from 'lucide-react';
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

// ---- Constants ----
const CATEGORY_COLORS = {
  food: { hex: '#f97316', label: 'Food & Drinks' },
  shopping: { hex: '#3b82f6', label: 'Shopping' },
  transport: { hex: '#8b5cf6', label: 'Transport' },
  utility: { hex: '#f59e0b', label: 'Utilities' },
  other: { hex: '#94a3b8', label: 'Other' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ---- Mini Progress Ring (reused from AI Advisor pattern) ----
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

// ---- Custom Recharts Tooltip ----
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy text-white px-3 py-2 rounded-lg text-xs shadow-xl">
      <p className="font-semibold mb-0.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white/80">₹{p.value?.toLocaleString('en-IN')}</p>
      ))}
    </div>
  );
}

// ============================================
// ANALYSIS ENGINE (pure functions, API-replaceable)
// ============================================

function computeSpendingByCategory(transactions) {
  const totals = {};
  let grandTotal = 0;
  transactions.forEach((tx) => {
    const cat = tx.category || 'other';
    if (!totals[cat]) totals[cat] = 0;
    totals[cat] += tx.purchaseAmount;
    grandTotal += tx.purchaseAmount;
  });
  return Object.entries(totals)
    .map(([id, amount]) => ({
      id,
      name: CATEGORY_COLORS[id]?.label || 'Other',
      value: Math.round(amount),
      color: CATEGORY_COLORS[id]?.hex || '#94a3b8',
      pct: grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

function computeSavingsTrend(transactions) {
  if (transactions.length === 0) return [];
  // Group by date, accumulate wallet growth
  const sorted = [...transactions].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const byDate = {};
  let cumulative = 0;
  sorted.forEach((tx) => {
    const dateStr = new Date(tx.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    cumulative += tx.roundup;
    byDate[dateStr] = cumulative;
  });
  return Object.entries(byDate).map(([date, saved]) => ({ date, saved }));
}

function computeRoundupDistribution(transactions) {
  const buckets = { '₹1–3': 0, '₹4–5': 0, '₹6–7': 0, '₹8–9': 0 };
  transactions.forEach((tx) => {
    const r = tx.roundup;
    if (r <= 3) buckets['₹1–3']++;
    else if (r <= 5) buckets['₹4–5']++;
    else if (r <= 7) buckets['₹6–7']++;
    else buckets['₹8–9']++;
  });
  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

function computeWeekdayHeatmap(transactions) {
  const counts = new Array(7).fill(0);
  const amounts = new Array(7).fill(0);
  transactions.forEach((tx) => {
    const day = new Date(tx.timestamp).getDay();
    counts[day]++;
    amounts[day] += tx.purchaseAmount;
  });
  const maxCount = Math.max(...counts, 1);
  return WEEKDAYS.map((name, i) => ({
    day: name,
    count: counts[i],
    amount: Math.round(amounts[i]),
    intensity: counts[i] / maxCount,
  }));
}

function computeTopMerchants(transactions) {
  const map = {};
  transactions.forEach((tx) => {
    const name = tx.merchantName;
    if (!map[name]) map[name] = { name, totalSpent: 0, count: 0 };
    map[name].totalSpent += tx.purchaseAmount;
    map[name].count++;
  });
  return Object.values(map)
    .map((m) => ({ ...m, totalSpent: Math.round(m.totalSpent), avg: Math.round(m.totalSpent / m.count) }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);
}

function computeHealthScore(wallet, totalTx, goalProgress) {
  const savings = Math.min(Math.round((wallet / 1000) * 100), 100);
  const investment = wallet >= 100 ? Math.min(Math.round((wallet / 500) * 100), 100) : 0;
  const consistency = Math.min(totalTx * 10, 100);
  const goal = goalProgress;
  const overall = Math.round(savings * 0.3 + investment * 0.2 + consistency * 0.3 + goal * 0.2);
  return { overall, savings, investment, consistency, goal };
}

function generateInsights(wallet, totalTx, avgRoundup, categoryBreakdown, goalProgress, savingsGoal, heatmap) {
  const insights = [];
  const cats = Object.entries(categoryBreakdown).sort((a, b) => b[1].spent - a[1].spent);
  const totalSpent = cats.reduce((s, [, c]) => s + c.spent, 0);

  if (cats.length > 0) {
    const [topId, topData] = cats[0];
    const pct = totalSpent > 0 ? Math.round((topData.spent / totalSpent) * 100) : 0;
    insights.push(`${CATEGORY_COLORS[topId]?.label || 'Other'} accounts for ${pct}% of your spending.`);
  }
  if (avgRoundup > 0) insights.push(`You save an average of ₹${avgRoundup} per payment.`);
  if (wallet > 0 && savingsGoal > wallet) {
    const remaining = savingsGoal - wallet;
    const months = avgRoundup > 0 ? Math.ceil(remaining / (avgRoundup * 30)) : null;
    if (months) insights.push(`At this pace, you'll reach your goal in ~${months} month${months > 1 ? 's' : ''}.`);
  }
  // Weekend vs weekday
  const weekdaySpend = heatmap.filter((d, i) => i >= 1 && i <= 5).reduce((s, d) => s + d.amount, 0);
  const weekendSpend = heatmap.filter((d, i) => i === 0 || i === 6).reduce((s, d) => s + d.amount, 0);
  if (weekendSpend > weekdaySpend * 0.5 && totalTx >= 3) {
    insights.push('Weekend spending is relatively high compared to weekdays.');
  }
  if (wallet >= 50 && wallet < 100) insights.push('Continue this habit to unlock Gold ETF investing at ₹100.');
  if (totalTx >= 5) insights.push(`${totalTx} payments so far — consistency is the key to wealth!`);
  if (insights.length === 0) insights.push('Make payments to generate personalized insights.');
  return insights.slice(0, 5);
}

// ============================================
// MAIN PAGE
// ============================================
export default function Analytics() {
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

  const hasTx = totalTransactions > 0;

  // ---- Memoized analytics ----
  const totalSpent = useMemo(
    () => Math.round(transactions.reduce((s, tx) => s + tx.purchaseAmount, 0)),
    [transactions]
  );
  const avgPayment = useMemo(
    () => (totalTransactions > 0 ? Math.round(totalSpent / totalTransactions) : 0),
    [totalSpent, totalTransactions]
  );
  const minRoundup = useMemo(
    () => (hasTx ? Math.min(...transactions.map((t) => t.roundup)) : 0),
    [transactions, hasTx]
  );
  const catChartData = useMemo(() => computeSpendingByCategory(transactions), [transactions]);
  const savingsTrend = useMemo(() => computeSavingsTrend(transactions), [transactions]);
  const roundupDist = useMemo(() => computeRoundupDistribution(transactions), [transactions]);
  const heatmap = useMemo(() => computeWeekdayHeatmap(transactions), [transactions]);
  const topMerchants = useMemo(() => computeTopMerchants(transactions), [transactions]);
  const health = useMemo(() => computeHealthScore(investmentWallet, totalTransactions, goalProgress), [investmentWallet, totalTransactions, goalProgress]);
  const aiInsights = useMemo(
    () => generateInsights(investmentWallet, totalTransactions, averageRoundup, categoryBreakdown, goalProgress, savingsGoal, heatmap),
    [investmentWallet, totalTransactions, averageRoundup, categoryBreakdown, goalProgress, savingsGoal, heatmap]
  );

  // Forecast
  const monthlyAvg = monthlyTotal > 0 ? monthlyTotal : averageRoundup * 20;
  const forecasts = [
    { label: '1 Month', value: Math.round(investmentWallet + monthlyAvg) },
    { label: '6 Months', value: Math.round((investmentWallet + monthlyAvg * 6) * 1.06) },
    { label: '1 Year', value: Math.round((investmentWallet + monthlyAvg * 12) * 1.12) },
    { label: '5 Years', value: Math.round((investmentWallet + monthlyAvg * 60) * Math.pow(1.12, 5)) },
  ];

  // Motivation
  const heroInsight = hasTx
    ? monthlyTotal > todayRoundup ? "You're saving smarter than last week." : `₹${investmentWallet} saved through round-ups alone!`
    : 'Start making payments to see your financial analytics.';

  // Highest spending category label
  const topCatLabel = catChartData.length > 0 ? catChartData[0].name : '—';

  if (loadingWallet) return <PageLoader label="Loading analytics…" />;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader title="Financial Analytics" subtitle="Understand your money. Master your habits." badge="Insights" />

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">

        {/* =============================================
            1. ANALYTICS HERO
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-teal opacity-[0.03] pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
                {[
                  { label: 'Smart Wallet Saved', value: investmentWallet, prefix: '₹', accent: 'text-mint' },
                  { label: 'Total Payments', value: totalTransactions, prefix: '', accent: 'text-navy' },
                  { label: 'Total Spent', value: totalSpent, prefix: '₹', accent: 'text-navy' },
                  { label: 'Savings Goal', value: savingsGoal, prefix: '₹', accent: 'text-teal' },
                  { label: 'Goal Progress', value: goalProgress, prefix: '', suffix: '%', accent: 'text-mint' },
                ].map((s) => (
                  <div key={s.label} className="bg-bg rounded-xl p-4 border border-border/60">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">{s.label}</p>
                    <AnimatedCounter
                      value={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix || ''}
                      className={`text-xl font-display font-extrabold ${s.accent}`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-muted italic">{heroInsight}</p>
            </div>
          </Card>
        </motion.div>

        {/* =============================================
            2. SPENDING OVERVIEW
        ============================================= */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Spending', value: `₹${totalSpent.toLocaleString('en-IN')}`, accent: 'text-navy' },
              { label: 'Avg. Payment', value: `₹${avgPayment}`, accent: 'text-navy' },
              { label: 'Avg. Round-up', value: `₹${averageRoundup}`, accent: 'text-teal' },
              { label: 'Largest Round-up', value: `₹${largestRoundup}`, accent: 'text-mint' },
              { label: 'Top Category', value: topCatLabel, accent: 'text-navy' },
              { label: 'Transactions', value: totalTransactions, accent: 'text-navy' },
            ].map((s) => (
              <Card key={s.label} className="!p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">{s.label}</p>
                <p className={`text-lg font-display font-extrabold ${s.accent} truncate`}>{s.value}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Two-column: Category Pie + Savings Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* =============================================
              3. SPENDING BY CATEGORY (Pie Chart)
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <BarChart3 size={18} className="text-navy" />
                </div>
                <h2 className="text-lg font-bold text-navy">Spending by Category</h2>
              </div>

              {hasTx ? (
                <div className="flex flex-col items-center">
                  <div className="w-full h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={catChartData}
                          cx="50%" cy="50%"
                          innerRadius={50} outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          animationBegin={200}
                          animationDuration={800}
                        >
                          {catChartData.map((entry) => (
                            <Cell key={entry.id} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full space-y-2 mt-2">
                    {catChartData.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-navy font-medium">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted text-xs">{cat.pct}%</span>
                          <span className="font-bold text-navy">₹{cat.value.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-text-muted py-10">No data yet.</p>
              )}
            </Card>
          </motion.div>

          {/* =============================================
              4. MONTHLY SAVINGS TREND (Area Chart)
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-mint/10 flex items-center justify-center">
                  <TrendingUp size={18} className="text-mint" />
                </div>
                <h2 className="text-lg font-bold text-navy">Savings Growth</h2>
              </div>

              {savingsTrend.length > 1 ? (
                <div className="w-full h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={savingsTrend}>
                      <defs>
                        <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#02c39a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#02c39a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e3eaea" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5b6b73' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#5b6b73' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="saved" stroke="#02c39a" strokeWidth={2} fill="url(#savingsGrad)" animationDuration={800} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-sm text-text-muted py-10">
                  {hasTx ? 'Make one more payment to see growth trends.' : 'No data yet.'}
                </p>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Two-column: Round-up Analysis + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* =============================================
              5. ROUND-UP ANALYSIS
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center">
                  <PiggyBank size={18} className="text-teal" />
                </div>
                <h2 className="text-lg font-bold text-navy">Round-up Analysis</h2>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Average', value: `₹${averageRoundup}` },
                  { label: 'Maximum', value: `₹${largestRoundup}` },
                  { label: 'Minimum', value: `₹${minRoundup}` },
                ].map((s) => (
                  <div key={s.label} className="bg-bg rounded-xl p-3 border border-border/50 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">{s.label}</p>
                    <p className="text-lg font-display font-extrabold text-navy">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Distribution bar chart */}
              {hasTx ? (
                <div className="w-full h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roundupDist} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e3eaea" />
                      <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#5b6b73' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5b6b73' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#02c39a" radius={[6, 6, 0, 0]} animationDuration={800} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-sm text-text-muted py-6">No data yet.</p>
              )}
            </Card>
          </motion.div>

          {/* =============================================
              6. SPENDING HEATMAP
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Calendar size={18} className="text-amber-500" />
                </div>
                <h2 className="text-lg font-bold text-navy">Spending by Weekday</h2>
              </div>

              <div className="space-y-3">
                {heatmap.map((d) => (
                  <div key={d.day} className="flex items-center gap-3">
                    <span className="w-10 text-xs font-semibold text-text-muted text-right">{d.day}</span>
                    <div className="flex-1 h-5 bg-bg rounded-full overflow-hidden border border-border/40">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-navy/70 to-navy"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(d.intensity * 100, d.count > 0 ? 6 : 0)}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="w-14 text-xs font-bold text-navy text-right">
                      {d.count > 0 ? `₹${d.amount.toLocaleString('en-IN')}` : '—'}
                    </span>
                  </div>
                ))}
              </div>

              {!hasTx && <p className="text-center text-sm text-text-muted pt-4">No data yet.</p>}
            </Card>
          </motion.div>
        </div>

        {/* =============================================
            7. TOP MERCHANTS
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <Users size={18} className="text-navy" />
                </div>
                <h2 className="text-lg font-bold text-navy">Top Merchants</h2>
              </div>

              {topMerchants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">#</th>
                        <th className="text-left py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">Merchant</th>
                        <th className="text-right py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">Total Spent</th>
                        <th className="text-right py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">Payments</th>
                        <th className="text-right py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">Avg.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topMerchants.map((m, i) => (
                        <tr key={m.name} className="border-b border-border/50 last:border-0">
                          <td className="py-3 font-bold text-text-muted">{i + 1}</td>
                          <td className="py-3 font-semibold text-navy">{m.name}</td>
                          <td className="py-3 text-right font-bold text-navy">₹{m.totalSpent.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-right text-text-muted">{m.count}</td>
                          <td className="py-3 text-right text-text-muted">₹{m.avg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-sm text-text-muted py-8">No data yet.</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* =============================================
            8. WEALTH GROWTH PROJECTION
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-mint/10 flex items-center justify-center">
                  <TrendingUp size={18} className="text-mint" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">Wealth Projection</h2>
                  <p className="text-xs text-text-muted">Based on ~₹{monthlyAvg}/month at 12% annual return</p>
                </div>
              </div>

              {hasTx ? (
                <div className="flex items-end justify-between gap-4 h-44">
                  {forecasts.map((f, i) => {
                    const maxVal = Math.max(...forecasts.map((ff) => ff.value), 1);
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
              ) : (
                <p className="text-center text-sm text-text-muted py-10">Make payments to see wealth projections.</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Two-column: Health Score + AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* =============================================
              9. FINANCIAL SCORE BREAKDOWN
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <Shield size={18} className="text-navy" />
                </div>
                <h2 className="text-lg font-bold text-navy">Financial Score</h2>
              </div>

              <div className="flex flex-col items-center mb-5">
                <div className="relative">
                  <MiniRing value={health.overall} size={100} strokeWidth={8} color="text-mint" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-display font-extrabold text-navy">{health.overall}</span>
                    <span className="text-[9px] text-text-muted font-bold uppercase">Overall</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Savings', value: health.savings, color: 'text-mint' },
                  { label: 'Investment', value: health.investment, color: 'text-teal' },
                  { label: 'Consistency', value: health.consistency, color: 'text-blue-500' },
                  { label: 'Goal', value: health.goal, color: 'text-navy' },
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

          {/* =============================================
              10. AI INSIGHTS
          ============================================= */}
          <motion.div variants={fadeUp}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-mint/20 to-teal/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-mint" />
                </div>
                <h2 className="text-lg font-bold text-navy">AI Insights</h2>
                <Badge tone="mint">AI</Badge>
              </div>

              <div className="space-y-3">
                {aiInsights.map((insight, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex items-start gap-3 bg-bg rounded-xl p-4 border border-border/50"
                  >
                    <div className="h-7 w-7 rounded-lg bg-mint/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb size={14} className="text-mint" />
                    </div>
                    <p className="text-sm text-navy/80 leading-relaxed">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* =============================================
            11. EXPORT REPORT
        ============================================= */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center">
                  <FileText size={18} className="text-navy" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">Export Report</h2>
                  <p className="text-xs text-text-muted">Download or share your financial summary</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" aria-label="Download PDF report">
                  <Download size={16} className="mr-2" /> Download PDF
                </Button>
                <Button variant="secondary" aria-label="Download CSV report">
                  <FileText size={16} className="mr-2" /> Download CSV
                </Button>
                <Button variant="secondary" aria-label="Share summary">
                  <Share2 size={16} className="mr-2" /> Share Summary
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
