// ============================================
// Landing.jsx — Premium Product-Focused Landing Page
// ============================================
// Marketing experience featuring:
//   1. Hero Section with 3D Smartphone & Tumbling Gold Coins Scene
//   2. Interactive 5-step Round-Up Story Simulator (₹247 → ₹250 → ₹3 → ₹3,000 Portfolio)
//   3. How It Works Section (4-step auto round-up engine)
//   4. Why Bachat+ Pillars
//   5. Interactive Wealth Journey Timeline (Section 1)
//   6. Live Round-Up Calculator & Wealth Potential Simulator (Section 2)
// ============================================

import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Hero3DScene from '../components/landing_3d/Hero3DScene.jsx';
import RoundUpStorySimulator from '../components/landing_3d/RoundUpStorySimulator.jsx';
import HowItWorksSection from '../components/landing_3d/HowItWorksSection.jsx';
import WhyBachatSection from '../components/landing_3d/WhyBachatSection.jsx';
import WealthJourneySection from '../components/landing_3d/WealthJourneySection.jsx';
import LiveCalculatorSection from '../components/landing_3d/LiveCalculatorSection.jsx';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-bg min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Headlines & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-emerald-800 text-xs font-extrabold">
              <Sparkles size={14} className="text-emerald-700" />
              <span>Smart Round-Up Wealth Platform</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.1] tracking-tight">
              Invest Every Spare Rupee <span className="text-mint">Automatically.</span>
            </h1>

            <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Every UPI payment you make is rounded up to the nearest ₹10. The spare change flows directly into your <strong className="text-navy font-bold">Smart Investment Wallet</strong> and compounds over time into real wealth.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto text-base font-extrabold py-4 px-8 shadow-xl shadow-mint/20"
              >
                Get Started Free <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto text-base font-bold py-4 px-8"
              >
                Explore App Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-text-muted font-semibold pt-4">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-700" /> Instant UPI Round-Up
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-teal" /> Firebase Verified Auth
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={16} className="text-navy" /> 100% Bank-Grade Security
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Canvas (5 cols) */}
          <div className="lg:col-span-5 relative">
            <Hero3DScene />
          </div>

        </div>
      </section>

      {/* ===== STORY SIMULATOR SHOWCASE ===== */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <RoundUpStorySimulator />
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <HowItWorksSection />

      {/* ===== WHY BACHAT+ PILLARS ===== */}
      <WhyBachatSection />

      {/* ===== SECTION 1: INTERACTIVE WEALTH JOURNEY ===== */}
      <WealthJourneySection />

      {/* ===== SECTION 2: LIVE ROUND-UP CALCULATOR ===== */}
      <LiveCalculatorSection />

      {/* ===== FINAL CTA BANNER ===== */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden bg-navy rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-mint/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <Sparkles size={36} className="text-mint mx-auto" />
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Ready to Turn Everyday Spends into Future Wealth?
            </h2>
            <p className="text-xs sm:text-sm text-white/70">
              Join Bachat+ today and let every payment quietly build your Smart Investment Wallet.
            </p>
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/signup')}
              className="py-4 px-8 text-base font-extrabold shadow-xl shadow-mint/30"
            >
              Create Your Free Account <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}