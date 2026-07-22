// ============================================
// premium.service.js — Premium Status Firestore Operations
// ============================================
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';

const COLLECTION = 'premium';

/**
 * Default premium document for a new user.
 */
export function buildDefaultPremium(uid) {
  const now = new Date().toISOString();
  return {
    uid,
    isPremium: false,
    plan: 'Free',
    activatedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Fetch premium status by UID. Returns null if not found.
 */
export async function getPremium(uid) {
  const doc = await db.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

/**
 * Create premium document.
 */
export async function createPremium(uid) {
  const premium = buildDefaultPremium(uid);
  await db.collection(COLLECTION).doc(uid).set(premium, { merge: true });
  logger.info('Default premium record created.', { uid });
  return premium;
}

/**
 * Update premium fields.
 */
export async function updatePremium(uid, updates) {
  updates.updatedAt = new Date().toISOString();
  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });
  return { uid, ...updates };
}
