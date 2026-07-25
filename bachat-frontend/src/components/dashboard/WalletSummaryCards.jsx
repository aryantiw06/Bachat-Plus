// ============================================
// WalletSummaryCards — Four key metrics at a glance
// ============================================
// Displays a responsive grid of stat cards:
//   1. Investment Wallet (primary — total round-ups)
//   2. Today's Round-up (today's accumulated savings)
//   3. This Month (monthly total)
//   4. Total Transactions (number of payments made)
//
// All values animate when they change using AnimatedCounter.
// Cards stagger in on first load using Framer Motion.
// ============================================

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, CalendarDays, Receipt } from 'lucide-react';
import Card from '../ui/Card.jsx';
import AnimatedCounter from '../ui/AnimatedCounter.jsx';

// Card configuration — easy to add/modify cards later
const CARD_CONFIG = [
  {
    key: 'wallet',
    label: 'Smart Investment Wallet',
    icon: Wallet,
    iconBg: 'bg-mint/10',
    iconColor: 'text-mint',
    prefix: '₹',
    valueKey: 'investmentWallet',
  },
  {
    key: 'today',
    label: "Today's Round-up",
    icon: TrendingUp,
    iconBg: 'bg-teal/10',
    iconColor: 'text-teal',
    prefix: '₹',
    valueKey: 'todayRoundup',
  },
  {
    key: 'month',
    label: 'This Month',
    icon: CalendarDays,
    iconBg: 'bg-navy/10',
    iconColor: 'text-navy',
    prefix: '₹',
    valueKey: 'monthlyTotal',
  },
  {
    key: 'transactions',
    label: 'Total Transactions',
    icon: Receipt,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    prefix: '',
    valueKey: 'totalTransactions',
  },
];

// Stagger animation — each card appears 0.1s after the previous
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function WalletSummaryCards({ stats }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {CARD_CONFIG.map(({ key, label, icon: Icon, iconBg, iconColor, prefix, valueKey }) => (
        <motion.div key={key} variants={cardVariants}>
          <Card hoverable className={`flex flex-col gap-3 ${key === 'wallet' ? 'bg-gradient-to-br from-mint/10 via-white to-white border-mint/20' : ''}`}>
            {/* Icon badge */}
            <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center`}>
              <Icon size={20} className={iconColor} />
            </div>

            {/* Animated value */}
            <AnimatedCounter
              value={stats[valueKey] || 0}
              prefix={prefix}
              className="font-display font-extrabold text-xl md:text-2xl text-navy"
            />

            {/* Label */}
            <p className="text-xs text-text-muted font-medium">{label}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
