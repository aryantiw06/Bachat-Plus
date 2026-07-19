import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

/**
 * NotFound — shown for any URL that doesn't match a known route.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6 text-center">
      <span className="h-16 w-16 rounded-2xl bg-navy flex items-center justify-center mb-6">
        <Compass size={28} className="text-mint" />
      </span>
      <h1 className="text-5xl font-bold text-navy mb-2">404</h1>
      <p className="text-text-muted mb-8">
        This page doesn't exist — let's get you back on track.
      </p>
      <Link to="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  );
}