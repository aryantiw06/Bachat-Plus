
// ============================================
// firebase.js — Firebase Admin SDK Initialization
// ============================================
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';
import env from './env.js';
import logger from './logger.js';
import { createMockFirestore } from '../utils/mockFirestore.js';

let db;
let auth;
let firebaseInitialized = false;

const MOCK_TOKEN = 'mock-token';

const normalizePrivateKey = (privateKey) => privateKey.replace(/\\n/g, '\n');

const validateFirebaseCredentials = () => {
  const { projectId, clientEmail, privateKey } = env.firebase;
  const missing = [];

  if (!projectId) missing.push('FIREBASE_PROJECT_ID');
  if (!clientEmail) missing.push('FIREBASE_CLIENT_EMAIL');
  if (!privateKey) missing.push('FIREBASE_PRIVATE_KEY');

  return {
    valid: missing.length === 0,
    missing,
    projectId,
    clientEmail,
    privateKey,
  };
};

const createAuthError = (message, code = 'auth/argument-error') => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const createMockVerifyIdToken = () => async (token) => {
  if (token !== MOCK_TOKEN) {
    throw createAuthError('Firebase ID token has invalid signature.');
  }

  return {
    uid: 'mock-uid-demo',
    email: 'demo@bachat.com',
    name: 'Mock User',
  };
};

const setupMocks = () => {
  db = createMockFirestore();

  auth = {
    verifyIdToken: createMockVerifyIdToken(),
    revokeRefreshTokens: async () => ({ success: true }),
  };

  firebaseInitialized = false;

  logger.info('Firebase running in mock mode.');
};

const setupUnavailable = () => {
  const authUnavailable = () => {
    throw createAuthError('Firebase Auth is not initialized.', 'auth/internal-error');
  };

  auth = {
    verifyIdToken: authUnavailable,
    revokeRefreshTokens: authUnavailable,
  };

  db = {
    collection: () => {
      throw new Error('Firestore is not initialized');
    },
  };

  firebaseInitialized = false;
};

const initFirebase = () => {
  if (env.enableMockAuth) {
    logger.info('Mock authentication enabled.');
  } else {
    logger.info('Mock authentication disabled.');
  }

  const credentials = validateFirebaseCredentials();
  const isDummyPrivateKey = credentials.privateKey && credentials.privateKey.includes('MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtRJq7Vj');

  if (!credentials.valid || env.enableMockAuth || isDummyPrivateKey) {
    logger.info('Firebase credentials incomplete or dummy key detected — using in-memory database mock.');
    setupMocks();
    return;
  }

  try {
    const { projectId, clientEmail, privateKey } = credentials;

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: normalizePrivateKey(privateKey),
        }),
      });
    }

    db = getFirestore();
    auth = getAuth();
    firebaseInitialized = true;

    logger.info('Firebase initialized successfully.');
  } catch (error) {
    logger.error('Firebase initialization failed.', error);

    if (env.enableMockAuth) {
      setupMocks();
      return;
    }

    setupUnavailable();
  }
};

initFirebase();

export { admin, db, auth, firebaseInitialized };


export default db;
