// ============================================
// PremiumPlans.jsx — Pricing Cards & Upgrade Actions
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function PremiumPlans({ onSelectPlan }) {
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'

  return (
    <motion.div variants={fadeUp} className="space-y-6" id="pricing-section">
      <div className="text-center max-w-xl mx-auto mb-8">
        <Badge tone="mint" className="mb-3">
          Flexible Plans
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-navy">
          Simple, Transparent Pricing
        </h2>
        <p className="text-sm text-text-muted mt-2">
          Unlock unlimited AI wealth coaching, portfolio optimization, and tax insights.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-2 p-1.5 bg-bg rounded-2xl border border-border mt-6">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              billingCycle === 'monthly'
                ? 'bg-navy text-white shadow-sm'
                : 'text-text-muted hover:text-navy'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-navy text-white shadow-sm'
                : 'text-text-muted hover:text-navy'
            }`}
          >
            Yearly Billing
            <span className="text-[10px] font-extrabold text-mint bg-mint/20 px-1.5 py-0.5 rounded-md">
              Save 16%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Monthly Plan */}
        <Card
          className={`relative flex flex-col justify-between transition-all ${
            billingCycle === 'monthly' ? 'border-navy shadow-lg shadow-navy/5' : ''
          }`}
          padding="lg"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-navy">Monthly Pro</h3>
                <p className="text-xs text-text-muted">Pay month-to-month</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
                <Zap size={20} />
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-display font-extrabold text-navy">₹99</span>
              <span className="text-sm text-text-muted"> / month</span>
            </div>

            <ul className="space-y-3 text-xs text-navy/80 mb-8">
              {[
                'Unlimited AI Wealth Coach Pro',
                'Advanced Portfolio Score & Analytics',
                'Unlimited Savings Goals',
                'Tax Saving Assistant',
                'Smart Price & Market Alerts',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check size={16} className="text-mint shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => onSelectPlan('monthly')}
            aria-label="Start 7-day free trial on Monthly Pro"
          >
            Start 7-Day Free Trial
          </Button>
        </Card>

        {/* Yearly Plan (Recommended) */}
        <Card
          className="relative flex flex-col justify-between border-2 border-amber-400 shadow-xl shadow-amber-500/10 overflow-hidden"
          padding="lg"
        >
          {/* Top Banner */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <Crown size={12} /> Recommended
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  Yearly Pass
                </h3>
                <p className="text-xs text-text-muted">Billed annually at ₹999</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                <Crown size={20} />
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-display font-extrabold text-navy">₹83</span>
              <span className="text-sm text-text-muted"> / month</span>
              <span className="block text-[11px] text-amber-600 font-semibold mt-1">
                Save ₹189/year (₹999 billed annually)
              </span>
            </div>

            <ul className="space-y-3 text-xs text-navy/90 mb-8">
              {[
                'Everything in Monthly Pro',
                'AI Portfolio Optimizer & Rebalancer',
                '10-Year Wealth Projection Engine',
                'Family Wallet Sharing (Up to 4)',
                'VIP Priority 24/7 Support',
                'Zero AutoPay Convenience Fees',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="accent"
            fullWidth
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:brightness-105 shadow-md shadow-amber-500/20"
            onClick={() => onSelectPlan('yearly')}
            aria-label="Upgrade now to Yearly Pass"
          >
            <Crown size={16} className="mr-1.5" />
            Upgrade Now
          </Button>
        </Card>
      </div>

      <p className="text-center text-[11px] text-text-muted flex items-center justify-center gap-1.5">
        <Shield size={14} className="text-mint" />
        Cancel anytime with 1-click. Secure 256-bit encrypted checkout.
      </p>
    </motion.div>
  );
}
