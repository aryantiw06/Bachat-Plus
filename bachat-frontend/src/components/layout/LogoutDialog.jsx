// ============================================
// LogoutDialog.jsx — Confirmation Modal for Logging Out
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Button from '../ui/Button.jsx';

export default function LogoutDialog({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-sm bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden z-10 p-6 text-center"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-bg flex items-center justify-center text-text-muted hover:text-navy transition-colors"
          >
            <X size={16} />
          </button>

          <div className="h-14 w-14 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4 border border-danger/20">
            <LogOut size={26} />
          </div>

          <h3 className="text-xl font-bold text-navy mb-1">Confirm Log Out</h3>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            Are you sure you want to log out of Bachat+? Your wallet data will stay safely saved in your account.
          </p>

          <div className="flex items-center gap-3">
            <Button variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleConfirmLogout}>
              Log Out
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
