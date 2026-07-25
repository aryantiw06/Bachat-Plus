// ============================================
// WealthJourneySection.jsx — Interactive Wealth Journey Timeline
// ============================================
// Stage Timeline:
//   1. Make a Payment
//   2. Automatic Round-Up
//   3. Smart Investment Wallet
//   4. Choose an Investment
//   5. Portfolio Grows
//   6. Track Progress with AI
// ============================================

import { motion } from 'framer-motion';
import {
  CreditCard,
  Repeat,
  Wallet,
  TrendingUp,
  LineChart,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const STAGES = [
  {
    step: '01',
    icon: CreditCard,
    title: 'Make a Payment',
    short: 'Pay via any UPI app at coffee shops, groceries, or online stores.',
    pill: 'UPI / QR',
    color: 'from-blue-500/20 to-indigo-500/10 text-blue-500 border-blue-500/30',
  },
  {
    step: '02',
    icon: Repeat,
    title: 'Automatic Round-Up',
    short: '₹247 spent is rounded to ₹250. ₹3 spare change set aside instantly.',
    pill: 'Auto ₹10 Round',
    color: 'from-amber-500/20 to-orange-500/10 text-amber-500 border-amber-500/30',
  },
  {
    step: '03',
    icon: Wallet,
    title: 'Smart Wallet',
    short: 'Spare change transfers straight to your Smart Investment Wallet.',
    pill: 'Safe Escrow',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-500 border-emerald-500/30',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Choose Investment',
    short: 'Deploy wallet funds into Gold ETFs or Nifty 50 Index funds with 1 click.',
    pill: 'Gold & ETFs',
    color: 'from-teal-500/20 to-cyan-500/10 text-teal border-teal/30',
  },
  {
    step: '05',
    icon: LineChart,
    title: 'Portfolio Grows',
    short: 'Compounding returns increase net worth quietly in the background.',
    pill: 'Compounding',
    color: 'from-purple-500/20 to-pink-500/10 text-purple-500 border-purple-500/30',
  },
  {
    step: '06',
    icon: Sparkles,
    title: 'Track with AI',
    short: 'AI Wealth Advisor provides insights and financial health scores.',
    pill: 'AI Coach',
    color: 'from-mint/20 to-emerald-500/10 text-mint border-mint/30',
  },
];

export default function WealthJourneySection() {
  return (
    <section className="py-24 bg-surface border-y border-border/80 relative overflow-hidden">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-mint/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge tone="mint">Automated Pipeline</Badge>
          <h2 className="font-display font-black text-3xl md:text-4xl text-navy tracking-tight">
            From Everyday Payments to Long-Term Wealth
          </h2>
          <p className="text-text-muted text-sm md:text-base">
            Watch how ₹3 of spare change transforms step-by-step into a growing financial asset.
          </p>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-6 border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black tracking-widest text-navy/40 uppercase">
                      Stage {s.step}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border bg-gradient-to-r ${s.color}`}>
                      {s.pill}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-3">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center border shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="font-bold text-lg text-navy group-hover:text-mint transition-colors">
                      {s.title}
                    </h3>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed">
                    {s.short}
                  </p>
                </div>

                {idx < STAGES.length - 1 && (
                  <div className="hidden lg:flex items-center justify-end mt-4 text-text-muted group-hover:text-mint transition-colors">
                    <ChevronRight size={18} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
