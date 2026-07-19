import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import Button from '../ui/Button.jsx';

/**
 * Navbar — top navigation bar shown on public/marketing pages
 * (currently just the Landing page).
 */
export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-navy flex items-center justify-center">
            <Wallet size={18} className="text-mint" />
          </span>
          <span className="font-display font-bold text-lg text-navy">
            Bachat<span className="text-mint">+</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Log In
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
}