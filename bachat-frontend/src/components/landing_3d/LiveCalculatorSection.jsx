// ============================================
// LiveCalculatorSection.jsx — Interactive Round-Up Wealth Simulator
// ============================================
// Allows users to modify payment amount and daily transaction frequency.
// Real-time calculates:
//   - Round-up per payment
//   - Daily savings
//   - Monthly savings
//   - Annual savings
//   - Projected 5-Year Compounded Wealth (at 12% p.a. CAGR)
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calculator, PiggyBank, TrendingUp, Calendar, Zap, RefreshCw } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import AnimatedCounter from '../ui/AnimatedCounter.jsx';

const PRESET_PAYMENTS = [
  { label: 'Coffee', amount: 163 },
  { label: 'Cab Ride', amount: 243 },
  { label: 'Groceries', amount: 487 },
  { label: 'Dinner', amount: 892 },
];

export default function LiveCalculatorSection() {
  const [paymentAmount, setPaymentAmount] = useState(247);
  const [dailyTxCount, setDailyTxCount] = useState(8);

  // Math Calculations
  const nearestTen = Math.ceil(paymentAmount / 10) * 10 || paymentAmount;
  const roundUpPerPayment = nearestTen === paymentAmount ? 10 : nearestTen - paymentAmount;
  const dailySavings = roundUpPerPayment * dailyTxCount;
  const monthlySavings = dailySavings * 30;
  const annualSavings = monthlySavings * 12;

  // 5-Year Compounded Future Value (Monthly SIP formula @ 12% p.a. return)
  // FV = P * [ ((1+r)^n - 1) / r ] * (1+r)
  const r = 0.12 / 12;
  const n = 60;
  const projected5YearWealth = Math.round(
    monthlySavings * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
  );

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="bg-gradient-to-br from-navy via-navy to-navy-light text-white rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-mint/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-10">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge tone="mint" className="bg-mint/20 text-mint border-none">
              Interactive Wealth Simulator
            </Badge>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight">
              Calculate Your Round-Up Wealth Potential
            </h2>
            <p className="text-xs sm:text-sm text-white/70">
              See how your everyday spare change accumulates quietly into a significant investment portfolio over time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Controls Column (5 cols) */}
            <div className="lg:col-span-5 bg-white/5 rounded-3xl p-6 border border-white/10 space-y-6">
              
              {/* Payment Amount Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white/80">Average Payment Amount</span>
                  <span className="text-mint font-extrabold text-base">₹{paymentAmount}</span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="5"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-mint"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_PAYMENTS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setPaymentAmount(p.amount)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${
                        paymentAmount === p.amount
                          ? 'bg-mint text-navy border-mint font-black'
                          : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/20'
                      }`}
                    >
                      {p.label} (₹{p.amount})
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Transactions Input */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white/80">Daily Payments Count</span>
                  <span className="text-mint font-extrabold text-base">{dailyTxCount} / day</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={dailyTxCount}
                  onChange={(e) => setDailyTxCount(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-mint"
                />
              </div>

              {/* Live Formula Breakdown */}
              <div className="bg-navy/80 rounded-2xl p-4 border border-white/10 text-xs space-y-1.5">
                <div className="flex justify-between text-white/70">
                  <span>Payment Amount</span>
                  <span className="font-semibold text-white">₹{paymentAmount}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Rounded to Nearest ₹10</span>
                  <span className="font-semibold text-white">₹{nearestTen}</span>
                </div>
                <div className="flex justify-between text-mint font-extrabold pt-1.5 border-t border-white/10">
                  <span>Spare Change Saved</span>
                  <span>+₹{roundUpPerPayment} per transaction</span>
                </div>
              </div>

            </div>

            {/* Right Calculated Results Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">

              {/* Top Row: Daily, Monthly, Annual */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/60 mb-1">Daily Savings</p>
                  <AnimatedCounter
                    value={dailySavings}
                    prefix="₹"
                    className="text-lg sm:text-xl font-black text-white"
                  />
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/60 mb-1">Monthly Savings</p>
                  <AnimatedCounter
                    value={monthlySavings}
                    prefix="₹"
                    className="text-lg sm:text-xl font-black text-white"
                  />
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/60 mb-1">Annual Savings</p>
                  <AnimatedCounter
                    value={annualSavings}
                    prefix="₹"
                    className="text-lg sm:text-xl font-black text-white"
                  />
                </div>
              </div>

              {/* Big Hero Card: 5-Year Compounded Projected Wealth */}
              <div className="bg-gradient-to-br from-mint/20 via-teal/15 to-navy rounded-3xl p-6 sm:p-8 border border-mint/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-mint flex items-center gap-1.5">
                    <TrendingUp size={16} /> Projected 5-Year Compounded Wealth
                  </span>
                  <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    @ 12% p.a. CAGR
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <AnimatedCounter
                    value={projected5YearWealth}
                    prefix="₹"
                    className="text-3xl sm:text-5xl font-display font-black text-mint"
                  />
                  <span className="text-xs text-white/70">accumulated automatically</span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed pt-2 border-t border-white/10">
                  By quietly saving <strong className="text-white">₹{roundUpPerPayment}</strong> per payment across <strong className="text-white">{dailyTxCount} daily spends</strong>, you build <strong className="text-mint">₹{projected5YearWealth.toLocaleString('en-IN')}</strong> in 5 years with zero change to your lifestyle!
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
