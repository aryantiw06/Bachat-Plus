// ============================================
// analytics.service.js — Analytics Snapshot Firestore Operations
// ============================================
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';
import { NotFoundError } from '../utils/errors.js';

const COLLECTION = 'analytics';

/**
 * Default analytics document for a new user.
 */
export function buildDefaultAnalytics(uid) {
  const now = new Date().toISOString();
  return {
    uid,
    totalSpent: 0,
    totalSaved: 0,
    transactionCount: 0,
    averageRoundUp: 0,
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

/**
 * Apply payment metrics after a transaction.
 */
export async function applyPaymentToAnalytics(uid, amount, roundUp) {
  let analytics = await getAnalytics(uid);
  if (!analytics) {
    analytics = buildDefaultAnalytics(uid);
  }

  const totalSpent = (analytics.totalSpent ?? 0) + amount;
  const totalSaved = (analytics.totalSaved ?? 0) + roundUp;
  const transactionCount = (analytics.transactionCount ?? 0) + 1;
  const averageRoundUp = transactionCount > 0
    ? Math.round((totalSaved / transactionCount) * 100) / 100
    : 0;

  const now = new Date().toISOString();
  const updates = {
    totalSpent,
    totalSaved,
    transactionCount,
    averageRoundUp,
    monthlySpending: totalSpent,
    monthlySavings: totalSaved,
    totalTransactions: transactionCount,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });

  logger.info('Analytics updated.', {
    event: 'analytics.updated',
    uid,
    totalSpent,
    totalSaved,
    transactionCount,
    averageRoundUp,
  });

  return updates;
}

/**
 * Reset payment-related analytics totals (development only).
 */
export async function resetAnalyticsPaymentStats(uid) {
  const analytics = await getAnalytics(uid);
  if (!analytics) {
    throw new NotFoundError('Analytics not found');
  }

  const now = new Date().toISOString();
  const updates = {
    totalSpent: 0,
    totalSaved: 0,
    transactionCount: 0,
    averageRoundUp: 0,
    monthlySpending: 0,
    monthlySavings: 0,
    totalTransactions: 0,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });

  logger.info('Analytics payment stats reset.', { event: 'analytics.reset', uid });

  return updates;
}
