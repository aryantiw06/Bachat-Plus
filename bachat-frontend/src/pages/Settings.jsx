// ============================================
// Settings.jsx — User & Application Preferences Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Sliders,
  ShieldCheck,
  Moon,
  HelpCircle,
  Crown,
  CheckCircle2,
  Lock,
  Globe,
  DollarSign,
  Smartphone,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePremium } from '../contexts/PremiumContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

// Toggle Switch Component
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
  const navigate = useNavigate();

  // Settings State
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [roundupAlerts, setRoundupAlerts] = useState(true);
  const [aiTips, setAiTips] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(isPremium);
  const [biometric, setBiometric] = useState(false);
  const [autoPay, setAutoPay] = useState(isPremium);
  const [multiplier, setMultiplier] = useState('1x');
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Settings"
        subtitle="Manage your application preferences, notifications, and security"
      />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-mint/10 border border-mint/30 text-mint text-xs font-bold rounded-2xl flex items-center gap-2"
        >
          <CheckCircle2 size={16} /> {toast}
        </motion.div>
      )}

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">

        {/* 1. NOTIFICATIONS SETTINGS */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">Notification Preferences</h3>
              <p className="text-xs text-text-muted">Control how and when you receive financial alerts</p>
            </div>
          </div>

          <div className="space-y-4 divide-y divide-border/60">
            {[
              { id: 'push', title: 'Push Notifications', desc: 'Instant alerts on payments and round-ups', state: pushNotifs, setter: setPushNotifs },
              { id: 'email', title: 'Email Digests', desc: 'Weekly summary of your investment growth', state: emailNotifs, setter: setEmailNotifs },
              { id: 'roundup', title: 'Round-up Confirmations', desc: 'Get notified whenever a payment is rounded up', state: roundupAlerts, setter: setRoundupAlerts },
              { id: 'aitips', title: 'Daily AI Wealth Tips', desc: 'Receive personalized financial coaching tips', state: aiTips, setter: setAiTips },
              { id: 'market', title: 'Market Dip Alerts', desc: 'Notifications when Gold or ETFs drop 2%+', state: marketAlerts, setter: setMarketAlerts, reqPro: !isPremium },
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

        {/* 2. INVESTMENT PREFERENCES */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-mint/10 flex items-center justify-center text-mint">
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">Investment Rules</h3>
              <p className="text-xs text-text-muted">Customize how spare change is rounded up and invested</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy mb-1.5">
                Round-up Multiplier
              </label>
              <p className="text-[11px] text-text-muted mb-3">
                Multiply your spare change savings on every payment (e.g. ₹7 round-up × 2x = ₹14 saved).
              </p>
              <div className="flex gap-3">
                {['1x', '2x', '5x'].map((mult) => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => {
                      setMultiplier(mult);
                      showToast(`Multiplier set to ${mult}`);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      multiplier === mult
                        ? 'bg-navy text-white border-navy shadow-sm'
                        : 'bg-bg text-navy border-border hover:border-navy/40'
                    }`}
                  >
                    {mult} {mult === '1x' ? '(Standard)' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 3. SECURITY & PRIVACY */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">Security & Privacy</h3>
              <p className="text-xs text-text-muted">Authentication and mandate permissions</p>
            </div>
          </div>

          <div className="space-y-4 divide-y divide-border/60">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy block">Biometric Lock (FaceID / TouchID)</span>
                <span className="text-[11px] text-text-muted block mt-0.5">Require fingerprint or face scan when opening app</span>
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
                <span className="text-[11px] text-text-muted block mt-0.5">Auto-deposit round-ups via UPI Mandate</span>
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

        {/* 4. SUPPORT & ABOUT */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <HelpCircle size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">Help & Support</h3>
              <p className="text-xs text-text-muted">Frequently asked questions and app info</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-bg rounded-xl border border-border/60">
              <span className="font-bold text-navy block mb-0.5">Support Email</span>
              <span className="text-text-muted">support@bachatplus.com</span>
            </div>
            <div className="p-3 bg-bg rounded-xl border border-border/60">
              <span className="font-bold text-navy block mb-0.5">App Version</span>
              <span className="text-text-muted">v1.2.0 (Hackathon Release)</span>
            </div>
          </div>
        </Card>

      </motion.div>
    </div>
  );
}