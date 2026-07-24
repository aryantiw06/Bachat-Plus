// ============================================
// RecentTransactions.jsx — Premium Transaction History Component
// ============================================
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Clock, Inbox, Coffee, ShoppingBag, Zap, Car, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card.jsx';

const CAT_META = {
  food: { label: 'Food', icon: Coffee, bg: 'bg-orange-50 text-orange-600' },
  shopping: { label: 'Shopping', icon: ShoppingBag, bg: 'bg-blue-50 text-blue-600' },
  transport: { label: 'Transport', icon: Car, bg: 'bg-purple-50 text-purple-600' },
  utility: { label: 'Utility', icon: Zap, bg: 'bg-amber-50 text-amber-600' },
  general: { label: 'UPI Pay', icon: ArrowUpRight, bg: 'bg-emerald-50 text-emerald-600' },
};

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function RecentTransactions({ transactions }) {
  return (
    <Card padding="none" className="overflow-hidden border border-border/80 shadow-md bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-navy" />
          <h3 className="font-bold text-sm text-navy">Recent Transactions</h3>
        </div>
        {transactions.length > 0 && (
          <span className="text-[11px] font-extrabold text-navy bg-bg px-2.5 py-1 rounded-full border border-border/60">
            {transactions.length} total
          </span>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-2 text-text-muted text-center px-4"
            >
              <div className="h-12 w-12 rounded-full bg-bg flex items-center justify-center mb-1 border border-border">
                <Inbox size={22} className="opacity-40" />
              </div>
              <p className="text-sm font-bold text-navy">No transactions yet</p>
              <p className="text-xs text-text-muted">Use UPI Quick Pay to start auto-saving spare change.</p>
            </motion.div>
          ) : (
            transactions.map((tx, index) => {
              const meta = CAT_META[tx.category] || CAT_META.general;
              const Icon = meta.icon;
              const merchant = tx.merchantName || tx.merchant || 'UPI Merchant';
              const initial = merchant.charAt(0).toUpperCase();

              return (
                <motion.div
                  key={tx.id || index}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index === 0 ? 0.05 : 0 }}
                  className="border-b border-border/50 last:border-b-0 hover:bg-bg/40 transition-colors"
                >
                  <div className="px-6 py-3.5 flex items-center justify-between gap-4">
                    {/* Left: Avatar + Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center text-navy font-bold text-sm shrink-0 shadow-sm">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-navy truncate">{merchant}</p>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${meta.bg}`}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted flex items-center gap-1.5 mt-0.5">
                          <span>{formatTime(tx.timestamp)}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 size={11} /> Success
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Amounts */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold text-navy">₹{tx.roundedUp || (tx.purchaseAmount + tx.roundup)}</p>
                      <p className="text-[11px] font-extrabold text-emerald-700">
                        {tx.roundup > 0 ? `+₹${tx.roundup} saved` : '₹0 round-up'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
