// ============================================
// src/firebase.js — Firebase Initialization
// ============================================
// This file does THREE things:
//   1. Reads Firebase config from environment variables (.env)
//   2. Initializes the Firebase app (one-time setup)
//   3. Exports the `auth` object so any component can use it
//
// WHY use environment variables?
//   → Keeps API keys out of your source code.
//   → Vite exposes only variables prefixed with VITE_ to the browser.
//   → Your .env is already in .gitignore, so keys stay private.
// ============================================

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ---- Firebase Configuration ----
// Each value maps to a setting in your Firebase Console:
//   Project Settings → General → Your apps → Web app
const firebaseConfig = {
  // apiKey — Identifies your Firebase project to Google's servers.
  //          It is NOT a secret (it's embedded in client code), but you
  //          should still keep it in .env so you can swap projects easily.
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  // authDomain — The domain Firebase Auth uses for sign-in redirects
  //              and OAuth pop-ups (e.g. Google Sign-In).
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  // projectId — Unique identifier for your Firebase project.
  //             Used internally by every Firebase service.
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

  // storageBucket — Cloud Storage bucket URL. Not used now,
  //                 but needed if you later add file uploads.
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  // messagingSenderId — Identifies the sender for Firebase Cloud
  //                     Messaging (push notifications). Not used yet.
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  // appId — Unique identifier for THIS specific web app registration
  //         within your Firebase project.
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

if (missingConfig.length > 0) {
  throw new Error(`Missing Firebase web configuration: ${missingConfig.join(', ')}`);
}

// ---- Initialize Firebase ----
// initializeApp() creates a Firebase App instance. You only call this ONCE.
// All other Firebase services (Auth, Firestore, etc.) reference this instance.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ---- Initialize Firebase Authentication ----
// getAuth() returns the Auth service tied to the app above.
// We export it so any component can import { auth } from '../firebase'
// and call signIn, signOut, onAuthStateChanged, etc.
export const auth = getAuth(app);

// ---- Initialize Firestore ----
export const db = getFirestore(app);

// Export the app too, in case other Firebase services need it later
// (e.g., Firestore, Storage).
export default app;
