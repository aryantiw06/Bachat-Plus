// ============================================
// UserMenu.jsx — Interactive Topright Avatar Dropdown
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Crown,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { usePremium } from '../../contexts/PremiumContext.jsx';
import LogoutDialog from './LogoutDialog.jsx';

export default function UserMenu() {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.displayName || 'Aryan Tiwary';
  const email = user?.email || 'aryan@bachatplus.com';
  const initial = displayName.charAt(0).toUpperCase();

  // Close on outside click & Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Avatar Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-navy/5 transition-colors focus:outline-none"
          aria-label="User menu"
        >
          <div
            className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              isPremium
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white ring-2 ring-amber-300 shadow-md shadow-amber-500/20'
                : 'bg-navy text-white shadow-sm'
            }`}
          >
            {initial}
          </div>
          <ChevronDown size={14} className="text-text-muted hidden sm:block" />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-64 bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden z-50 p-2"
            >
              {/* Header Details */}
              <div className="p-3 bg-bg/60 rounded-xl mb-1 border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-navy truncate max-w-[140px]">{displayName}</span>
                  {isPremium ? (
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Crown size={10} /> PRO
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold text-text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
                      Free
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-muted truncate block mt-0.5">{email}</span>
              </div>

              {/* Menu Links */}
              <div className="space-y-0.5">
                {[
                  { label: 'My Profile', icon: User, path: '/profile' },
                  { label: 'Settings', icon: Settings, path: '/settings' },
                  { label: 'Premium', icon: Crown, path: '/premium', highlight: isPremium },
                  { label: 'Notifications', icon: Bell, path: '/notifications' },
                  { label: 'Help & Support', icon: HelpCircle, path: '/settings' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                        item.highlight
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-navy/80 hover:bg-navy/5 hover:text-navy'
                      }`}
                    >
                      <Icon size={16} className={item.highlight ? 'text-amber-500' : 'text-text-muted'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <div className="pt-1 mt-1 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setLogoutOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-danger hover:bg-danger/5 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
}
