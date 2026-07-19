// ============================================
// RecentTransactions — Latest simulated payments
// ============================================
// Displays the most recent 10 transactions in a scrollable list.
// Each row shows:
//   • Time (formatted as relative or HH:MM)
//   • Purchase amount
//   • Round-up amount (highlighted in mint)
//   • Status indicator
//
// New transactions animate in from the top with stagger.
// Empty state shown when no transactions exist yet.
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Clock, Inbox } from 'lucide-react';
import Card from '../ui/Card.jsx';

// Format timestamp to a readable time string
function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function RecentTransactions({ transactions }) {
  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-text-muted" />
          <h3 className="font-semibold text-sm text-navy">Recent Transactions</h3>
        </div>
        {transactions.length > 0 && (
          <span className="text-xs text-text-muted bg-bg px-2.5 py-1 rounded-full">
            {transactions.length} total
          </span>
        )}
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {transactions.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-3 text-text-muted"
            >
              <Inbox size={32} className="opacity-40" />
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs">Make a payment to see your round-ups here</p>
            </motion.div>
          ) : (
            // Transaction list
            transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                // Animate new transactions sliding in from the top
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                transition={{ duration: 0.3, delay: index === 0 ? 0.1 : 0 }}
                className="border-b border-border last:border-b-0"
              >
                <div className="px-6 py-3.5 flex items-center justify-between gap-4">
                  {/* Left: Icon + details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-bg flex items-center justify-center shrink-0">
                      <ArrowUpRight size={16} className="text-navy" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        Payment — ₹{tx.purchaseAmount}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatTime(tx.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Round-up amount */}
                  <div className="text-right shrink-0">
                    {tx.roundup > 0 ? (
                      <span className="text-sm font-semibold text-mint">
                        +₹{tx.roundup}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-text-muted">
                        ₹0
                      </span>
                    )}
                    <p className="text-xs text-text-muted">round-up</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
