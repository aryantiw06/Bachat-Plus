import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Repeat,
  Sparkles,
  PieChart,
  ShieldCheck,
  Target,
  BarChart3,
  Wallet,
  Crown,
  TrendingUp,
} from 'lucide-react';

import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import StatBlock from '../components/ui/StatBlock.jsx';
import StepCard from '../components/ui/StepCard.jsx';
import FeatureCard from '../components/ui/FeatureCard.jsx';
import RoundUpPreviewCard from '../components/landing/RoundUpPreviewCard.jsx';

// ---- Dummy content used only for this UI-only module ----
const STATS = [
  { value: '300M+', label: 'UPI users in India' },
  { value: '₹1L Cr+', label: 'Untapped micro-savings' },
  { value: '0', label: 'Effort required from you' },
];

const STEPS = [
  { icon: Zap, title: 'Pay as usual', description: 'Any UPI payment, anywhere — no new habit to build.' },
  { icon: Repeat, title: 'Auto round-up', description: 'The spare change is instantly set aside for you.' },
  { icon: Sparkles, title: 'AI recommends', description: 'Get a personalized investment suggestion, instantly.' },
  { icon: PieChart, title: 'Wealth grows', description: 'Funds flow into ETFs, mutual funds, gold & more.' },
];

const FEATURES = [
  { icon: Wallet, title: 'Smart Investment Wallet', description: 'Every round-up lands in one place, growing quietly in the background.' },
  { icon: Sparkles, title: 'AI Investment Advisor', description: 'Personalized fund & stock suggestions based on your saving pattern.' },
  { icon: Target, title: 'Goal-Based Investing', description: 'Set a target — a trip, a gadget, an emergency fund — and track it visually.' },
  { icon: BarChart3, title: 'Spending Analytics', description: 'Understand exactly where your money goes, every single month.' },
  { icon: ShieldCheck, title: 'AI Financial Health Score', description: 'A single score that tracks your financial wellbeing over time.' },
  { icon: Crown, title: 'Premium Wealth Manager', description: 'Tax insights, portfolio rebalancing, and advanced analytics for power users.' },
];

/**
 * Landing — public marketing homepage. Fully static UI, no backend
 * calls. All numbers and copy here are placeholder/demo content.
 */
export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div className="text-center md:text-left">
          <Badge>UPI-linked · AI-powered · Beginner friendly</Badge>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.1] mt-5">
            Every payment becomes an <span className="text-mint">investment.</span>
          </h1>

          <p className="text-text-muted text-base md:text-lg mt-5 max-w-lg mx-auto md:mx-0">
            Har Payment Mein Bachat. Har Bachat Mein Investment. Bachat+ rounds up
            your everyday spends and invests the spare change automatically —
            no extra effort, no lump sum required.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 justify-center md:justify-start">
            <Button variant="primary" size="lg" fullWidth={false} onClick={() => navigate('/signup')} className="w-full sm:w-auto">
              Get Started Free <ArrowRight size={18} />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto">
              Log In
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto md:mx-0">
            {STATS.map((s) => (
              <StatBlock key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>

        <RoundUpPreviewCard />
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge tone="outline">How it works</Badge>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-navy mt-4">
              From spare change to real wealth, automatically
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <StepCard key={step.title} number={i + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <Badge>Everything you need</Badge>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-navy mt-4">
            One platform. A full wealth-building toolkit.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ---------- CTA BANNER ---------- */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden bg-navy rounded-3xl px-8 py-14 md:py-16 text-center">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-teal/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-mint/20 blur-3xl" />

          <TrendingUp className="mx-auto text-mint mb-4" size={32} />
          <h2 className="font-display font-bold text-2xl md:text-4xl text-white max-w-2xl mx-auto">
            Start building wealth with your next payment.
          </h2>
          <p className="text-white/60 mt-3 max-w-md mx-auto">
            Join Bachat+ and let every rupee you spend quietly work for you.
          </p>
          <Button
            variant="accent"
            size="lg"
            className="mt-8"
            onClick={() => navigate('/signup')}
          >
            Create Free Account <ArrowRight size={18} />
          </Button>
        </div>
      </section>
    </>
  );
}