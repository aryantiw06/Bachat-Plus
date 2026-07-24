// ============================================
// Settings.jsx — User & Consumer Preferences Page
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Info,
  ExternalLink,
  MessageSquare,
  Star,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePremium } from '../contexts/PremiumContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function Toggle({ checked, onChange, disabled = false, id }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-mint' : 'bg-border'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const { isPremium } = usePremium();

  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [roundupAlerts, setRoundupAlerts] = useState(true);
  const [aiTips, setAiTips] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(isPremium);
  const [biometric, setBiometric] = useState(false);
  const [autoPay, setAutoPay] = useState(isPremium);
  const [multiplier, setMultiplier] = useState('1x');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      <PageHeader
        title="Settings & Account Preferences"
        subtitle="Customize notification triggers, auto-investment rules, and app preferences."
      />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-mint/10 border border-mint/30 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2"
        >
          <CheckCircle2 size={16} className="text-emerald-700" /> {toast}
        </motion.div>
      )}

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">

        {/* 1. NOTIFICATION PREFERENCES */}
        <Card padding="lg" className="border border-border/80 shadow-md">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy">Notification Preferences</h3>
              <p className="text-xs text-text-muted">Control alerts for round-up transactions and weekly digests</p>
            </div>
          </div>

          <div className="space-y-4 divide-y divide-border/60">
            {[
              { id: 'push', title: 'Push Notifications', desc: 'Instant alerts on payment round-ups', state: pushNotifs, setter: setPushNotifs },
              { id: 'email', title: 'Email Digests', desc: 'Weekly summary of your investment growth', state: emailNotifs, setter: setEmailNotifs },
              { id: 'roundup', title: 'Round-up Confirmations', desc: 'Notify whenever a purchase is rounded up', state: roundupAlerts, setter: setRoundupAlerts },
              { id: 'aitips', title: 'Daily AI Coaching Tips', desc: 'Personalized micro-investment advice', state: aiTips, setter: setAiTips },
              { id: 'market', title: 'Market Dip Alerts', desc: 'Alerts when Gold or Index ETFs drop 2%+', state: marketAlerts, setter: setMarketAlerts, reqPro: !isPremium },
            ].map((item, idx) => (
              <div key={item.id} className={`flex items-center justify-between ${idx > 0 ? 'pt-3.5' : ''}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy">{item.title}</span>
                    {item.reqPro && (
                      <Badge tone="mint" className="bg-amber-50 text-amber-600 border border-amber-200 text-[9px]">
                        Pro Only
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-text-muted block mt-0.5">{item.desc}</span>
                </div>
                <Toggle
                  id={item.id}
                  checked={item.state}
                  disabled={item.reqPro}
                  onChange={(val) => {
                    item.setter(val);
                    showToast('Notification preference saved');
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* 2. INVESTMENT RULES */}
        <Card padding="lg" className="border border-border/80 shadow-md">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-mint/10 flex items-center justify-center text-emerald-700">
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy">Auto-Investment Multiplier</h3>
              <p className="text-xs text-text-muted">Accelerate your savings by multiplying spare change round-ups</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-text-muted">
              Choose how your spare change is multiplied on every UPI payment:
            </p>
            <div className="flex gap-3">
              {[
                { label: '1x (Standard)', val: '1x' },
                { label: '2x (Double)', val: '2x' },
                { label: '5x (Accelerated)', val: '5x' },
              ].map((m) => (
                <button
                  key={m.val}
                  type="button"
                  onClick={() => {
                    setMultiplier(m.val);
                    showToast(`Round-up multiplier set to ${m.val}`);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    multiplier === m.val
                      ? 'bg-navy text-white border-navy shadow-md'
                      : 'bg-bg text-navy border-border/80 hover:border-navy/40'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* 3. SECURITY & AUTOPAY */}
        <Card padding="lg" className="border border-border/80 shadow-md">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy">Security & UPI Mandate</h3>
              <p className="text-xs text-text-muted">Biometric locks and auto-deposit settings</p>
            </div>
          </div>

          <div className="space-y-4 divide-y divide-border/60">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy block">Biometric Lock</span>
                <span className="text-[11px] text-text-muted block mt-0.5">Require TouchID / FaceID to open app</span>
              </div>
              <Toggle
                id="bio"
                checked={biometric}
                onChange={(val) => {
                  setBiometric(val);
                  showToast(`Biometric auth ${val ? 'enabled' : 'disabled'}`);
                }}
              />
            </div>

            <div className="pt-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy block">AutoPay Mandate</span>
                <span className="text-[11px] text-text-muted block mt-0.5">Auto-transfer round-ups via UPI Mandate</span>
              </div>
              <Toggle
                id="autopay"
                checked={autoPay}
                onChange={(val) => {
                  setAutoPay(val);
                  showToast(`AutoPay mandate ${val ? 'active' : 'paused'}`);
                }}
              />
            </div>
          </div>
        </Card>

        {/* 4. CONSUMER ABOUT SECTION */}
        <Card padding="lg" className="border border-border/80 shadow-md">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
              <Info size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy">About Bachat+</h3>
              <p className="text-xs text-text-muted">Application version, policies, and support</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-bg rounded-2xl border border-border/60">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted block mb-1">Application</span>
              <span className="font-extrabold text-navy text-sm block">Bachat+</span>
              <span className="text-text-muted text-[11px]">Smart Round-Up Wealth Platform</span>
            </div>

            <div className="p-3.5 bg-bg rounded-2xl border border-border/60">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted block mb-1">Build Info</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-navy">Version: v1.2.0</span>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Demo
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              { label: 'Privacy Policy', icon: FileText },
              { label: 'Terms & Conditions', icon: FileText },
              { label: 'Contact Support', icon: HelpCircle },
              { label: 'Send Feedback', icon: MessageSquare },
              { label: 'Rate the App', icon: Star },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => showToast(`${link.label} clicked`)}
                  className="p-2.5 rounded-xl border border-border/60 hover:border-navy/30 hover:bg-bg flex items-center justify-between text-navy font-semibold transition-all"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Icon size={14} className="text-text-muted shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </span>
                  <ExternalLink size={12} className="text-text-muted shrink-0" />
                </button>
              );
            })}
          </div>
        </Card>

      </motion.div>
    </div>
  );
}