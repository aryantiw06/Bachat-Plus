// ============================================
// firebase.js — Firebase Admin SDK Initialization
// ============================================
import admin from 'firebase-admin';
import env from './env.js';
import logger from './logger.js';

let db;
let auth;
let firebaseInitialized = false;

const initFirebase = () => {
  const { projectId, clientEmail, privateKey } = env.firebase;

  if (!projectId || !clientEmail || !privateKey) {
    logger.warn('Firebase environment variables are incomplete. Bootstrapping with Mock Database services.');
    return setupMocks();
  }

  try {
    const isDummyKey = !privateKey.includes('-----BEGIN PRIVATE KEY-----');

    if (isDummyKey) {
      logger.info('Dummy private key detected. Initializing Firebase Admin SDK in Local Emulator/Mock mode.');
      // Initialize with projectId only for emulator/offline compatibility
      admin.initializeApp({
        projectId: projectId,
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      logger.info('Firebase Admin SDK initialized successfully with Service Account credentials.');
    }

    db = admin.firestore();
    auth = admin.auth();
    firebaseInitialized = true;
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK. Falling back to Mock Database service.', error);
    setupMocks();
  }
};

const setupMocks = () => {
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => ({ success: true }),
        update: async () => ({ success: true }),
      }),
    }),
  };
  auth = {
    verifyIdToken: async () => ({ uid: 'mock-uid-demo' }),
  };
  firebaseInitialized = false;
};

// Initialize on load
initFirebase();

export { admin, db, auth, firebaseInitialized };
export default db;
