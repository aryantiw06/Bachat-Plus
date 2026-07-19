import { Outlet, Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

/**
 * AuthLayout — centered, minimal layout for Login and Signup.
 * Deliberately distraction-free: no sidebar, no navbar links.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="h-10 w-10 rounded-xl bg-navy flex items-center justify-center">
            <Wallet size={20} className="text-mint" />
          </span>
          <span className="font-display font-bold text-2xl text-navy">
            Bachat<span className="text-mint">+</span>
          </span>
        </Link>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm shadow-navy/5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}