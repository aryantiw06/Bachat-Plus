// ============================================
// Topbar.jsx — Top Application Navigation Bar
// ============================================

import { useNavigate } from 'react-router-dom';
import { Crown, Wallet } from 'lucide-react';
import { usePremium } from '../../contexts/PremiumContext.jsx';
import NotificationDropdown from './NotificationDropdown.jsx';
import UserMenu from './UserMenu.jsx';

export default function Topbar() {
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between gap-3 px-4 sm:px-6 md:px-10 border-b border-border/80 bg-surface/85 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-2 md:hidden">
        <span className="h-8 w-8 rounded-xl bg-navy flex items-center justify-center shadow-sm"><Wallet size={16} className="text-mint" /></span>
        <span className="font-display font-extrabold text-navy">Bachat<span className="text-mint">+</span></span>
      </div>

      <div className="ml-auto flex items-center gap-3">
      {/* Premium Pill Badge (Clickable) */}
      {isPremium ? (
        <button
          type="button"
          onClick={() => navigate('/premium')}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 hover:bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200 transition-colors"
        >
          <Crown size={13} className="text-amber-500" /> Bachat+ Pro
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigate('/premium')}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-navy px-2.5 py-1 rounded-lg transition-colors"
        >
          <Crown size={14} className="text-amber-500" /> Upgrade
        </button>
      )}

      {/* Notifications Bell Dropdown */}
      <NotificationDropdown />

      {/* User Avatar Dropdown */}
      <UserMenu />
      </div>
    </header>
  );
}
