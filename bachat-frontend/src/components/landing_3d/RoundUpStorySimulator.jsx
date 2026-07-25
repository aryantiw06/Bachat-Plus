// ============================================
// RoundUpStorySimulator.jsx — Hero Interactive Storyline
// ============================================
// Step-by-step visual story loop:
//   1. Payment: ₹247
//   2. Round-up: ₹250
//   3. Separation: ₹3
//   4. Auto-Transfer into Smart Investment Wallet
//   5. Portfolio Growth Animation (₹3 → ₹3,000)
// ============================================

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  ArrowRight,
  PiggyBank,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Play,
  RotateCcw,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';

const STORY_STEPS = [
  {
    id: 1,
    title: '1. User Pays Bill',
    subtitle: 'Payment made at Cafe Coffee Day',
    amount: 247,
    rounded: 247,
    savings: 0,
    accent: 'bg-navy',
  },
  {
    id: 2,
    title: '2. Auto Round-Up',
    subtitle: 'Rounded up to nearest ₹10',
    amount: 247,
    rounded: 250,
    savings: 3,
    accent: 'bg-navy-light',
  },
  {
    id: 3,
    title: '3. Spare Change Separates',
    subtitle: '₹3 split from merchant share',
    amount: 247,
    rounded: 250,
    savings: 3,
    accent: 'bg-emerald-950',
  },
  {
    id: 4,
    title: '4. Smart Wallet Transfer',
    subtitle: 'Moved into Smart Investment Wallet',
    amount: 247,
    rounded: 250,
    savings: 3,
    accent: 'bg-mint/20',
  },
  {
    id: 5,
    title: '5. Portfolio Compounding',
    subtitle: 'Auto-invested in Gold & Nifty 50',
    amount: 247,
    rounded: 250,
    savings: 3000,
    accent: 'bg-emerald-900',
  },
];

export default function RoundUpStorySimulator() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % STORY_STEPS.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const step = STORY_STEPS[currentStepIndex];

  return (
    <div className="w-full bg-gradient-to-br from-navy via-navy to-navy-light text-white rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-mint/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-xl bg-mint/20 flex items-center justify-center border border-mint/30">
            <Sparkles size={16} className="text-mint" />
          </span>
          <div>
            <h3 className="font-extrabold text-sm text-white">Live Bachat+ Workflow</h3>
            <p className="text-[11px] text-white/70">Interactive Spare Change Story</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-all"
        >
          {isPlaying ? (
            <>
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse" /> Auto-playing
            </>
          ) : (
            <>
              <Play size={12} /> Play Story
            </>
          )}
        </button>
      </div>

      {/* Progress Dots */}
      <div className="grid grid-cols-5 gap-1.5 mb-6">
        {STORY_STEPS.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setCurrentStepIndex(idx);
              setIsPlaying(false);
            }}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentStepIndex
                ? 'bg-mint w-full shadow-[0_0_8px_#02c39a]'
                : idx < currentStepIndex
                ? 'bg-white/60'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Story Stage Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Step Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint">{step.title}</span>
              <p className="text-xs text-white/80 font-medium">{step.subtitle}</p>
            </div>
            <span className="text-xs font-bold text-white/60 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              Step {step.id} of 5
            </span>
          </div>

          {/* Visual Simulation Card */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/70 flex items-center gap-1.5">
                <CreditCard size={14} className="text-mint" /> Merchant Bill
              </span>
              <span className="font-extrabold text-base text-white">₹247.00</span>
            </div>

            <div className="flex justify-between items-center text-xs pt-3 border-t border-white/10">
              <span className="text-white/70">Rounded Payment</span>
              <span className="font-bold text-white">₹250.00</span>
            </div>

            {/* Step 3+ Yield Streak */}
            {step.id >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-mint/20 to-teal/10 rounded-xl p-3 border border-mint/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <PiggyBank size={18} className="text-mint" />
                  <span className="text-xs font-bold text-white">
                    {step.id === 5 ? 'Compounded Value' : 'Auto-Saved Share'}
                  </span>
                </div>
                <span className="text-lg font-black text-mint">
                  +{step.id === 5 ? '₹3,000' : '₹3'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Bottom Callout */}
          <div className="flex items-center justify-between text-xs text-white/80 pt-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck size={14} className="text-mint" /> 100% Automated via UPI
            </span>
            <button
              type="button"
              onClick={() => setCurrentStepIndex((prev) => (prev + 1) % STORY_STEPS.length)}
              className="text-mint hover:underline font-bold flex items-center gap-1"
            >
              Next Step <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
