// ============================================
// WelcomeHeader — Personalized greeting for the dashboard
// ============================================
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';
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
      className="relative overflow-hidden flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-5 p-6 md:p-7 rounded-3xl border border-navy/10 bg-gradient-to-br from-white via-white to-mint/10 shadow-[0_18px_50px_rgba(10,46,92,0.08)]"
    >
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-mint/15 blur-3xl pointer-events-none" />
      <div className="absolute right-24 -bottom-20 h-40 w-40 rounded-full bg-teal/10 blur-3xl pointer-events-none" />
      {/* Left: Greeting + Subtitle */}
      <div className="relative z-10">
        <p className="text-[11px] font-bold text-text-muted mb-2 flex items-center gap-1.5 uppercase tracking-[0.16em]">
          <Sparkles size={14} className="text-mint" />
          {getGreeting()}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-text-muted mt-2 max-w-lg leading-relaxed">
          Every spare change rounded up is automatically invested in your future.
        </p>
      </div>

      {/* Right: Smart Investment Wallet Highlight */}
      <div className="relative z-10 bg-gradient-to-br from-navy via-navy-light to-navy rounded-2xl px-6 py-5 text-white min-w-[235px] shadow-xl shadow-navy/20 border border-white/10">
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
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-white/65 uppercase tracking-wider">
          <TrendingUp size={12} className="text-mint" /> Ready to grow
        </div>
      </div>
    </motion.div>
  );
}
