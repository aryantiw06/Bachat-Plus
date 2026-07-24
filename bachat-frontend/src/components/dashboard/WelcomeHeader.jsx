// ============================================
// WelcomeHeader — Personalized greeting for the dashboard
// ============================================
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AnimatedCounter from '../ui/AnimatedCounter.jsx';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeHeader({ investmentWallet }) {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Investor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
      {/* Left: Greeting + Subtitle */}
      <div>
        <p className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles size={14} className="text-mint" />
          {getGreeting()}
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Every spare change rounded up is automatically invested in your future.
        </p>
      </div>

      {/* Right: Smart Investment Wallet Highlight */}
      <div className="bg-gradient-to-br from-navy via-navy-light to-navy rounded-2xl px-6 py-4 text-white min-w-[220px] shadow-lg border border-navy/10">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-extrabold text-white/70 uppercase tracking-widest">
            Smart Investment Wallet
          </p>
          <ShieldCheck size={14} className="text-mint" />
        </div>
        <AnimatedCounter
          value={investmentWallet}
          prefix="₹"
          className="font-display font-extrabold text-2xl md:text-3xl text-mint block"
        />
      </div>
    </motion.div>
  );
}
