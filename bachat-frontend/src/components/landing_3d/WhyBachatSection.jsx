// ============================================
// WhyBachatSection.jsx — Core Pillars & Differentiators
// ============================================
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Brain, Lock, RefreshCw, BarChart3 } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

const PILLARS = [
  {
    icon: RefreshCw,
    title: 'Zero Extra Effort',
    desc: 'Never worry about setting aside money manually. Every payment rounds up in real-time.',
  },
  {
    icon: Sparkles,
    title: 'Micro-Investing',
    desc: 'Start investing with as little as ₹1. High returns without needing large upfront capital.',
  },
  {
    icon: Brain,
    title: 'AI Wealth Advisor',
    desc: 'Get smart, personalized portfolio recommendations tailored to your spending habits.',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    desc: 'Track category spending, monthly savings growth, and financial health scores.',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    desc: 'Built with Firebase Authentication, encrypted ID token verification, and secure HTTPS routes.',
  },
  {
    icon: ShieldCheck,
    title: 'Modern FinTech UX',
    desc: 'Fast, responsive, and elegant interface modeled after Google Pay, CRED, and Stripe.',
  },
];

export default function WhyBachatSection() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge>Why Choose Bachat+</Badge>
        <h2 className="font-display font-black text-3xl md:text-4xl text-navy tracking-tight">
          Built for the Next Generation of Indian Savers
        </h2>
        <p className="text-text-muted text-sm md:text-base">
          Transforming daily consumer spending into long-term financial freedom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PILLARS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Card hoverable className="h-full border border-border/80 shadow-md">
                <div className="p-6">
                  <div className="h-11 w-11 rounded-2xl bg-navy/5 flex items-center justify-center text-navy mb-4 border border-navy/10">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-base text-navy mb-1.5">{p.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{p.desc}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
