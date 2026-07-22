// ============================================
// settings.service.js — User Settings Firestore Operations
// ============================================
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';

const COLLECTION = 'settings';

/**
 * Default settings document for a new user.
 */
export function buildDefaultSettings(uid) {
  const now = new Date().toISOString();
  return {
    uid,
    theme: 'light',
    pushNotifications: true,
    emailNotifications: true,
    dailyAITips: true,
    marketAlerts: false,
    roundUpMultiplier: 1,
    autoPay: false,
    biometric: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Fetch settings by UID. Returns null if not found.
 */
export async function getSettings(uid) {
  const doc = await db.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

/**
 * Create settings document.
 */
export async function createSettings(uid) {
  const settings = buildDefaultSettings(uid);
  await db.collection(COLLECTION).doc(uid).set(settings, { merge: true });
  logger.info('Default settings created.', { uid });
  return settings;
}

/**
 * Update settings fields.
 */
export async function updateSettings(uid, updates) {
  updates.updatedAt = new Date().toISOString();
  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });
  return { uid, ...updates };
}
