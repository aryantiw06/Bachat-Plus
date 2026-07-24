// ============================================
// Notifications.jsx — Full Notifications Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Trash2,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Crown,
  Shield,
  Filter,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: '₹7 invested automatically',
    body: 'Your round-up from Starbucks payment of ₹163 was added to your Smart Investment Wallet.',
    category: 'savings',
    time: '10 mins ago',
    unread: true,
    icon: PiggyBank,
    color: 'text-mint bg-mint/10 border-mint/20',
  },
  {
    id: 2,
    title: 'Gold ETF Investment Ready',
    body: 'Your wallet balance reached ₹100! You can now start building a digital gold portfolio.',
    category: 'investments',
    time: '2 hours ago',
    unread: true,
    icon: TrendingUp,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    id: 3,
    title: 'Goal Milestone Achieved',
    body: 'Emergency Fund goal progress reached 35%. You are 42% faster than average savers.',
    category: 'savings',
    time: '1 day ago',
    unread: true,
    icon: Sparkles,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    id: 4,
    title: 'Bachat+ Pro Feature Active',
    body: 'Welcome to Bachat+ Pro! Your AI Wealth Coach Pro is now analyzing your spending.',
    category: 'premium',
    time: '2 days ago',
    unread: false,
    icon: Crown,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    id: 5,
    title: 'Security Alert: AutoPay Verified',
    body: 'Your UPI AutoPay mandate for round-up micro-deposits was successfully verified.',
    category: 'system',
    time: '3 days ago',
    unread: false,
    icon: Shield,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'savings', label: 'Savings' },
  { id: 'investments', label: 'Investments' },
  { id: 'premium', label: 'Premium' },
  { id: 'system', label: 'System' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.category === filter);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markSingleAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your investments, goals, and AI insights"
        badge={unreadCount > 0 ? `${unreadCount} New` : null}
      />

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">

        {/* Filter & Actions Bar */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === cat.id
                      ? 'bg-navy text-white shadow-sm'
                      : 'bg-bg text-text-muted hover:text-navy hover:bg-navy/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {unreadCount > 0 && (
                <Button variant="secondary" size="sm" onClick={markAllAsRead}>
                  <CheckCheck size={14} className="mr-1" /> Mark All Read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-text-muted hover:text-danger">
                  <Trash2 size={14} className="mr-1" /> Clear All
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <Card padding="none">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-bg flex items-center justify-center mx-auto mb-4 border border-border">
                <Bell size={28} className="text-text-muted opacity-50" />
              </div>
              <h3 className="text-base font-bold text-navy mb-1">No notifications found</h3>
              <p className="text-xs text-text-muted">
                {filter === 'all'
                  ? 'You are all caught up! New updates will appear here.'
                  : `No notifications under category "${filter}".`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filtered.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => markSingleAsRead(n.id)}
                    className={`p-5 flex items-start gap-4 hover:bg-bg/60 cursor-pointer transition-colors ${
                      n.unread ? 'bg-navy/[0.02]' : ''
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${n.color}`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${n.unread ? 'text-navy' : 'text-navy/70'}`}>
                            {n.title}
                          </h4>
                          {n.unread && <span className="h-2 w-2 rounded-full bg-mint shrink-0" />}
                        </div>
                        <span className="text-xs text-text-muted shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">{n.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

      </motion.div>
    </div>
  );
}
