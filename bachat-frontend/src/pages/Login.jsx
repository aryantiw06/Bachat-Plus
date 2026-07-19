import { Link } from 'react-router-dom';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

/**
 * Login — placeholder form UI only. No Firebase, no validation,
 * no submit logic yet. Wired up in the Authentication module.
 */
export default function Login() {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy mb-1">Welcome back</h2>
      <p className="text-sm text-text-muted mb-6">Log in to your Bachat+ account</p>

      <div className="flex flex-col gap-4">
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
        <Button variant="primary" fullWidth>Log In</Button>
      </div>

      <p className="text-sm text-text-muted text-center mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-teal font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}