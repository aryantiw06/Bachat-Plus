// ============================================
// src/contexts/AuthContext.jsx — Authentication Context
// ============================================
// This file does FOUR things:
//   1. Creates a React Context to share auth state app-wide
//   2. Provides an AuthProvider component that wraps the app
//   3. Listens to Firebase's onAuthStateChanged to persist sessions
//   4. Exposes helper functions (signup, login, logout, etc.)
//
// HOW IT WORKS:
//   React Context lets you pass data through the component tree
//   without prop-drilling. Any component can call useAuth() to get
//   the current user and auth functions — no props needed.
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
import authService from '../services/auth.service';

// ---- 1. Create the Context ----
// createContext() creates a "channel" that components can subscribe to.
// We pass `null` as the default (no user logged in initially).
const AuthContext = createContext(null);

// ---- 2. Custom Hook: useAuth() ----
// Instead of writing useContext(AuthContext) everywhere,
// we export a clean useAuth() hook. Components just do:
//   const { user, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);

  // Safety check: if someone uses useAuth() outside of AuthProvider,
  // throw a helpful error instead of silently returning undefined.
  if (!context) {
    throw new Error('useAuth() must be used inside an <AuthProvider>');
  }
  return context;
}

// ---- 3. AuthProvider Component ----
// This wraps your entire app (in main.jsx or App.jsx).
// It manages three pieces of state:
//   • user        — the currently logged-in Firebase user (or null)
//   • loading     — true while Firebase checks the saved session
//   • authError   — the last auth error message (for UI display)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // ---- Persist Login State ----
  // onAuthStateChanged is Firebase's session listener.
  // It fires ONCE on page load (checking if a session exists in
  // the browser's IndexedDB), and again whenever the user logs
  // in or out. This is what makes "stay logged in" work.
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await authService.createSession();
        } catch (err) {
          console.warn('Backend auth session bootstrap warning:', err);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ---- Helper: Clear previous errors ----
  // Called at the start of every auth action so stale
  // error messages don't persist between attempts.
  function clearError() {
    setAuthError('');
  }

  // ---- Helper: Map Firebase error codes to user-friendly messages ----
  // Firebase returns technical codes like "auth/user-not-found".
  // We translate these into plain English for the UI.
  function getErrorMessage(errorCode) {
    const errorMap = {
      'auth/email-already-in-use': 'This email is already registered. Try logging in.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please wait and try again.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
      'auth/network-request-failed': 'Network error. Check your internet connection.',
    };
    return errorMap[errorCode] || 'Something went wrong. Please try again.';
  }

  // ============================================
  // AUTH FUNCTIONS — exported via context
  // ============================================

  // ---- Sign Up with Email & Password ----
  // Creates a new user in Firebase Authentication.
  // Also sets displayName via updateProfile so we can
  // greet the user by name across the app.
  async function signup(email, password, displayName) {
    clearError();
    try {
      // createUserWithEmailAndPassword registers the user and
      // automatically signs them in (sets the session).
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Set the user's display name on their Firebase profile.
      // This is optional but very useful — it persists across sessions.
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      return { success: true, user: result.user };
    } catch (error) {
      const message = getErrorMessage(error.code);
      setAuthError(message);
      return { success: false, error: message };
    }
  }

  // ---- Log In with Email & Password ----
  // Signs in an existing user. Firebase automatically saves
  // the session — the user stays logged in even after refresh.
  async function login(email, password) {
    clearError();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      const message = getErrorMessage(error.code);
      setAuthError(message);
      return { success: false, error: message };
    }
  }

  // ---- Log In / Sign Up with Google ----
  // Opens a Google sign-in popup. If the user doesn't have an
  // account yet, Firebase creates one automatically.
  // This handles BOTH login and signup in one function.
  async function loginWithGoogle() {
    clearError();
    try {
      // GoogleAuthProvider tells Firebase to use Google OAuth
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      const message = getErrorMessage(error.code);
      setAuthError(message);
      return { success: false, error: message };
    }
  }

  // ---- Log Out ----
  // Clears the Firebase session from the browser.
  // onAuthStateChanged will fire and set user → null.
  async function logout() {
    clearError();
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error.code);
      setAuthError(message);
      return { success: false, error: message };
    }
  }

  // ---- Forgot Password ----
  // Sends a password-reset email via Firebase.
  // The email contains a link that lets the user set a new password.
  async function resetPassword(email) {
    clearError();
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error.code);
      setAuthError(message);
      return { success: false, error: message };
    }
  }

  // ---- Context Value ----
  // Everything listed here is available to any component
  // that calls useAuth().
  const value = {
    user,         // Current Firebase user object (or null)
    loading,      // true while checking saved session on page load
    authError,    // Latest error message string (or '')
    clearError,   // Manually clear the error (e.g. when user starts typing)

    // Auth actions
    signup,           // (email, password, displayName) → { success, user/error }
    login,            // (email, password) → { success, user/error }
    loginWithGoogle,  // () → { success, user/error }
    logout,           // () → { success }
    resetPassword,    // (email) → { success }
  };

  // ---- Render ----
  // While Firebase is checking if a session exists (first page load),
  // we show nothing (or you could show a full-screen loader).
  // This prevents a flash of the login page for already-logged-in users.
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}
