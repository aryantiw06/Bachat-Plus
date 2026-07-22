// ============================================
// wallet.service.js — Wallet Firestore Operations
// ============================================
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';

const COLLECTION = 'wallets';

/**
 * Default wallet document for a new user.
 */
export function buildDefaultWallet(uid) {
  const now = new Date().toISOString();
  return {
    uid,
    investmentWallet: 0,
    todayRoundup: 0,
    monthlyTotal: 0,
    lifetimeSavings: 0,
    goalName: 'Emergency Fund',
    goalAmount: 10000,
    goalProgress: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Fetch wallet by UID. Returns null if not found.
 */
export async function getWallet(uid) {
  const doc = await db.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

/**
 * Create wallet document.
 */
export async function createWallet(uid) {
  const wallet = buildDefaultWallet(uid);
  await db.collection(COLLECTION).doc(uid).set(wallet, { merge: true });
  logger.info('Default wallet created.', { uid });
  return wallet;
}

/**
 * Update wallet fields.
 */
export async function updateWallet(uid, updates) {
  updates.updatedAt = new Date().toISOString();
  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });
  return { uid, ...updates };
}
