// ============================================
// HowItWorksSection.jsx — Step-by-Step Value Creation Flow
// ============================================
import { motion } from 'framer-motion';
import { Zap, Repeat, PiggyBank, TrendingUp, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const STEPS = [
  {
    step: '01',
    icon: Zap,
    title: 'Pay Anywhere',
    desc: 'Pay for groceries, coffee, or online shopping using any UPI app like Google Pay, PhonePe, or BHIM.',
    accent: 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-500',
  },
  {
    step: '02',
    icon: Repeat,
    title: 'Auto Round-Up',
    desc: 'Bachat+ automatically rounds up your transaction to the nearest ₹10 (e.g. ₹163 → ₹170).',
    accent: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-500',
  },
  {
    step: '03',
    icon: PiggyBank,
    title: 'Smart Wallet Deposit',
    desc: 'The ₹7 spare change transfers straight into your secure Smart Investment Wallet.',
    accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Automated Compounding',
    desc: 'Accumulated funds are auto-invested in low-risk Gold ETFs and Nifty 50 Index funds.',
    accent: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-surface border-y border-border/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge tone="mint">4-Step Automated Engine</Badge>
          <h2 className="font-display font-black text-3xl md:text-4xl text-navy tracking-tight">
            How Bachat+ Grows Your Wealth Automatically
          </h2>
          <p className="text-text-muted text-sm md:text-base">
            No manual transfers, no complex stock picking, no hassle. Build wealth every time you spend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-border/80 shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-navy/30">{s.step}</span>
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.accent} flex items-center justify-center border`}>
                      <Icon size={24} />
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-navy mb-2">{s.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
