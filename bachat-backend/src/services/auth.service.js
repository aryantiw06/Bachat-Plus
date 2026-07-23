// ============================================
// auth.service.js — Authentication & User Initialization
// ============================================
import { auth, db } from '../config/firebase.js';
import logger from '../config/logger.js';
import {
  UnauthorizedError,
  FirestoreUnavailableError,
  ConflictError,
} from '../utils/errors.js';

import * as profileService from './profile.service.js';
import * as walletService from './wallet.service.js';
import * as settingsService from './settings.service.js';
import * as premiumService from './premium.service.js';
import * as analyticsService from './analytics.service.js';
import * as notificationService from './notification.service.js';

/**
 * Extract Bearer token from Authorization header.
 */
export function extractBearerToken(authorizationHeader) {
  if (typeof authorizationHeader !== 'string') return null;
  return authorizationHeader.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() || null;
}

/**
 * Verify Firebase ID token and return normalized user claims.
 */
export async function verifyIdToken(token) {
  if (!token) {
    throw new UnauthorizedError('Not authorized — no token provided');
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || decoded.displayName || 'Bachat+ User',
      photoURL: decoded.picture || null,
      provider: decoded.firebase?.sign_in_provider || 'unknown',
    };
  } catch (error) {
    logger.warn('Firebase token verification failed.', {
      event: 'auth.token_verification_failed',
      error: error.message,
      code: error.code,
    });

    let message = 'Not authorized — token is invalid or expired';
    if (error.code === 'auth/id-token-expired') {
      message = 'Session expired — please sign in again';
    } else if (error.code === 'auth/id-token-revoked') {
      message = 'Session revoked — please sign in again';
    } else if (error.code === 'auth/argument-error') {
      message = 'Malformed token — please sign in again';
    }

    throw new UnauthorizedError(message);
  }
}

/**
 * Fetch all user documents in parallel.
 */
async function fetchUserDocuments(uid) {
  const [profile, wallet, settings, premium, analytics] = await Promise.all([
    profileService.getProfile(uid),
    walletService.getWallet(uid),
    settingsService.getSettings(uid),
    premiumService.getPremium(uid),
    analyticsService.getAnalytics(uid),
  ]);

  return { profile, wallet, settings, premium, analytics };
}

/**
 * Build the bootstrap payload returned to the frontend.
 */
export function buildBootstrapResponse({ profile, wallet, settings, premium, analytics }) {
  return {
    success: true,
    profile: profile || {},
    wallet: wallet || {},
    settings: settings || {},
    premium: premium || {},
    analytics: analytics || {},
  };
}

/**
 * Initialize all default Firestore documents for a new user atomically.
 */
async function initializeNewUser(userClaims) {
  const { uid, email, name, photoURL, provider } = userClaims;

  const profile = profileService.buildDefaultProfile({
    uid,
    email,
    name,
    picture: photoURL,
    provider,
  });
  const wallet = walletService.buildDefaultWallet(uid);
  const settings = settingsService.buildDefaultSettings(uid);
  const premium = premiumService.buildDefaultPremium(uid);
  const analytics = analyticsService.buildDefaultAnalytics(uid);
  const notifications = notificationService.buildDefaultNotifications(uid);

  try {
    const batch = db.batch();

      batch.set(db.collection('users').doc(uid), profile, { merge: true });
      batch.set(db.collection('wallets').doc(uid), wallet, { merge: true });
      batch.set(db.collection('settings').doc(uid), settings, { merge: true });
      batch.set(db.collection('premium').doc(uid), premium, { merge: true });
      batch.set(db.collection('analytics').doc(uid), analytics, { merge: true });
      batch.set(db.collection('notifications').doc(uid), notifications, { merge: true });

    await batch.commit();

    logger.info('Firestore user initialization completed.', {
      event: 'auth.user_initialized',
      uid,
      email,
    });

    return { profile, wallet, settings, premium, analytics };
  } catch (error) {
    logger.error('Firestore user initialization failed.', {
      event: 'auth.user_initialization_failed',
      uid,
      error: error.message,
    });

    if (error.code === 6 || error.code === 'already-exists') {
      throw new ConflictError('User account is already being initialized');
    }

    throw new FirestoreUnavailableError();
  }
}

/**
 * Repair any missing sub-documents for an existing user (partial init recovery).
 */
async function repairMissingDocuments(uid, existing) {
  const repairs = [];

  if (!existing.wallet) repairs.push(walletService.createWallet(uid));
  if (!existing.settings) repairs.push(settingsService.createSettings(uid));
  if (!existing.premium) repairs.push(premiumService.createPremium(uid));
  if (!existing.analytics) repairs.push(analyticsService.createAnalytics(uid));

  const notificationDoc = await notificationService.getNotifications(uid);
  if (!notificationDoc) repairs.push(notificationService.createNotifications(uid));

  if (repairs.length > 0) {
    logger.info('Repairing missing Firestore documents for user.', {
      event: 'auth.documents_repaired',
      uid,
      repairedCount: repairs.length,
    });
    await Promise.all(repairs);
    return fetchUserDocuments(uid);
  }

  return existing;
}

/**
 * Establish an authenticated session: verify token, initialize or load user data.
 */
export async function establishSession(token) {
  logger.info('Authentication attempt received.', { event: 'auth.session_attempt' });

  const userClaims = await verifyIdToken(token);
  const { uid, email } = userClaims;

  let documents;
  try {
    documents = await fetchUserDocuments(uid);
  } catch (error) {
    logger.error('Firestore read failed during session establishment.', {
      event: 'auth.firestore_read_failed',
      uid,
      error: error.message,
    });
    throw new FirestoreUnavailableError();
  }

  if (documents.profile) {
    logger.info('Returning user login.', {
      event: 'auth.returning_user_login',
      uid,
      email,
    });

    documents = await repairMissingDocuments(uid, documents);
    return buildBootstrapResponse(documents);
  }

  logger.info('New user detected — initializing Firestore documents.', {
    event: 'auth.new_user_creation',
    uid,
    email,
  });

  try {
    const initialized = await initializeNewUser(userClaims);
    logger.info('Successful login for new user.', {
      event: 'auth.login_success',
      uid,
      email,
      isNewUser: true,
    });
    return buildBootstrapResponse(initialized);
  } catch (error) {
    if (error instanceof ConflictError) {
      const existing = await fetchUserDocuments(uid);
      if (existing.profile) {
        logger.info('Concurrent initialization resolved — returning existing user.', {
          event: 'auth.duplicate_init_resolved',
          uid,
        });
        return buildBootstrapResponse(existing);
      }
    }
    throw error;
  }
}

/**
 * Get current authenticated user profile and related data.
 */
export async function getCurrentUser(uid) {
  try {
    const documents = await fetchUserDocuments(uid);

    if (!documents.profile) {
      throw new UnauthorizedError('User profile not found — please establish a session first');
    }

    const repaired = await repairMissingDocuments(uid, documents);

    logger.info('Current user profile fetched.', {
      event: 'auth.me_fetched',
      uid,
    });

    return buildBootstrapResponse(repaired);
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;

    logger.error('Firestore read failed during getCurrentUser.', {
      event: 'auth.firestore_read_failed',
      uid,
      error: error.message,
    });
    throw new FirestoreUnavailableError();
  }
}

/**
 * Log out user by revoking Firebase refresh tokens.
 */
export async function logout(uid) {
  try {
    await auth.revokeRefreshTokens(uid);

    logger.info('User logged out successfully.', {
      event: 'auth.logout_success',
      uid,
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    logger.error('Logout failed.', {
      event: 'auth.logout_failed',
      uid,
      error: error.message,
    });
    throw new FirestoreUnavailableError('Unable to complete logout at this time');
  }
}
