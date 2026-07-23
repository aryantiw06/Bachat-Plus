// Firebase Admin SDK is initialized once and never falls back to in-memory
// data. A deployed API must never authenticate mock users.
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import env from './env.js';
import logger from './logger.js';

const normalizePrivateKey = (privateKey) => privateKey.replace(/\\n/g, '\n').trim();

function validateCredentials() {
  const { projectId, clientEmail, privateKey } = env.firebase;
  const missing = [!projectId && 'FIREBASE_PROJECT_ID', !clientEmail && 'FIREBASE_CLIENT_EMAIL', !privateKey && 'FIREBASE_PRIVATE_KEY'].filter(Boolean);
  if (missing.length) throw new Error(`Missing Firebase Admin environment variables: ${missing.join(', ')}`);
  const normalizedKey = normalizePrivateKey(privateKey);
  if (!normalizedKey.includes('-----BEGIN PRIVATE KEY-----') || /dummy|replace|your[-_ ]?private|example/i.test(normalizedKey)) {
    throw new Error('FIREBASE_PRIVATE_KEY is not a valid service-account private key.');
  }
  return { projectId, clientEmail, privateKey: normalizedKey };
}

const credentials = validateCredentials();
const app = getApps()[0] || initializeApp({ credential: cert(credentials) });
const auth = getAuth(app);
const db = getFirestore(app);

logger.info('Firebase Admin initialized.', { event: 'firebase.initialized', projectId: credentials.projectId, clientEmail: credentials.clientEmail });

export { app, auth, db };
export default db;
