// ============================================
// Profile.jsx — User Profile & Account Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Crown,
  PiggyBank,
  Target,
  Trophy,
  Shield,
  Download,
  Edit3,
  Key,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useWallet } from '../contexts/WalletContext.jsx';
import { usePremium } from '../contexts/PremiumContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AnimatedCounter from '../components/ui/AnimatedCounter.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function Profile() {
  const { user } = useAuth();
  const { investmentWallet, savingsGoal, goalName, goalProgress, totalTransactions, transactions } = useWallet();
  const { isPremium, premiumPlan } = usePremium();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || user?.email?.split('@')[0] || 'Bachat+ User');
  const [email] = useState(user?.email || 'user@bachatplus.com');
  const [toast, setToast] = useState('');

  const initial = name.charAt(0).toUpperCase();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setToast('Profile updated successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user: { name, email, isPremium },
      wallet: { investmentWallet, savingsGoal, goalName, goalProgress },
      transactions,
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bachat_plus_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal account, security, and subscription"
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

        {/* 1. HERO USER CARD */}
        <Card padding="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-navy/5 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
            {/* Avatar */}
            <div
              className={`h-24 w-24 rounded-3xl flex items-center justify-center text-3xl font-display font-bold shadow-xl shrink-0 ${
                isPremium
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white ring-4 ring-amber-300 shadow-amber-500/20'
                  : 'bg-navy text-white'
              }`}
            >
              {initial}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h2 className="text-2xl font-bold text-navy">{name}</h2>
                    {isPremium && (
                      <Badge tone="mint" className="bg-amber-50 text-amber-600 border border-amber-200">
                        <Crown size={12} className="mr-1" /> PRO
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{email}</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 size={14} className="mr-1" /> Edit Profile
                  </Button>
                  <Button
                    variant={isPremium ? 'secondary' : 'accent'}
                    size="sm"
                    onClick={() => navigate('/premium')}
                  >
                    <Crown size={14} className="mr-1" /> {isPremium ? 'Manage VIP' : 'Upgrade Pro'}
                  </Button>
                </div>
              </div>

              {/* Inline Edit Form */}
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="mt-4 p-4 bg-bg rounded-2xl border border-border/80 text-left space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm font-semibold text-navy bg-surface border border-border rounded-xl px-3 py-2 focus:ring-1 focus:ring-navy focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="primary" size="sm" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-text-muted mt-4 pt-4 border-t border-border/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-navy" /> Member since Jan 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield size={14} className="text-mint" /> Verified Account
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Crown size={14} className="text-amber-500" /> Plan: {isPremium ? (premiumPlan === 'yearly' ? 'Yearly Pass' : 'Monthly Pro') : 'Free Tier'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 2. STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Smart Investment Wallet', value: investmentWallet, prefix: '₹', accent: 'text-mint' },
            { label: 'Savings Goal', value: savingsGoal, prefix: '₹', accent: 'text-navy' },
            { label: 'Goal Progress', value: goalProgress, suffix: '%', accent: 'text-teal' },
            { label: 'Total Payments', value: totalTransactions, prefix: '', accent: 'text-navy' },
          ].map((s) => (
            <Card key={s.label} className="!p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">{s.label}</p>
              <AnimatedCounter
                value={s.value}
                prefix={s.prefix || ''}
                suffix={s.suffix || ''}
                className={`text-xl font-display font-extrabold ${s.accent}`}
              />
            </Card>
          ))}
        </div>

        {/* 3. ACHIEVEMENTS & BADGES */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">Achievements & Badges</h3>
              <p className="text-xs text-text-muted">Earned through consistent savings habits</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { name: 'First Round-up', desc: 'Made 1st payment', icon: PiggyBank, earned: totalTransactions > 0, color: 'text-mint bg-mint/10' },
              { name: 'Goal Setter', desc: 'Set savings target', icon: Target, earned: savingsGoal > 0, color: 'text-blue-600 bg-blue-50' },
              { name: 'Gold Investor', desc: 'Crossed ₹100 wallet', icon: Sparkles, earned: investmentWallet >= 100, color: 'text-amber-600 bg-amber-50' },
              { name: 'Consistency Master', desc: '10+ payments', icon: Trophy, earned: totalTransactions >= 10, color: 'text-purple-600 bg-purple-50' },
              { name: 'Bachat+ Pro', desc: 'VIP Subscriber', icon: Crown, earned: isPremium, color: 'text-amber-500 bg-amber-100' },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                    badge.earned
                      ? 'bg-surface border-border shadow-sm'
                      : 'bg-bg/60 border-border/40 opacity-40 grayscale'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center mb-2 ${badge.color}`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-navy mb-0.5">{badge.name}</h4>
                  <p className="text-[10px] text-text-muted">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 4. QUICK ACTIONS */}
        <Card padding="lg">
          <h3 className="text-lg font-bold text-navy mb-4">Account Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="secondary"
              onClick={handleExportData}
              className="justify-between"
            >
              <span className="flex items-center gap-2 text-xs font-semibold">
                <Download size={16} /> Export Financial Data
              </span>
              <ArrowRight size={14} />
            </Button>

            <Button
              variant="secondary"
              disabled
              className="justify-between opacity-60 cursor-not-allowed"
              aria-label="Change password disabled for demo"
            >
              <span className="flex items-center gap-2 text-xs font-semibold">
                <Key size={16} /> Change Password (Demo)
              </span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate('/settings')}
              className="justify-between"
            >
              <span className="flex items-center gap-2 text-xs font-semibold">
                <User size={16} /> Account Preferences
              </span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>

      </motion.div>
    </div>
  );
}