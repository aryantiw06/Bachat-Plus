// ============================================
// PremiumSuccessModal.jsx — Checkout & Payment Simulation
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Shield, Sparkles, CreditCard, Lock, ArrowRight } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

export default function PremiumSuccessModal({ isOpen, plan = 'yearly', onClose, onComplete }) {
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success'

  if (!isOpen) return null;

  const isYearly = plan === 'yearly';
  const priceDisplay = isYearly ? '₹999 / year' : '₹99 / month';

  const handleProcessPayment = () => {
    if (!autoPayEnabled) return;
    setPaymentState('processing');

    // Simulate Payment Processing
    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        onComplete();
        // Reset state for future modal opens
        setPaymentState('idle');
        setAutoPayEnabled(false);
      }, 1800);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={paymentState === 'processing' ? undefined : onClose}
          className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden z-10 p-6 md:p-8"
        >
          {/* Close button */}
          {paymentState !== 'processing' && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-bg flex items-center justify-center text-text-muted hover:text-navy transition-colors"
            >
              <X size={18} />
            </button>
          )}

          {paymentState === 'success' ? (
            /* SUCCESS STATE */
            <div className="py-8 text-center flex flex-col items-center">
              {/* Confetti particles */}
              <div className="relative mb-6">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: ['#02c39a', '#f59e0b', '#3b82f6', '#8b5cf6'][i % 4],
                      top: '50%',
                      left: '50%',
                    }}
                    initial={{ x: 0, y: 0, scale: 1 }}
                    animate={{
                      x: (Math.cos((i * 30 * Math.PI) / 180) * 80),
                      y: (Math.sin((i * 30 * Math.PI) / 180) * 80),
                      opacity: [1, 1, 0],
                      scale: [1, 1.2, 0.5],
                    }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                ))}

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="h-20 w-20 rounded-full bg-mint/10 border-2 border-mint flex items-center justify-center text-mint mx-auto"
                >
                  <motion.svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </motion.svg>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Badge tone="mint" className="mb-2">
                  <Crown size={12} className="mr-1" /> Premium Active
                </Badge>
                <h3 className="text-2xl font-bold text-navy">Payment Successful!</h3>
                <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">
                  Welcome to Bachat+ Premium. Unlocking your AI Wealth Manager now...
                </p>
              </motion.div>
            </div>
          ) : (
            /* CHECKOUT FORM STATE */
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Crown size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy">Bachat+ Checkout</h3>
                  <p className="text-xs text-text-muted">Simulated 1-click subscription</p>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="bg-bg rounded-2xl p-4 border border-border/80 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Selected Plan</span>
                  {isYearly && <Badge tone="mint">Save 16%</Badge>}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold text-navy">
                    {isYearly ? 'Yearly Pass (Annual)' : 'Monthly Pro'}
                  </span>
                  <span className="text-lg font-display font-extrabold text-navy">{priceDisplay}</span>
                </div>
              </div>

              {/* Included Benefits */}
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
                  Included in your plan:
                </p>
                <ul className="space-y-2 text-xs text-navy/80">
                  {[
                    'AI Wealth Coach Pro & Daily Insights',
                    'AI Portfolio Optimizer & 10-Yr Forecast',
                    'Tax Saving Assistant & Smart Alerts',
                    'Unlimited Savings Goals',
                    'VIP Priority Support',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={14} className="text-mint shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AutoPay Requirement Toggle */}
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPayEnabled}
                    onChange={(e) => setAutoPayEnabled(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-navy block">
                      Enable AutoPay Mandate <span className="text-danger">*</span>
                    </span>
                    <span className="text-[11px] text-text-muted leading-relaxed block mt-0.5">
                      AutoPay is required to maintain uninterrupted access to AI Insights and Smart Alerts. You can pause anytime.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit CTA */}
              <Button
                variant="accent"
                fullWidth
                size="lg"
                loading={paymentState === 'processing'}
                disabled={!autoPayEnabled || paymentState === 'processing'}
                onClick={handleProcessPayment}
                className={`bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:brightness-105 shadow-lg ${
                  !autoPayEnabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {paymentState === 'processing' ? (
                  'Processing Payment...'
                ) : (
                  <>
                    <Lock size={16} className="mr-1" />
                    Complete Payment ({priceDisplay.split('/')[0].trim()})
                  </>
                )}
              </Button>

              {!autoPayEnabled && (
                <p className="text-[11px] text-center text-amber-600 font-semibold mt-2">
                  ⚠️ Check "Enable AutoPay Mandate" to proceed.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
