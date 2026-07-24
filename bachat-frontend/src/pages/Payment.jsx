// ============================================
// Payment.jsx — Advanced Payment Checkout Page
// ============================================
// Full checkout experience supporting multiple payment channels (UPI, NetBanking, Cards).
// Executes through `processRoundUpPayment` in WalletContext.
// Terminology: Unified to "Smart Investment Wallet".
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
  ShieldCheck,
  Building2,
  QrCode,
  FileText,
  Lock,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';

const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: Coffee },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'transport', label: 'Travel & Transport', icon: Car },
  { id: 'utility', label: 'Utility & Bills', icon: Zap },
];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI Instant', icon: QrCode, desc: 'Google Pay, PhonePe, BHIM' },
  { id: 'card', label: 'Debit / Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'NetBanking', icon: Building2, desc: 'HDFC, ICICI, SBI, Axis' },
];

const STATES = {
  IDLE: 'idle',
  CONFIRMING: 'confirming',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
};

export default function Payment() {
  const navigate = useNavigate();
  const { processRoundUpPayment, transactions } = useWallet();

  const [flowState, setFlowState] = useState(STATES.IDLE);
  const [amount, setAmount] = useState('458');
  const [merchant, setMerchant] = useState('Reliance Digital');
  const [category, setCategory] = useState('shopping');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Live round-up calculation
  const purchaseAmount = parseFloat(amount) || 0;
  const roundedUp = purchaseAmount > 0 ? Math.ceil(purchaseAmount / 10) * 10 : 0;
  const roundupAmount = purchaseAmount > 0 ? roundedUp - purchaseAmount : 0;

  function validate() {
    if (!merchant.trim()) return 'Please specify the payee / merchant name.';
    if (!amount || purchaseAmount <= 0) return 'Please enter a valid payment amount.';
    if (purchaseAmount > 100000) return 'Maximum transaction limit is ₹1,00,000.';
    return '';
  }

  function handleProceedToConfirm(e) {
    e.preventDefault();
    const valErr = validate();
    if (valErr) {
      setError(valErr);
      return;
    }
    setError('');
    setFlowState(STATES.CONFIRMING);
  }

  async function handleExecutePayment() {
    setFlowState(STATES.PROCESSING);

    try {
      const transactionPayload = {
        purchaseAmount,
        merchantName: merchant.trim(),
        category,
        paymentMethod,
        notes: notes.trim(),
      };

      const apiResult = await processRoundUpPayment(transactionPayload);

      if (apiResult && apiResult.success) {
        const txn = apiResult.transaction;
        setResult({
          id: txn.id,
          merchantName: txn.merchant,
          category: txn.category || category,
          purchaseAmount: txn.amount,
          roundedUp: (txn.amount || 0) + (txn.roundUp || 0),
          roundup: txn.roundUp,
          timestamp: new Date(txn.createdAt || Date.now()),
        });
        setFlowState(STATES.COMPLETE);
      } else {
        setError(apiResult?.error || 'Payment execution rejected by backend service.');
        setFlowState(STATES.IDLE);
      }
    } catch (err) {
      setError(err.message || 'Error executing payment request.');
      setFlowState(STATES.IDLE);
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      <PageHeader
        title="Advanced Payment Checkout"
        subtitle="Pay merchants using UPI, Cards, or NetBanking. Spare change auto-invests directly into your Smart Investment Wallet."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Main Payment Section (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">

            {/* IDLE FORM */}
            {flowState === STATES.IDLE && (
              <motion.div
                key="idle-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xl space-y-6"
              >
                <form onSubmit={handleProceedToConfirm} className="space-y-6">

                  {/* Merchant & Amount */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        Payee / Merchant Name
                      </label>
                      <div className="relative">
                        <Store size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="text"
                          value={merchant}
                          onChange={(e) => setMerchant(e.target.value)}
                          placeholder="e.g. Starbucks, Amazon, Zomato"
                          className="w-full pl-10 pr-4 py-3 bg-bg border border-border/80 rounded-xl font-bold text-navy text-sm focus:ring-2 focus:ring-mint focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        Payment Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 bg-bg border border-border/80 rounded-xl font-extrabold text-2xl text-navy focus:ring-2 focus:ring-mint focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                      Select Expense Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-navy text-white border-navy shadow-md ring-2 ring-mint/40'
                                : 'bg-bg text-text-muted border-border/80 hover:bg-white hover:text-navy'
                            }`}
                          >
                            <Icon size={18} className="mb-1" />
                            <span className="text-[11px] font-bold truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {PAYMENT_METHODS.map((pm) => {
                        const Icon = pm.icon;
                        const isSelected = paymentMethod === pm.id;
                        return (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => setPaymentMethod(pm.id)}
                            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                              isSelected
                                ? 'bg-navy/5 border-navy text-navy ring-2 ring-mint/30'
                                : 'bg-bg/40 border-border/80 text-text-muted hover:border-navy/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Icon size={18} className={isSelected ? 'text-navy' : 'text-text-muted'} />
                              {isSelected && <CheckCircle2 size={16} className="text-emerald-600" />}
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-navy">{pm.label}</p>
                              <p className="text-[10px] text-text-muted">{pm.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Description / Reference (Optional)
                    </label>
                    <div className="relative">
                      <FileText size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Monthly grocery bill"
                        className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border/80 rounded-xl font-medium text-navy text-xs focus:ring-2 focus:ring-mint focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                      ⚠️ {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="accent"
                    fullWidth
                    className="py-3.5 text-base font-extrabold shadow-lg shadow-mint/20"
                  >
                    Review & Pay ₹{roundedUp.toLocaleString('en-IN')}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* CONFIRMATION DRAWER STATE */}
            {flowState === STATES.CONFIRMING && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-navy text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                    <ShieldCheck size={20} className="text-mint" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Confirm Checkout</h3>
                    <p className="text-xs text-white/70">Verify details before authorization</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/70">Payee</span>
                    <span className="font-bold text-white">{merchant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Payment Channel</span>
                    <span className="font-bold text-white uppercase">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Base Bill</span>
                    <span className="font-semibold text-white">₹{purchaseAmount}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/15">
                    <span className="font-bold text-mint">Smart Investment Wallet</span>
                    <span className="font-extrabold text-mint">+₹{roundupAmount}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/20 text-sm font-extrabold text-white">
                    <span>Total Deducted</span>
                    <span>₹{roundedUp}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1 text-white border border-white/20 hover:bg-white/10" onClick={() => setFlowState(STATES.IDLE)}>
                    Back to Edit
                  </Button>
                  <Button variant="accent" className="flex-1 font-extrabold" onClick={handleExecutePayment}>
                    <Lock size={16} className="mr-1.5" /> Authorize Pay
                  </Button>
                </div>
              </motion.div>
            )}

            {/* PROCESSING STATE */}
            {flowState === STATES.PROCESSING && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl p-12 text-center border border-border shadow-xl space-y-4"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute inset-0 rounded-full bg-mint"
                  />
                  <div className="relative h-20 w-20 rounded-full bg-navy text-white flex items-center justify-center shadow-lg">
                    <CreditCard size={32} className="text-mint" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-navy">Processing Advanced Checkout…</h3>
                <p className="text-xs text-text-muted">Connecting securely to bank gateway</p>
              </motion.div>
            )}

            {/* COMPLETE STATE */}
            {flowState === STATES.COMPLETE && result && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xl text-center space-y-6"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-navy">Payment Authorized</h3>
                  <p className="text-xs text-text-muted mt-1">Transaction ID: {result.id}</p>
                </div>

                <div className="bg-bg rounded-2xl p-5 border border-border/80 text-xs text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Merchant</span>
                    <span className="font-bold text-navy">{result.merchantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Base Amount</span>
                    <span className="font-semibold text-navy">₹{result.purchaseAmount}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-extrabold text-emerald-700 flex items-center gap-1.5">
                      <PiggyBank size={16} /> Smart Investment Wallet
                    </span>
                    <span className="font-extrabold text-emerald-700">+₹{result.roundup} Auto-Invested</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1 text-xs font-bold" onClick={() => setFlowState(STATES.IDLE)}>
                    Make Another Payment
                  </Button>
                  <Button variant="accent" className="flex-1 text-xs font-bold" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Section — Live Summary & Recent Activity (4 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Live Summary Card */}
          <div className="bg-gradient-to-br from-navy via-navy to-navy-light rounded-3xl p-6 text-white shadow-xl border border-navy/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-white/70">Payment Summary</span>
              <ShieldCheck size={18} className="text-mint" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-white/70">Purchase Amount</span>
                <span className="font-bold text-white">₹{purchaseAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Smart Investment Wallet</span>
                <span className="font-extrabold text-mint">+₹{roundupAmount}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/15 text-sm font-extrabold text-white">
                <span>Total Deduction</span>
                <span>₹{roundedUp}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/15 text-[11px] text-white/80 flex items-center gap-2">
              <PiggyBank size={16} className="text-mint shrink-0" />
              <span>Round-up is automatically invested into low-risk Gold & Nifty index funds.</span>
            </div>
          </div>

          {/* Recent Payments Preview */}
          <RecentTransactions transactions={transactions} />

        </div>

      </div>
    </div>
  );
}