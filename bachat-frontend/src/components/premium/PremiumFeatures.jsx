// ============================================
// PremiumFeatures.jsx — Locked Premium Experience
// ============================================

import { motion } from 'framer-motion';
import {
  Crown,
  Sparkles,
  Shield,
  Brain,
  BarChart3,
  Target,
  Bell,
  Users,
  Zap,
  Lock,
  Check,
  X,
  TrendingUp,
  Calendar,
  Star,
  ArrowRight,
  PieChart,
} from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import PremiumPlans from './PremiumPlans.jsx';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function PremiumFeatures({ onUpgrade }) {
  const scrollToPricing = () => {
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-12">

      {/* ===================================================
          1. PREMIUM HERO
      =================================================== */}
      <motion.div variants={fadeUp}>
        <Card className="relative overflow-hidden border-2 border-amber-400/30">
          {/* Animated Gold Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-teal opacity-95 pointer-events-none" />

          {/* Glowing Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative p-8 md:p-12 flex flex-col items-center text-center text-white">
            {/* Floating Crown Icon */}
            <motion.div
              animate={{ y: [-4, 6, -4] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="h-20 w-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-2xl shadow-amber-500/30 border border-amber-300 mb-6"
            >
              <Crown size={38} />
            </motion.div>

            <Badge tone="mint" className="mb-4 bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Sparkles size={12} className="mr-1" /> Flagship Upgrade
            </Badge>

            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-4 tracking-tight">
              Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white">Bachat+ Premium</span>
            </h1>

            <p className="text-base md:text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
              Your Personal AI Wealth Manager. Unlock automated portfolio optimization, 10-year forecasts, tax-saving strategies, and unlimited goals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="accent"
                size="lg"
                onClick={scrollToPricing}
                className="bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold hover:brightness-105 shadow-xl shadow-amber-500/25 px-8"
              >
                <Crown size={18} className="mr-2" />
                Upgrade Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={scrollToPricing}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                View Plans
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ===================================================
          2. FREE VS PREMIUM COMPARISON
      =================================================== */}
      <motion.div variants={fadeUp}>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-navy">Why Go Premium?</h2>
          <p className="text-sm text-text-muted mt-1">See how Bachat+ Premium elevates your wealth journey</p>
        </div>

        <Card padding="none" className="overflow-hidden border border-border/80">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Free Column */}
            <div className="p-6 md:p-8 bg-bg/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-navy">Bachat+ Free</h3>
                  <p className="text-xs text-text-muted">Standard round-up savings</p>
                </div>
                <Badge tone="outline">Active Plan</Badge>
              </div>

              <ul className="space-y-3.5 text-xs text-navy/80">
                {[
                  { text: 'Basic Round-up Savings', avail: true },
                  { text: 'Basic AI Insights', avail: true },
                  { text: '1 Active Savings Goal', avail: true },
                  { text: 'Basic 1-Year Forecast', avail: true },
                  { text: 'AI Portfolio Optimizer', avail: false },
                  { text: 'Tax Saving Assistant', avail: false },
                  { text: 'Smart Market & Price Alerts', avail: false },
                  { text: 'Family Wallet Sharing', avail: false },
                  { text: 'VIP Priority Support', avail: false },
                ].map((item) => (
                  <li key={item.text} className="flex items-center justify-between">
                    <span className={item.avail ? 'font-medium' : 'text-text-muted/60 line-through'}>{item.text}</span>
                    {item.avail ? <Check size={16} className="text-mint shrink-0" /> : <X size={16} className="text-text-muted/40 shrink-0" />}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Column */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-amber-500/5 to-transparent relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-navy flex items-center gap-1.5">
                    <Crown size={18} className="text-amber-500" /> Bachat+ Pro
                  </h3>
                  <p className="text-xs text-text-muted">Full AI Wealth Management</p>
                </div>
                <Badge tone="mint" className="bg-amber-500/10 text-amber-600 border border-amber-200">Recommended</Badge>
              </div>

              <ul className="space-y-3.5 text-xs text-navy font-medium">
                {[
                  'Automated Round-up Savings',
                  'Unlimited AI Wealth Coach Pro',
                  'Unlimited Active Savings Goals',
                  '10-Year Advanced Compound Forecast',
                  'AI Portfolio Optimizer & Rebalancer',
                  'Tax Saving Assistant & ELSS Advice',
                  'Smart Market & Price Drop Alerts',
                  'Family Wallet Sharing (Up to 4)',
                  'VIP Priority 24/7 Support',
                ].map((text) => (
                  <li key={text} className="flex items-center justify-between">
                    <span className="text-navy">{text}</span>
                    <Check size={16} className="text-amber-500 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ===================================================
          3. PREMIUM FEATURES SHOWCASE
      =================================================== */}
      <motion.div variants={fadeUp}>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-navy">Exclusive Pro Features</h2>
          <p className="text-sm text-text-muted mt-1">Tools designed to accelerate your financial freedom</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'AI Wealth Coach Pro', desc: 'Real-time financial advice tailored to your exact spending.', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
            { title: 'Advanced Analytics', desc: 'Deep dive into spending habits and merchant benchmarks.', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'Portfolio Optimizer', desc: 'Auto-allocates round-ups across ETFs, Gold, and FDs.', icon: PieChart, color: 'text-mint', bg: 'bg-mint/10' },
            { title: 'Financial Planner', desc: '10-year wealth projections with inflation adjustment.', icon: Calendar, color: 'text-teal', bg: 'bg-teal/10' },
            { title: 'Tax Saving Assistant', desc: 'Find tax deduction opportunities under Sec 80C automatically.', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Family Wallet', desc: 'Pool round-ups together with family members for shared goals.', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Unlimited Goals', desc: 'Track separate goals for emergency, travel, and gadgets.', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Smart Alerts', desc: 'Instant notifications when market dips or savings targets are hit.', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} hoverable className="flex flex-col justify-between">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`h-10 w-10 rounded-xl ${feat.bg} flex items-center justify-center ${feat.color}`}>
                      <Icon size={20} />
                    </div>
                    <Badge tone="outline" className="text-[10px]">Pro</Badge>
                  </div>
                  <h3 className="text-sm font-bold text-navy mb-1">{feat.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{feat.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* ===================================================
          4. INTERACTIVE BLURRED PREVIEW
      =================================================== */}
      <motion.div variants={fadeUp}>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-navy">Live Premium Insights</h2>
          <p className="text-sm text-text-muted mt-1">Here is what Bachat+ Pro is analyzing in the background</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Portfolio Risk Alert', content: 'Your current portfolio risk is 17%. Consider increasing Gold ETF by 8% to balance volatility.', badge: 'Risk Pro' },
            { title: 'Tax Saving Opportunity', content: 'You can save up to ₹4,200 in tax this financial year by allocating ₹15,000 to ELSS Funds.', badge: 'Tax Pro' },
            { title: 'Smart Rebalance', content: 'Gold prices dropped 1.8% today. Auto-allocating ₹250 round-up gives 2.1x higher long-term yield.', badge: 'AI Pick' },
          ].map((item, i) => (
            <Card key={i} className="relative overflow-hidden p-6 border-amber-200">
              {/* Content underneath */}
              <div className="filter blur-[4px] select-none">
                <Badge tone="mint" className="mb-2">{item.badge}</Badge>
                <h4 className="text-base font-bold text-navy mb-2">{item.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{item.content}</p>
              </div>

              {/* Locked Glass Overlay */}
              <div className="absolute inset-0 bg-surface/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                <div className="h-10 w-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-2 shadow-sm">
                  <Lock size={18} />
                </div>
                <span className="text-xs font-bold text-navy">Locked Pro Insight</span>
                <span className="text-[10px] text-text-muted mt-0.5">Upgrade to unlock full recommendation</span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ===================================================
          5. WHY UPGRADE STATS
      =================================================== */}
      <motion.div variants={fadeUp}>
        <Card className="bg-navy text-white p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div>
              <p className="text-3xl md:text-4xl font-display font-extrabold text-mint">2.3x</p>
              <p className="text-xs text-white/80 font-medium mt-1">More Savings per Month</p>
            </div>
            <div className="pt-6 md:pt-0">
              <p className="text-3xl md:text-4xl font-display font-extrabold text-amber-300">₹650</p>
              <p className="text-xs text-white/80 font-medium mt-1">Average Monthly Round-up Invested</p>
            </div>
            <div className="pt-6 md:pt-0">
              <p className="text-3xl md:text-4xl font-display font-extrabold text-teal">42%</p>
              <p className="text-xs text-white/80 font-medium mt-1">Faster Savings Goal Completion</p>
            </div>
          </div>
          <p className="text-[10px] text-center text-white/50 mt-6 italic">
            * Based on simulated benchmark user data across early Bachat+ Pro testers.
          </p>
        </Card>
      </motion.div>

      {/* ===================================================
          6. PRICING SECTION
      =================================================== */}
      <PremiumPlans onSelectPlan={onUpgrade} />

    </motion.div>
  );
}
