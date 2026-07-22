// ============================================
// Premium.jsx — Premium Experience Orchestrator
// ============================================
// Switches seamlessly between:
//   STATE 1 (Locked)   → PremiumFeatures.jsx
//   STATE 2 (Unlocked) → PremiumDashboard.jsx
//
// Manages the checkout modal and payment simulation flow.
// ============================================

import { useState } from 'react';
import { usePremium } from '../contexts/PremiumContext.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PremiumFeatures from '../components/premium/PremiumFeatures.jsx';
import PremiumDashboard from '../components/premium/PremiumDashboard.jsx';
import PremiumSuccessModal from '../components/premium/PremiumSuccessModal.jsx';

export default function Premium() {
  const { isPremium, premiumPlan, premiumActivatedAt, activatePremium } = usePremium();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  // Triggered when user selects a plan from PremiumFeatures or PremiumPlans
  const handleUpgradeClick = (plan = 'yearly') => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  // Called when payment completes inside modal
  const handlePaymentComplete = async () => {
    await activatePremium(selectedPlan);
    setModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader
        title={isPremium ? 'Bachat+ Premium' : 'Upgrade to Premium'}
        subtitle={
          isPremium
            ? 'Your AI Wealth Manager & VIP Pro Features'
            : 'Unlock automated portfolio optimization, tax savings, and AI advice'
        }
        badge={isPremium ? 'PRO Member' : '₹99/mo'}
      />

      {isPremium ? (
        <PremiumDashboard plan={premiumPlan} activatedAt={premiumActivatedAt} />
      ) : (
        <PremiumFeatures onUpgrade={handleUpgradeClick} />
      )}

      <PremiumSuccessModal
        isOpen={modalOpen}
        plan={selectedPlan}
        onClose={() => setModalOpen(false)}
        onComplete={handlePaymentComplete}
      />
    </div>
  );
}