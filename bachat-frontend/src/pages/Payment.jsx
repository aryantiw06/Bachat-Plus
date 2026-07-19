// ============================================
// Payment.jsx — Premium Dedicated Payment Page
// ============================================
// A full-page payment experience modeled after GPay/CRED.
// Uses the global WalletContext to process payments and
// immediately update Dashboard stats across the app.
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext.jsx';
import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Store,
  PiggyBank,
  Coffee,
  ShoppingBag,
  Zap,
  Car,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

// Categories for the payment
const CATEGORIES = [
  { id: 'food', label: 'Food', icon: Coffee },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'utility', label: 'Utility', icon: Zap },
];

const STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
};

export default function Payment() {
  const navigate = useNavigate();
  const { processRoundUpPayment } = useWallet();

  const [flowState, setFlowState] = useState(STATES.IDLE);
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('food');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Live round-up calculation
  const purchaseAmount = parseFloat(amount) || 0;
  const roundedUp = purchaseAmount > 0 ? Math.ceil(purchaseAmount / 10) * 10 : 0;
  const roundupAmount = purchaseAmount > 0 ? roundedUp - purchaseAmount : 0;

  function validate() {
    if (!merchant.trim()) return 'Please enter a merchant name.';
    if (!amount || purchaseAmount <= 0) return 'Please enter a valid amount.';
    if (purchaseAmount > 100000) return 'Maximum amount is ₹1,00,000.';
    return '';
  }

  async function handlePay(e) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setFlowState(STATES.PROCESSING);

    // Realistic processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const transaction = {
      id: Date.now(),
      merchantName: merchant.trim(),
      category,
      purchaseAmount,
      roundedUp,
      roundup: roundupAmount,
      merchantReceives: purchaseAmount,
      timestamp: new Date(),
    };

    setResult(transaction);
    setFlowState(STATES.COMPLETE);
    processRoundUpPayment(transaction);
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <PageHeader
        title="Make a Payment"
        subtitle="Pay anywhere. Invest the spare change automatically."
      />

      <AnimatePresence mode="wait">
        {/* ===== IDLE STATE — Form ===== */}
        {flowState === STATES.IDLE && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-bg shadow-sm border border-border rounded-2xl p-6 md:p-8"
          >
            <form onSubmit={handlePay} className="space-y-8">
              {/* Merchant & Category Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Merchant Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store size={18} className="text-text-muted" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent transition-all"
                      placeholder="e.g. Starbucks"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Category</label>
                  <div className="flex gap-2">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                            isActive
                              ? 'bg-navy text-white border-navy shadow-md scale-[1.02]'
                              : 'bg-white text-text-muted border-border hover:bg-bg'
                          }`}
                        >
                          <Icon size={18} className="mb-1" />
                          <span className="text-[10px] font-semibold tracking-wide uppercase">
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Huge Amount Input Section (GPay style) */}
              <div className="flex flex-col items-center justify-center pt-6 pb-2 border-y border-border/50">
                <span className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-widest">
                  Enter Amount
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-light text-text-muted">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="0"
                    className="w-[180px] md:w-[240px] text-5xl md:text-7xl font-display font-bold text-navy bg-transparent border-none p-0 focus:ring-0 text-center placeholder:text-text-muted/30"
                    autoFocus
                  />
                </div>
              </div>

              {/* Live Calculator Banner */}
              <div className="min-h-[64px]">
                {purchaseAmount > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-mint/10 to-teal/10 border border-mint/20 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-mint/20 rounded-full flex items-center justify-center">
                        <PiggyBank size={20} className="text-mint" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy">Round-up Investment</p>
                        <p className="text-xs text-navy/70">Automatic transfer to your wallet</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-mint">+₹{roundupAmount}</p>
                      <p className="text-[10px] font-bold uppercase text-navy/50">Total Bill: ₹{roundedUp}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-text-muted">
                    Enter an amount to see your auto-investment.
                  </div>
                )}
              </div>

              {/* Error & Submit */}
              <div className="pt-2">
                {error && <p className="text-danger text-sm font-medium mb-4 text-center">{error}</p>}
                
                <Button
                  type="submit"
                  variant="accent"
                  fullWidth
                  className="py-4 text-lg shadow-xl shadow-mint/20"
                >
                  <CreditCard size={20} className="mr-2" />
                  Proceed to Pay {purchaseAmount ? `₹${roundedUp}` : ''}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ===== PROCESSING STATE ===== */}
        {flowState === STATES.PROCESSING && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-mint"
              />
              <div className="relative h-24 w-24 rounded-full bg-navy flex items-center justify-center shadow-xl shadow-navy/20">
                <Store size={32} className="text-white" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-mint border-r-mint/50"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-navy mb-2">Connecting to Merchant</h2>
            <p className="text-text-muted">Securely processing your payment to {merchant}</p>
          </motion.div>
        )}

        {/* ===== COMPLETE STATE ===== */}
        {flowState === STATES.COMPLETE && result && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-border"
          >
            {/* Top Green Success Section */}
            <div className="bg-success/10 pt-10 pb-8 px-6 flex flex-col items-center text-center relative overflow-hidden">
              {/* Confetti / Sparkle background effects could go here */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="h-20 w-20 bg-success rounded-full flex items-center justify-center text-white shadow-xl shadow-success/30 mb-6 relative z-10"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-navy mb-1 relative z-10"
              >
                Payment Successful
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-text-muted relative z-10"
              >
                Paid to <span className="font-semibold text-navy">{result.merchantName}</span>
              </motion.p>
            </div>

            {/* Receipt Details */}
            <div className="p-6 md:p-8 space-y-6 bg-bg/30">
              
              <div className="flex justify-between items-center border-b border-border/60 pb-6">
                <span className="text-text-muted font-medium">Total Deducted</span>
                <span className="text-2xl font-bold text-navy">₹{result.roundedUp}</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Merchant Received</span>
                  <span className="font-semibold text-navy">₹{result.merchantReceives}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Category</span>
                  <span className="font-semibold text-navy capitalize">{result.category}</span>
                </div>
              </div>

              {/* The Auto-Investment Highlight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="mt-6 bg-gradient-to-r from-navy to-navy-light rounded-2xl p-5 text-white flex items-center justify-between shadow-lg relative overflow-hidden"
              >
                {/* Shine effect */}
                <motion.div 
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  initial={{ x: '-200%' }}
                  animate={{ x: '300%' }}
                  transition={{ delay: 1.5, duration: 1 }}
                />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-12 w-12 bg-mint/20 rounded-xl flex items-center justify-center border border-mint/30">
                    <PiggyBank size={24} className="text-mint" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-mint uppercase tracking-wider mb-0.5">Invested</p>
                    <p className="text-sm font-medium text-white/80">Added to your wealth</p>
                  </div>
                </div>
                <div className="text-2xl font-black text-mint relative z-10">
                  +₹{result.roundup}
                </div>
              </motion.div>

            </div>

            {/* Actions */}
            <div className="p-6 bg-white border-t border-border flex gap-4">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => {
                  setAmount('');
                  setMerchant('');
                  setResult(null);
                  setFlowState(STATES.IDLE);
                }}
              >
                Pay Again
              </Button>
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}