import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  QrCode,
  TrendingUp,
  Sparkles,
  User,
  Crown,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/payment', label: 'Payment', icon: QrCode },
  { to: '/wallet', label: 'Wealth Wallet', icon: Wallet },
  { to: '/investments', label: 'Investments', icon: TrendingUp },
  { to: '/ai-advisor', label: 'AI Advisor', icon: Sparkles },
  { to: '/premium', label: 'Premium', icon: Crown },
];

const BOTTOM_ITEMS = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

/**
 * Sidebar — left-hand app navigation shown on every logged-in page
 * (Dashboard, Payment, Wallet, Investments, AI Advisor, Profile,
 * Premium, Settings). Wraps content via DashboardLayout.
 */
export default function Sidebar() {
  const linkClasses = ({ isActive }) => `
    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
    transition-colors duration-150
    ${isActive
      ? 'bg-navy text-white shadow-sm shadow-navy/30'
      : 'text-text-muted hover:bg-navy/5 hover:text-navy'}
  `;

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-surface px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <span className="h-9 w-9 rounded-lg bg-navy flex items-center justify-center">
          <Wallet size={18} className="text-mint" />
        </span>
        <span className="font-display font-bold text-lg text-navy">
          Bachat<span className="text-mint">+</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClasses}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-border">
        {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClasses}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-danger/5 hover:text-danger transition-colors duration-150">
          <LogOut size={18} />
          Log Out
        </Link>
      </div>
    </aside>
  );
}