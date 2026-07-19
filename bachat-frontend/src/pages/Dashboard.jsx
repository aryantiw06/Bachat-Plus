// ============================================
// Dashboard.jsx — Main Bachat+ Dashboard Page
// ============================================
// The orchestrator: manages all shared React state and composes
// every dashboard component. State lives here and flows down as props.
//
// State architecture (frontend-only, no backend):
//   • investmentWallet  — total ₹ from round-ups (starts at 0)
//   • todayRoundup      — sum of today's round-ups
//   • monthlyTotal      — monthly total (same as today for demo)
//   • transactions[]    — array of recent payments (max 10)
//
// When a payment is made in PaymentSimulator:
//   1. PaymentSimulator calls onPayment(transaction)
//   2. Dashboard updates all state
//   3. All child components re-render with new values
//   4. Animated counters, cards, and badges react automatically
// ============================================

import { useWallet } from '../contexts/WalletContext.jsx';
import WelcomeHeader from '../components/dashboard/WelcomeHeader.jsx';
import WalletSummaryCards from '../components/dashboard/WalletSummaryCards.jsx';
import PaymentSimulator from '../components/dashboard/PaymentSimulator.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import AIRecommendation from '../components/dashboard/AIRecommendation.jsx';
import Achievements from '../components/dashboard/Achievements.jsx';
import HealthScore from '../components/dashboard/HealthScore.jsx';

export default function Dashboard() {
  // ---- Core State ----
  // Consume state from the global WalletContext
  const {
    investmentWallet,
    todayRoundup,
    monthlyTotal,
    transactions,
    totalTransactions,
    loadingWallet,
    processRoundUpPayment,
  } = useWallet();

  // ---- Derived Values ----
  // Stats object passed to WalletSummaryCards
  const stats = {
    investmentWallet,
    todayRoundup,
    monthlyTotal,
    totalTransactions,
  };

  if (loadingWallet) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mint border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ---- Row 1: Welcome Header ---- */}
      <WelcomeHeader investmentWallet={investmentWallet} />

      {/* ---- Row 2: Wallet Summary Cards ---- */}
      <WalletSummaryCards stats={stats} />

      {/* ---- Row 3: Main Content Grid ---- */}
      {/* 2-column on desktop: left (payment + transactions), right (AI + badges + health) */}
      {/* Single column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column — spans 3 of 5 columns */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Payment Simulator — the core feature */}
          <PaymentSimulator onPayment={processRoundUpPayment} />

          {/* Recent Transactions */}
          <RecentTransactions transactions={transactions} />
        </div>

        {/* Right Column — spans 2 of 5 columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* AI Recommendation — conversational tips */}
          <AIRecommendation
            investmentWallet={investmentWallet}
            transactionCount={transactions.length}
          />

          {/* Achievements — gamification badges */}
          <Achievements
            investmentWallet={investmentWallet}
            transactionCount={transactions.length}
          />

          {/* Financial Health Score — circular progress */}
          <HealthScore
            investmentWallet={investmentWallet}
            transactionCount={transactions.length}
          />
        </div>
      </div>
    </div>
  );
}