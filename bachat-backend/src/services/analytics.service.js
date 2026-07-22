// ============================================
// analytics.service.js — Analytics Snapshot Firestore Operations
// ============================================
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';

const COLLECTION = 'analytics';

/**
 * Default analytics document for a new user.
 */
export function buildDefaultAnalytics(uid) {
  const now = new Date().toISOString();
  return {
    uid,
    financialScore: 50,
    monthlySavings: 0,
    monthlySpending: 0,
    topCategory: null,
    topMerchant: null,
    totalTransactions: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Fetch analytics by UID. Returns null if not found.
 */
export async function getAnalytics(uid) {
  const doc = await db.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

/**
 * Create analytics document.
 */
export async function createAnalytics(uid) {
  const analytics = buildDefaultAnalytics(uid);
  await db.collection(COLLECTION).doc(uid).set(analytics, { merge: true });
  logger.info('Default analytics record created.', { uid });
  return analytics;
}

/**
 * Update analytics fields.
 */
export async function updateAnalytics(uid, updates) {
  updates.updatedAt = new Date().toISOString();
  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });
  return { uid, ...updates };
}
