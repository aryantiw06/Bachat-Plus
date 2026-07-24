import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  QrCode,
  TrendingUp,
  Sparkles,
  BarChart3,
  User,
  Crown,
  Settings,
  LogOut,
} from 'lucide-react';
import { usePremium } from '../../contexts/PremiumContext.jsx';
import LogoutDialog from './LogoutDialog.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/payment', label: 'Payment', icon: QrCode },
  { to: '/wallet', label: 'Smart Investment Wallet', icon: Wallet },
  { to: '/investments', label: 'Investments', icon: TrendingUp },
  { to: '/ai-advisor', label: 'AI Advisor', icon: Sparkles },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/premium', label: 'Premium', icon: Crown },
];

const BOTTOM_ITEMS = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { isPremium } = usePremium();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const linkClasses = ({ isActive }) => `
    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
    transition-all duration-150 group
    ${isActive
      ? 'bg-navy text-white shadow-md shadow-navy/20'
      : 'text-text-muted hover:bg-navy/5 hover:text-navy'}
  `;

  return (
    <>
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-surface px-4 py-6 z-20">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <span className="h-9 w-9 rounded-xl bg-navy flex items-center justify-center shadow-sm">
            <Wallet size={18} className="text-mint" />
          </span>
          <span className="font-display font-bold text-lg text-navy">
            Bachat<span className="text-mint">+</span>
          </span>
          {isPremium && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 ml-auto">
              PRO
            </span>
          )}
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClasses}>
              {to === '/premium' && isPremium ? (
                <Crown size={18} className="text-amber-500" />
              ) : (
                <Icon size={18} className="group-hover:scale-105 transition-transform" />
              )}
              <span>{label}</span>
              {to === '/premium' && isPremium && (
                <span className="ml-auto text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                  ✓
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-border">
          {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClasses}>
              <Icon size={18} className="group-hover:scale-105 transition-transform" />
              <span>{label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-danger/5 hover:text-danger transition-colors duration-150 w-full text-left"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
}