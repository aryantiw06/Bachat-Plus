// ============================================
// Achievements — Gamification badges for Bachat+
// ============================================
// Displays unlockable achievement badges based on user progress.
// Locked badges are greyed out; unlocked badges animate in with a glow.
//
// Badges:
//   🏅 First Investment — first round-up completed (roundup > 0)
//   💯 Saved ₹100 — Investment Wallet ≥ 100
//   🔟 10 Payments — 10 transactions completed
//   🔥 Streak Master — 5+ transactions (demo proxy for "first week")
//
// Designed for hackathon impact — visual, animated, immediate feedback.
// ============================================

import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Star } from 'lucide-react';
import Card from '../ui/Card.jsx';

// Badge definitions — easy to add more later
const BADGES = [
  {
    id: 'first-investment',
    label: 'First Investment',
    description: 'Complete your first round-up',
    icon: Star,
    check: (wallet, txCount) => txCount > 0 && wallet > 0,
  },
  {
    id: 'saved-100',
    label: 'Saved ₹100',
    description: 'Accumulate ₹100 in your wallet',
    icon: Target,
    check: (wallet) => wallet >= 100,
  },
  {
    id: '10-payments',
    label: '10 Payments',
    description: 'Complete 10 transactions',
    icon: Trophy,
    check: (_wallet, txCount) => txCount >= 10,
  },
  {
    id: 'streak',
    label: 'Streak Master',
    description: 'Make 5 consecutive payments',
    icon: Flame,
    check: (_wallet, txCount) => txCount >= 5,
  },
];

// Stagger animation for the badge grid
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200 } },
};

export default function Achievements({ investmentWallet, transactionCount }) {
  // Calculate how many badges are unlocked
  const unlockedCount = BADGES.filter((b) =>
    b.check(investmentWallet, transactionCount)
  ).length;

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-warning" />
          <h3 className="font-semibold text-sm text-navy">Achievements</h3>
        </div>
        <span className="text-xs font-medium text-text-muted">
          {unlockedCount}/{BADGES.length} unlocked
        </span>
      </div>

      {/* Badge grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 p-5"
      >
        {BADGES.map((badge) => {
          const unlocked = badge.check(investmentWallet, transactionCount);
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.id}
              variants={badgeVariants}
              className={`
                relative flex flex-col items-center gap-2 rounded-xl p-4 text-center
                transition-all duration-300
                ${unlocked
                  ? 'bg-gradient-to-br from-mint/10 to-teal/5 border border-mint/20'
                  : 'bg-bg border border-border opacity-50'
                }
              `}
            >
              {/* Glow effect for unlocked badges */}
              {unlocked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-mint flex items-center justify-center"
                >
                  <span className="text-[10px] text-white">✓</span>
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`
                  h-10 w-10 rounded-full flex items-center justify-center
                  ${unlocked ? 'bg-mint/15' : 'bg-border/50'}
                `}
              >
                <Icon
                  size={18}
                  className={unlocked ? 'text-mint' : 'text-text-muted/40'}
                />
              </div>

              {/* Label */}
              <p
                className={`text-xs font-semibold leading-tight ${
                  unlocked ? 'text-navy' : 'text-text-muted/50'
                }`}
              >
                {badge.label}
              </p>

              {/* Description */}
              <p
                className={`text-[10px] leading-tight ${
                  unlocked ? 'text-text-muted' : 'text-text-muted/40'
                }`}
              >
                {badge.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </Card>
  );
}
