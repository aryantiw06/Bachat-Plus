// ============================================
// WelcomeHeader — Personalized greeting for the dashboard
// ============================================
// Shows a time-aware greeting (Good morning/afternoon/evening),
// the user's display name from Firebase Auth, and the investment
// wallet balance as the primary metric.
//
// Props:
//   investmentWallet — total ₹ in the investment wallet
// ============================================

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AnimatedCounter from '../ui/AnimatedCounter.jsx';

// Returns a greeting based on the current hour
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeHeader({ investmentWallet }) {
  const { user } = useAuth();

  // Use Firebase displayName, fall back to "Investor"
  const firstName = user?.displayName?.split(' ')[0] || 'Investor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
      {/* Left: Greeting + subtitle */}
      <div>
        <p className="text-sm text-text-muted mb-1 flex items-center gap-1.5">
          <Sparkles size={14} className="text-mint" />
          {getGreeting()}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-navy">
          {firstName}, welcome to Bachat
          <span className="text-mint">+</span>
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Every rupee rounded up is a rupee invested in your future.
        </p>
      </div>

      {/* Right: Investment Wallet highlight */}
      <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl px-6 py-4 text-white min-w-[200px]">
        <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
          Investment Wallet
        </p>
        <AnimatedCounter
          value={investmentWallet}
          prefix="₹"
          className="font-display font-extrabold text-2xl md:text-3xl text-mint"
        />
      </div>
    </motion.div>
  );
}
