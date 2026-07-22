// ============================================
// profile.service.js — User Profile Firestore Operations
// ============================================
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';

const COLLECTION = 'users';

/**
 * Default profile document for a brand-new user.
 */
export function buildDefaultProfile({ uid, email, name, picture, provider }) {
  const now = new Date().toISOString();
  return {
    uid,
    name: name || 'Bachat+ User',
    email: email || null,
    photoURL: picture || null,
    provider: provider || 'google.com',
    createdAt: now,
    updatedAt: now,
    memberSince: now,
  };
}

/**
 * Fetch profile by UID. Returns null if not found.
 */
export async function getProfile(uid) {
  const doc = await db.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

/**
 * Create profile document. Uses set with merge to avoid clobbering
 * an existing document in race-condition scenarios.
 */
export async function createProfile(profileData) {
  await db.collection(COLLECTION).doc(profileData.uid).set(profileData, { merge: true });
  logger.info('New user profile created in Firestore.', { uid: profileData.uid });
  return profileData;
}

/**
 * Update profile fields.
 */
export async function updateProfile(uid, updates) {
  updates.updatedAt = new Date().toISOString();
  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });
  return { uid, ...updates };
}
