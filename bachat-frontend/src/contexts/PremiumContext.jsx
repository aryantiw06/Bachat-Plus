// ============================================
// PremiumContext.jsx — Subscription State Management
// ============================================
// Manages the global `isPremium` state, selected plan, and
// activation timestamps with localStorage persistence.
// Designed to be swapped seamlessly with backend API calls
// (GET /subscription, POST /upgrade, POST /cancel).
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';

const PremiumContext = createContext(null);

const STORAGE_KEY = 'bachat_premium_subscription';

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState(null); // 'monthly' | 'yearly' | null
  const [premiumActivatedAt, setPremiumActivatedAt] = useState(null);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isPremium) {
          setIsPremium(true);
          setPremiumPlan(parsed.plan || 'yearly');
          setPremiumActivatedAt(parsed.activatedAt || new Date().toISOString());
        }
      }
    } catch (err) {
      console.error('Failed to load premium state from storage:', err);
    }
  }, []);

  // Activate Premium (Simulated API upgrade)
  const activatePremium = (plan = 'yearly') => {
    return new Promise((resolve) => {
      const now = new Date().toISOString();
      setIsPremium(true);
      setPremiumPlan(plan);
      setPremiumActivatedAt(now);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            isPremium: true,
            plan,
            activatedAt: now,
          })
        );
      } catch (err) {
        console.error('Failed to save premium state:', err);
      }

      resolve({ success: true, plan, activatedAt: now });
    });
  };

  // Cancel / Reset Premium
  const cancelPremium = () => {
    setIsPremium(false);
    setPremiumPlan(null);
    setPremiumActivatedAt(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear premium storage:', err);
    }
  };

  const value = {
    isPremium,
    premiumPlan,
    premiumActivatedAt,
    activatePremium,
    cancelPremium,
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}
