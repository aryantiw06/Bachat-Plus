import { Wallet } from 'lucide-react';

/**
 * RoundUpPreviewCard — the hero visual on the Landing page. Shows a
 * realistic mock of a payment being rounded up, purely for visual
 * storytelling. Uses static dummy numbers — no logic, no backend.
 */
export default function RoundUpPreviewCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* soft glow */}
      <div className="absolute -inset-6 bg-mint/10 rounded-[2.5rem] blur-2xl -z-10" />

      <div className="bg-navy text-white rounded-3xl p-6 shadow-2xl shadow-navy/30 border border-white/5">
        <p className="text-xs font-semibold tracking-widest text-mint mb-5">
          LIVE ROUND-UP
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Purchase amount</span>
            <span className="font-semibold">₹163</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">You pay</span>
            <span className="font-semibold">₹170</span>
          </div>
          <div className="flex items-center justify-between text-sm pb-3 border-b border-white/10">
            <span className="text-white/60">Merchant receives</span>
            <span className="font-semibold">₹163</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 bg-white/5 rounded-2xl p-4">
          <div className="h-10 w-10 rounded-xl bg-mint flex items-center justify-center shrink-0">
            <Wallet size={18} className="text-navy" />
          </div>
          <div>
            <p className="text-xs text-white/60">Moved to Wealth Wallet</p>
            <p className="font-display font-bold text-xl text-mint">+ ₹7</p>
          </div>
        </div>
      </div>
    </div>
  );
}