// ============================================
// AIRecommendation — Conversational investment advice
// ============================================
// Generates personalized, conversational investment tips based on:
//   • Investment Wallet amount
//   • Number of transactions
//   • Average round-up per transaction
//   • Savings momentum (growing/slowing)
//
// Feels like a smart friend giving advice — not a static rule table.
// Updates dynamically after every payment.
//
// NOTE: This is rule-based for now. Gemini API integration comes later.
// ============================================

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';
import Card from '../ui/Card.jsx';

// Generate a personalized recommendation based on wallet state
function getRecommendation(walletAmount, transactionCount, avgRoundup) {
  // --- Tier 1: Brand new user, no transactions ---
  if (transactionCount === 0) {
    return {
      icon: Sparkles,
      title: 'Make your first payment!',
      message:
        "Your investment journey starts with a single round-up. Try entering any amount — like ₹163 — and watch the magic happen. Every spare change adds up!",
      accent: 'from-teal/10 to-mint/10',
      borderAccent: 'border-teal/20',
    };
  }

  // --- Tier 2: Just started (1–3 transactions, wallet < ₹50) ---
  if (transactionCount <= 3 && walletAmount < 50) {
    return {
      icon: TrendingUp,
      title: "Great start! You're building a habit.",
      message: `You've saved ₹${walletAmount} across ${transactionCount} payment${transactionCount > 1 ? 's' : ''}. That's an average of ₹${avgRoundup} per round-up. Keep going — consistency beats big one-time deposits every time.`,
      accent: 'from-teal/10 to-mint/10',
      borderAccent: 'border-teal/20',
    };
  }

  // --- Tier 3: Building momentum (wallet ₹50–₹99) ---
  if (walletAmount >= 50 && walletAmount < 100) {
    return {
      icon: Target,
      title: '₹100 is within reach!',
      message: `You've accumulated ₹${walletAmount} — just ₹${100 - walletAmount} away from your first milestone. At your current pace of ₹${avgRoundup} per transaction, you'll hit it in about ${Math.ceil((100 - walletAmount) / (avgRoundup || 1))} more payments. Consider exploring Gold ETFs for safe, small-amount investing.`,
      accent: 'from-mint/10 to-success/10',
      borderAccent: 'border-mint/20',
    };
  }

  // --- Tier 4: Hit ₹100 milestone (₹100–₹299) ---
  if (walletAmount >= 100 && walletAmount < 300) {
    return {
      icon: TrendingUp,
      title: 'You crossed ₹100! Time to think bigger.',
      message: `₹${walletAmount} invested through ${transactionCount} payments — that's real discipline. With this amount, you're ready for a Nifty 50 Index Fund. It tracks India's top 50 companies, and you can start with as little as ₹100. Your money should work as hard as you do.`,
      accent: 'from-mint/10 to-teal/10',
      borderAccent: 'border-mint/20',
    };
  }

  // --- Tier 5: Serious saver (₹300–₹499) ---
  if (walletAmount >= 300 && walletAmount < 500) {
    return {
      icon: Lightbulb,
      title: 'You\'re in the top tier of micro-investors.',
      message: `₹${walletAmount} saved through round-ups alone — most people never get here. With ${transactionCount} transactions averaging ₹${avgRoundup} each, you've built a genuine savings habit. Time to diversify: split future investments between a Gold ETF (30%) and a Nifty 50 ETF (70%).`,
      accent: 'from-navy/10 to-teal/10',
      borderAccent: 'border-navy/20',
    };
  }

  // --- Tier 6: Power saver (₹500+) ---
  return {
    icon: Sparkles,
    title: 'Incredible! You\'re ready for Mutual Funds.',
    message: `₹${walletAmount} invested across ${transactionCount} payments — you've proven serious commitment. At this level, consider diversifying into Mutual Funds for higher long-term returns. A balanced portfolio could include: 40% Nifty 50 ETF, 30% Mid-cap Fund, 20% Gold, and 10% Debt Fund. Your future self will thank you.`,
    accent: 'from-navy/10 to-mint/10',
    borderAccent: 'border-navy/20',
  };
}

export default function AIRecommendation({
  investmentWallet,
  transactionCount,
}) {
  // Calculate average round-up per transaction
  const avgRoundup =
    transactionCount > 0
      ? Math.round(investmentWallet / transactionCount)
      : 0;

  const rec = getRecommendation(investmentWallet, transactionCount, avgRoundup);
  const IconComponent = rec.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card padding="none" className="overflow-hidden">
        {/* Gradient header */}
        <div className={`bg-gradient-to-r ${rec.accent} border-b ${rec.borderAccent} px-6 py-4 flex items-center gap-3`}>
          <div className="h-9 w-9 rounded-xl bg-white/60 flex items-center justify-center">
            <Sparkles size={18} className="text-navy" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-navy">AI Investment Advisor</h3>
            <p className="text-xs text-text-muted">Personalized for you</p>
          </div>
        </div>

        {/* Recommendation content */}
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-mint/10 flex items-center justify-center shrink-0 mt-0.5">
              <IconComponent size={16} className="text-mint" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy mb-1.5">
                {rec.title}
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                {rec.message}
              </p>
            </div>
          </div>

          {/* Quick stats footer */}
          {transactionCount > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center flex-1">
                <p className="text-xs text-text-muted">Avg Round-up</p>
                <p className="text-sm font-semibold text-navy">₹{avgRoundup}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center flex-1">
                <p className="text-xs text-text-muted">Payments</p>
                <p className="text-sm font-semibold text-navy">{transactionCount}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center flex-1">
                <p className="text-xs text-text-muted">Wallet</p>
                <p className="text-sm font-semibold text-mint">₹{investmentWallet}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
