// ============================================
// PaymentSimulator.jsx — UPI Quick Pay Experience (Dashboard)
// ============================================
// Redesigned as a tier-1 UPI Quick Pay experience inspired by
// Google Pay, PhonePe, BHIM, and CRED.
//
// Modes:
//   1. Demo Merchants — One-tap selection (Blinkit, Cafe Coffee Day, Reliance Fresh, Amazon, Apollo Pharmacy, Domino's)
//   2. Scan QR — Interactive simulated QR camera viewfinder overlay
//   3. Upload QR — Simulated QR image picker
//   4. UPI ID — Direct UPI ID payment
//
// Single Source of Truth: Executes via `onPayment` callback (processRoundUpPayment in WalletContext).
// Terminology: Unified to "Smart Investment Wallet".
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Upload,
  AtSign,
  Store,
  CheckCircle2,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Coffee,
  ShoppingBag,
  Zap,
  Car,
  Camera,
  X,
  IndianRupee,
  ShieldCheck,
  Zap as FlashIcon,
} from 'lucide-react';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

// Preset realistic merchants for quick demo
const DEMO_MERCHANTS = [
  { name: 'Blinkit', category: 'shopping', amount: '243', icon: ShoppingBag, color: 'bg-emerald-500', upi: 'blinkit@icici' },
  { name: 'Cafe Coffee Day', category: 'food', amount: '163', icon: Coffee, color: 'bg-orange-500', upi: 'ccd@hdfcbank' },
  { name: 'Reliance Fresh', category: 'shopping', amount: '487', icon: ShoppingBag, color: 'bg-blue-500', upi: 'reliancefresh@sbi' },
  { name: 'Amazon India', category: 'shopping', amount: '899', icon: ShoppingBag, color: 'bg-amber-500', upi: 'amazon@appl' },
  { name: 'Apollo Pharmacy', category: 'utility', amount: '315', icon: Zap, color: 'bg-rose-500', upi: 'apollopharmacy@icici' },
  { name: 'Domino\'s Pizza', category: 'food', amount: '542', icon: Coffee, color: 'bg-indigo-500', upi: 'dominos@okaxis' },
];

const MODES = {
  MERCHANTS: 'merchants',
  SCAN: 'scan',
  UPLOAD: 'upload',
  UPI_ID: 'upi_id',
};

const STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
};

export default function PaymentSimulator({ onPayment }) {
  const [activeMode, setActiveMode] = useState(MODES.MERCHANTS);
  const [merchantName, setMerchantName] = useState('Cafe Coffee Day');
  const [category, setCategory] = useState('food');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('163');

  const [flowState, setFlowState] = useState(STATES.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showQrScanModal, setShowQrScanModal] = useState(false);

  // Live round-up calculation
  const purchaseAmount = parseFloat(amount) || 0;
  const roundedUp = purchaseAmount > 0 ? Math.ceil(purchaseAmount / 10) * 10 : 0;
  const roundupAmount = purchaseAmount > 0 ? roundedUp - purchaseAmount : 0;

  function selectMerchant(m) {
    setMerchantName(m.name);
    setCategory(m.category);
    setAmount(m.amount);
    setUpiId(m.upi);
    setError('');
  }

  async function handlePay(e) {
    if (e) e.preventDefault();

    if (!merchantName.trim()) {
      setError('Please enter or select a merchant.');
      return;
    }
    if (!amount || purchaseAmount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }
    if (purchaseAmount > 100000) {
      setError('Maximum limit per UPI payment is ₹1,00,000.');
      return;
    }

    setError('');
    setFlowState(STATES.PROCESSING);

    // Simulated short network latency
    await new Promise((res) => setTimeout(res, 1200));

    const res = await onPayment({
      purchaseAmount,
      merchantName: merchantName.trim(),
      category,
    });

    if (!res?.success) {
      setError(res?.error || 'Payment execution failed.');
      setFlowState(STATES.IDLE);
      return;
    }

    const txn = res.transaction;
    setResult({
      id: txn.id,
      merchantName: txn.merchant,
      category: txn.category || category,
      purchaseAmount: txn.amount,
      roundedUp: txn.amount + txn.roundUp,
      roundup: txn.roundUp,
      timestamp: new Date(txn.createdAt || Date.now()),
    });
    setFlowState(STATES.COMPLETE);
  }

  function handleReset() {
    setAmount('163');
    setFlowState(STATES.IDLE);
    setResult(null);
    setError('');
  }

  return (
    <Card padding="none" className="overflow-hidden border border-border/80 shadow-xl flex flex-col h-full bg-white">

      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-navy-light to-navy px-6 py-6 text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-36 h-36 bg-mint/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15 backdrop-blur-md shadow-inner">
              <QrCode size={22} className="text-mint" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">UPI Quick Pay</h3>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/30">
                  Instant
                </span>
              </div>
              <p className="text-xs text-white/70">Spare change auto-saved to Smart Investment Wallet</p>
            </div>
          </div>

          <ShieldCheck size={20} className="text-white/40 hidden sm:block" />
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 mt-5 p-1 bg-white/10 rounded-xl border border-white/15 text-xs font-semibold">
          {[
            { id: MODES.MERCHANTS, label: 'Merchants', icon: Store },
            { id: MODES.SCAN, label: 'Scan QR', icon: QrCode },
            { id: MODES.UPLOAD, label: 'Upload QR', icon: Upload },
            { id: MODES.UPI_ID, label: 'UPI ID', icon: AtSign },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setActiveMode(mode.id);
                  if (mode.id === MODES.SCAN) setShowQrScanModal(true);
                }}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-white text-navy font-bold shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span className="truncate">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait">

          {/* ===== IDLE STATE ===== */}
          {flowState === STATES.IDLE && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              {/* Quick Select Merchant Chips */}
              {activeMode === MODES.MERCHANTS && (
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-text-muted mb-2">
                    Tap Demo Merchant
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_MERCHANTS.map((m) => {
                      const isSelected = merchantName === m.name;
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => selectMerchant(m)}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            isSelected
                              ? 'bg-navy text-white border-navy shadow-md ring-2 ring-mint/40'
                              : 'bg-bg text-navy border-border/80 hover:bg-white hover:border-navy/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-white text-xs ${m.color}`}>
                              <Icon size={12} />
                            </span>
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-mint' : 'text-text-muted'}`}>₹{m.amount}</span>
                          </div>
                          <p className="text-xs font-bold truncate">{m.name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* UPI ID Mode Form */}
              {activeMode === MODES.UPI_ID && (
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Enter UPI VPA ID</label>
                  <Input
                    type="text"
                    placeholder="e.g. merchant@icici or 9876543210@upi"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setMerchantName(e.target.value.split('@')[0] || 'UPI Payee');
                    }}
                    className="text-sm font-semibold"
                  />
                </div>
              )}

              {/* Upload QR Mode */}
              {activeMode === MODES.UPLOAD && (
                <div
                  onClick={() => {
                    const randomMerchant = DEMO_MERCHANTS[Math.floor(Math.random() * DEMO_MERCHANTS.length)];
                    selectMerchant(randomMerchant);
                  }}
                  className="border-2 border-dashed border-border hover:border-mint rounded-2xl p-6 text-center cursor-pointer bg-bg/40 hover:bg-mint/5 transition-all"
                >
                  <Upload size={28} className="text-mint mx-auto mb-2" />
                  <p className="text-xs font-bold text-navy">Click to Upload Merchant QR Image</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Supports PNG, JPG, WebP QR codes</p>
                </div>
              )}

              {/* Payment Details Form */}
              <form onSubmit={handlePay} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1">Payee / Merchant</label>
                    <input
                      type="text"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      placeholder="Merchant Name"
                      className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl font-bold text-navy text-sm focus:ring-2 focus:ring-mint focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Bill Amount"
                      className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl font-extrabold text-navy text-sm focus:ring-2 focus:ring-mint focus:outline-none"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    ⚠️ {error}
                  </p>
                )}

                {/* Live Round-up Preview Badge */}
                {purchaseAmount > 0 && (
                  <div className="bg-mint/10 border border-mint/20 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <PiggyBank size={16} className="text-emerald-700 shrink-0" />
                      <span className="text-navy font-semibold">Round-up Transfer</span>
                    </div>
                    <span className="font-extrabold text-emerald-700">+₹{roundupAmount} auto-saved</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="accent"
                  fullWidth
                  className="py-3 text-sm font-extrabold shadow-md shadow-mint/20"
                >
                  <FlashIcon size={16} className="mr-1.5" />
                  Pay ₹{purchaseAmount.toLocaleString('en-IN')} via UPI
                </Button>
              </form>
            </motion.div>
          )}

          {/* ===== PROCESSING STATE ===== */}
          {flowState === STATES.PROCESSING && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-10 text-center space-y-4"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute inset-0 rounded-full bg-mint"
                />
                <div className="relative h-16 w-16 rounded-2xl bg-navy text-white flex items-center justify-center shadow-lg">
                  <QrCode size={28} className="text-mint" />
                </div>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-navy">Processing UPI Payment…</h4>
                <p className="text-xs text-text-muted mt-0.5">Deducting ₹{purchaseAmount} & auto-saving ₹{roundupAmount}</p>
              </div>
            </motion.div>
          )}

          {/* ===== COMPLETE STATE ===== */}
          {flowState === STATES.COMPLETE && result && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-center"
            >
              <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-navy">Payment Successful</h4>
                <p className="text-xs text-text-muted">Paid ₹{result.purchaseAmount} to {result.merchantName}</p>
              </div>

              {/* Transaction Yield Breakdown */}
              <div className="bg-bg rounded-2xl p-4 border border-border/80 space-y-2 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-text-muted">Merchant Amount</span>
                  <span className="font-semibold text-navy">₹{result.purchaseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Deducted</span>
                  <span className="font-bold text-navy">₹{result.roundedUp}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/60">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <PiggyBank size={14} /> Smart Investment Wallet
                  </span>
                  <span className="font-extrabold text-emerald-700">+₹{result.roundup} Saved</span>
                </div>
              </div>

              <Button variant="secondary" fullWidth onClick={handleReset} className="py-2.5 text-xs font-bold">
                Make Another Payment <ArrowRight size={14} className="ml-1" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulated Camera Viewfinder Modal */}
      <AnimatePresence>
        {showQrScanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-navy text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/20 relative text-center"
            >
              <button
                onClick={() => setShowQrScanModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>

              <Camera size={28} className="text-mint mx-auto mb-3" />
              <h4 className="text-lg font-bold">Scan Merchant QR Code</h4>
              <p className="text-xs text-white/70 mb-5">Point your camera at any UPI QR code</p>

              {/* Simulated Camera Viewfinder */}
              <div className="relative w-48 h-48 mx-auto mb-5 rounded-2xl border-2 border-dashed border-mint/60 flex items-center justify-center overflow-hidden bg-black/40">
                <motion.div
                  animate={{ y: [-90, 90, -90] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute left-0 right-0 h-0.5 bg-mint shadow-[0_0_10px_#02c39a]"
                />
                <QrCode size={80} className="text-white/30" />
              </div>

              <Button
                variant="accent"
                fullWidth
                onClick={() => {
                  const m = DEMO_MERCHANTS[0]; // Blinkit
                  selectMerchant(m);
                  setShowQrScanModal(false);
                }}
              >
                Auto-Scan Demo Merchant (Blinkit)
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}
