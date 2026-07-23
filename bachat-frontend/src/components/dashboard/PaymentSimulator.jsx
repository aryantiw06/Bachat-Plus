// ============================================
// PaymentSimulator — The core Bachat+ feature
// ============================================
// Full payment flow with premium fintech UX:
//   1. User enters an amount
//   2. Clicks "Pay"
//   3. High-quality animated processing state
//   4. Sequential step-by-step breakdown (CRED/Groww style):
//      - Base Amount
//      - Rounded Amount
//      - Merchant Share
//      - Wallet Transfer (triggers wallet update callback)
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Store,
  PiggyBank,
  IndianRupee,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

// Payment flow states
const STATES = {
  IDLE: 'idle',           // Waiting for input
  PROCESSING: 'processing', // Simulating payment
  COMPLETE: 'complete',     // Showing result breakdown
};

export default function PaymentSimulator({ onPayment }) {
  const [amount, setAmount] = useState('');
  const [flowState, setFlowState] = useState(STATES.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Validate the entered amount
  function validate(value) {
    const num = parseFloat(value);
    if (!value || isNaN(num)) return 'Please enter a valid amount.';
    if (num <= 0) return 'Amount must be greater than ₹0.';
    if (num > 100000) return 'Maximum amount is ₹1,00,000.';
    return '';
  }

  // Main payment handler
  async function handlePay(e) {
    e.preventDefault();

    const validationError = validate(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    const purchaseAmount = parseFloat(amount);

    // Calculate the round-up
    const roundedUp = Math.ceil(purchaseAmount / 10) * 10;
    const roundup = roundedUp - purchaseAmount;

    setFlowState(STATES.PROCESSING);
    // Simulate a realistic processing delay
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const paymentResult = await onPayment({
      purchaseAmount,
      merchantName: 'Dashboard Payment',
      category: 'general',
    });

    if (!paymentResult?.success) {
      setError(paymentResult?.error || 'Payment processing failed.');
      setFlowState(STATES.IDLE);
      return;
    }

    const transaction = paymentResult.transaction;
    setResult({
      id: transaction.id,
      purchaseAmount: transaction.amount,
      roundedUp: transaction.amount + transaction.roundUp,
      roundup: transaction.roundUp,
      merchantReceives: transaction.amount,
      timestamp: new Date(transaction.createdAt),
    });
    setFlowState(STATES.COMPLETE);
  }

  // Reset for a new payment
  function handleNewPayment() {
    setAmount('');
    setResult(null);
    setFlowState(STATES.IDLE);
    setError('');
  }

  return (
    <Card padding="none" className="overflow-hidden shadow-2xl shadow-navy/5 border-navy/10 flex flex-col h-full">
      {/* Premium Hero Header */}
      <div className="bg-gradient-to-br from-navy via-navy to-navy-light px-8 py-8 flex flex-col relative overflow-hidden shrink-0">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 h-40 w-40 bg-mint/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 h-40 w-40 bg-teal/20 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
            <CreditCard size={28} className="text-mint drop-shadow-[0_0_8px_rgba(2,195,154,0.5)]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl tracking-tight">Payment Simulator</h3>
            <p className="text-white/70 text-sm mt-0.5 font-medium">Experience auto-investing in action</p>
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ===== IDLE STATE — Input Form ===== */}
          {flowState === STATES.IDLE && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onSubmit={handlePay}
              className="max-w-sm mx-auto w-full"
            >
              <div className="mb-8">
                <Input
                  label="Enter bill amount"
                  type="number"
                  prefix="₹"
                  placeholder="e.g. 163"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError('');
                  }}
                  error={error}
                  // Override some input styles for premium feel if needed
                  className="text-2xl font-bold py-3" 
                />
                
                {!error && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="mt-3 text-sm text-mint font-medium flex items-center gap-1.5 bg-mint/5 px-3 py-2 rounded-lg border border-mint/10"
                  >
                    <Sparkles size={14} />
                    ₹{Math.ceil(parseFloat(amount) / 10) * 10 - parseFloat(amount)} will be invested
                  </motion.div>
                )}
              </div>

              <Button
                type="submit"
                variant="accent"
                fullWidth
                className="py-4 text-base font-bold shadow-lg shadow-mint/20 hover:shadow-mint/40 transition-shadow"
              >
                <Sparkles size={18} className="mr-2" />
                Pay {amount ? `₹${amount}` : 'Now'}
              </Button>
            </motion.form>
          )}

          {/* ===== PROCESSING STATE — Animated Loader ===== */}
          {flowState === STATES.PROCESSING && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12 gap-6"
            >
              {/* Premium pulsing ring animation */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-mint"
                />
                <div className="relative h-20 w-20 rounded-full bg-navy/5 flex items-center justify-center backdrop-blur-sm border border-navy/10 shadow-xl">
                  <CreditCard size={28} className="text-navy" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-mint border-r-mint/50"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-navy">Processing Payment...</p>
                <p className="text-sm text-text-muted mt-1">Connecting to merchant</p>
              </div>
            </motion.div>
          )}

          {/* ===== COMPLETE STATE — Result Breakdown ===== */}
          {flowState === STATES.COMPLETE && result && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm mx-auto"
            >
              {/* Success Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="flex flex-col items-center justify-center mb-8"
              >
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-3 shadow-lg shadow-success/20 ring-4 ring-success/5">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <h2 className="text-xl font-bold text-navy">Payment Successful</h2>
              </motion.div>

              {/* Sequential Flow */}
              <div className="relative space-y-2 mb-8">
                {/* Connecting Line */}
                <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-border z-0"></div>

                {/* 1. Base Amount */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }} 
                  className="flex items-center gap-4 relative z-10"
                >
                  <div className="h-12 w-12 rounded-full bg-white border border-border shadow-sm flex items-center justify-center shrink-0 text-text-muted">
                    <IndianRupee size={20} />
                  </div>
                  <div className="flex-1 bg-bg/50 rounded-xl px-4 py-3 border border-border">
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-0.5">Original Bill</p>
                    <p className="text-lg font-semibold text-navy line-through opacity-70">₹{result.purchaseAmount}</p>
                  </div>
                </motion.div>

                {/* 2. Rounded Amount */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 1.2 }} 
                  className="flex items-center gap-4 relative z-10"
                >
                  <div className="h-12 w-12 rounded-full bg-navy border border-navy shadow-md flex items-center justify-center shrink-0 text-white">
                    <ArrowDown size={20} />
                  </div>
                  <div className="flex-1 bg-navy/5 rounded-xl px-4 py-3 border border-navy/10">
                    <p className="text-xs text-navy/70 font-medium uppercase tracking-wider mb-0.5">Rounded To</p>
                    <p className="text-xl font-bold text-navy">₹{result.roundedUp}</p>
                  </div>
                </motion.div>

                {/* 3. Merchant Share */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 1.9 }} 
                  className="flex items-center gap-4 relative z-10"
                >
                  <div className="h-12 w-12 rounded-full bg-white border border-border shadow-sm flex items-center justify-center shrink-0 text-text-muted">
                    <Store size={20} />
                  </div>
                  <div className="flex-1 bg-bg/50 rounded-xl px-4 py-3 border border-border">
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-0.5">Merchant Receives</p>
                    <p className="text-lg font-semibold text-navy">₹{result.merchantReceives}</p>
                  </div>
                </motion.div>

                {/* 4. Wallet Transfer (The Wow Moment) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  transition={{ delay: 2.7, type: 'spring', stiffness: 150 }}
                  className="mt-6 flex items-center gap-4 relative z-10"
                >
                  <div className="h-12 w-12 rounded-full bg-mint text-navy shadow-[0_0_15px_rgba(2,195,154,0.4)] flex items-center justify-center shrink-0">
                    <PiggyBank size={20} className="fill-current" />
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-mint/20 to-teal/10 rounded-xl px-4 py-3 border border-mint/30 shadow-sm relative overflow-hidden">
                     {/* Shimmer effect */}
                     <motion.div 
                       className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                       initial={{ x: '-200%' }}
                       animate={{ x: '400%' }}
                       transition={{ delay: 3.0, duration: 0.8, ease: "easeInOut" }}
                     />
                    <p className="text-xs font-bold text-mint uppercase tracking-wider mb-0.5">Transferred to Wallet</p>
                    <p className="text-2xl font-black text-navy drop-shadow-sm">+₹{result.roundup}</p>
                  </div>
                </motion.div>
                
                {result.roundup === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5 }}
                    className="text-xs text-center text-text-muted mt-4 font-medium"
                  >
                    Already rounded — no investment this time.
                  </motion.p>
                )}
              </div>

              {/* New Payment Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.8 }}
              >
                <Button
                  variant="secondary"
                  fullWidth
                  className="py-3 font-semibold"
                  onClick={handleNewPayment}
                >
                  Make Another Payment
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Footer Tagline */}
      <div className="bg-bg/50 border-t border-border px-6 py-4 text-center shrink-0">
        <p className="text-xs font-bold text-navy/40 uppercase tracking-widest flex items-center justify-center gap-2">
          <Sparkles size={12} />
          Every payment grows your future automatically
          <Sparkles size={12} />
        </p>
      </div>
    </Card>
  );
}
