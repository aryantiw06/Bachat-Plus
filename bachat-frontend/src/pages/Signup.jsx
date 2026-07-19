import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

// ============================================
// Signup Page — Full Firebase Authentication
// ============================================
// Features:
//   • Email & Password registration
//   • Google One-Click signup
//   • Client-side validation (before hitting Firebase)
//   • Firebase error handling (user-friendly messages)
//   • Loading states on buttons
//   • Redirect to /dashboard on success
// ============================================

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, authError, clearError } = useAuth();

  // ---- Form State ----
  // Each input field has its own state variable.
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ---- UI State ----
  // Separate loading flags for each action so the correct
  // button shows a spinner while the other stays clickable.
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ---- Validation State ----
  // Each field can have its own error message shown below the input.
  // These are CLIENT-SIDE validations (checked before calling Firebase).
  const [errors, setErrors] = useState({});

  // ---- Client-Side Validation ----
  // Returns true if all fields are valid, false otherwise.
  // Sets per-field error messages for the UI.
  function validate() {
    const newErrors = {};

    // Full Name — required, at least 2 characters
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    // Email — required, basic format check
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password — required, minimum 6 characters (Firebase requirement)
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // Confirm Password — must match password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    // If newErrors has zero keys, validation passed
    return Object.keys(newErrors).length === 0;
  }

  // ---- Handle Email/Password Signup ----
  async function handleSignup(e) {
    // Prevent the default form submission (page reload)
    e.preventDefault();

    // Run client-side validation first
    if (!validate()) return;

    setLoading(true);
    clearError(); // Clear any previous Firebase errors

    // Call the signup function from AuthContext
    // It returns { success: true, user } or { success: false, error }
    const result = await signup(email, password, fullName.trim());

    setLoading(false);

    if (result.success) {
      // Signup successful — redirect to dashboard
      navigate('/dashboard');
    }
    // If failed, authError is already set by AuthContext
    // and will display below the form via the error banner
  }

  // ---- Handle Google Signup ----
  async function handleGoogleSignup() {
    setGoogleLoading(true);
    clearError();

    const result = await loginWithGoogle();

    setGoogleLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  }

  // ---- Clear field error when user starts typing ----
  // This removes the red error text once the user corrects the field.
  function handleChange(setter, field) {
    return (e) => {
      setter(e.target.value);
      // Remove this field's error (if any) as user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
      // Also clear any Firebase-level error
      if (authError) clearError();
    };
  }

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h2 className="text-xl font-bold text-navy mb-1">Create your account</h2>
      <p className="text-sm text-text-muted mb-6">
        Start rounding up your way to wealth
      </p>

      {/* ---- Firebase Error Banner ---- */}
      {/* Shows errors from Firebase (e.g. "email already in use") */}
      {authError && (
        <div className="mb-4 rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
          {authError}
        </div>
      )}

      {/* ---- Google Signup Button ---- */}
      {/* Placed at the top for visibility — Google signup is the fastest path */}
      <Button
        variant="secondary"
        fullWidth
        onClick={handleGoogleSignup}
        loading={googleLoading}
        disabled={loading}
      >
        {/* Inline Google "G" SVG — no external dependency needed */}
        <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* ---- Divider ---- */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted uppercase tracking-wider">
          or sign up with email
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ---- Email/Password Form ---- */}
      {/* Using <form> so Enter key submits, and for accessibility */}
      <form onSubmit={handleSignup} noValidate>
        <div className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="Aryan Sharma"
            value={fullName}
            onChange={handleChange(setFullName, 'fullName')}
            error={errors.fullName}
            disabled={loading}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleChange(setEmail, 'email')}
            error={errors.email}
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={handleChange(setPassword, 'password')}
            error={errors.password}
            helperText={!errors.password ? 'At least 6 characters' : ''}
            disabled={loading}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={handleChange(setConfirmPassword, 'confirmPassword')}
            error={errors.confirmPassword}
            disabled={loading}
          />

          {/* Submit button — type="submit" triggers form's onSubmit */}
          <Button
            variant="primary"
            fullWidth
            type="submit"
            loading={loading}
            disabled={googleLoading}
          >
            Create Account
          </Button>
        </div>
      </form>

      {/* ---- Link to Login ---- */}
      <p className="text-sm text-text-muted text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-teal font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}