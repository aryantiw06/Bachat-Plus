// ============================================
// NotificationDropdown.jsx — Interactive Topbar Notifications
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Crown,
  Shield,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: '₹7 invested today!',
    body: 'Your coffee payment round-up was automatically transferred to your Investment Wallet.',
    category: 'investment',
    time: '10m ago',
    unread: true,
    icon: PiggyBank,
    color: 'text-mint bg-mint/10',
  },
  {
    id: 2,
    title: 'Gold ETF Unlocked 🎉',
    body: 'Your wallet crossed ₹100! You can now start investing in Gold ETFs.',
    category: 'market',
    time: '2h ago',
    unread: true,
    icon: TrendingUp,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    id: 3,
    title: 'Goal Progress at 35%',
    body: 'You are on track to reach your Emergency Fund target by next month.',
    category: 'goal',
    time: '1d ago',
    unread: true,
    icon: Sparkles,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    id: 4,
    title: 'AI Insight Generated',
    body: 'Your weekly spending report is ready on your AI Wealth Advisor dashboard.',
    category: 'ai',
    time: '2d ago',
    unread: false,
    icon: Sparkles,
    color: 'text-purple-600 bg-purple-50',
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

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
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full flex items-center justify-center text-text-muted hover:bg-navy/5 hover:text-navy transition-colors focus:outline-none"
        aria-label="View notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-mint ring-2 ring-surface animate-pulse" />
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/70 flex items-center justify-between bg-bg/50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-navy">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-mint bg-mint/10 px-2 py-0.5 rounded-full border border-mint/20">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-text-muted hover:text-navy flex items-center gap-1 font-medium transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck size={14} /> Read all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-text-muted hover:text-danger transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-xs">
                  <Bell size={24} className="mx-auto mb-2 opacity-40" />
                  No notifications. You're all caught up!
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => markSingleAsRead(n.id)}
                      className={`p-3.5 flex items-start gap-3 hover:bg-bg/60 cursor-pointer transition-colors ${
                        n.unread ? 'bg-navy/[0.02]' : ''
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className={`text-xs font-bold ${n.unread ? 'text-navy' : 'text-navy/70'}`}>
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-text-muted">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                          {n.body}
                        </p>
                      </div>
                      {n.unread && (
                        <span className="h-2 w-2 rounded-full bg-mint shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-bg/50 border-t border-border/70 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="text-xs font-bold text-navy hover:text-mint flex items-center justify-center gap-1 w-full transition-colors"
              >
                View All Notifications <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
