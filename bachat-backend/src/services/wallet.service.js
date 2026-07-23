// ============================================
// wallet.service.js — Wallet Firestore Operations
// ============================================
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';
import { NotFoundError, FirestoreUnavailableError } from '../utils/errors.js';

const COLLECTION = 'wallets';

/**
 * Default wallet document for a new user.
 */
export function buildDefaultWallet(uid) {
  const now = new Date().toISOString();
  return {
    uid,
    walletBalance: 0,
    totalRoundups: 0,
    totalTransactions: 0,
    lastTransactionAt: null,
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

/**
 * Return wallet summary for GET /wallet. Auto-creates if missing.
 */
export async function getWalletSummary(uid) {
  let wallet = await getWallet(uid);
  if (!wallet) {
    wallet = await createWallet(uid);
  }

  return {
    walletBalance: wallet.walletBalance ?? wallet.investmentWallet ?? 0,
    totalRoundups: wallet.totalRoundups ?? wallet.lifetimeSavings ?? 0,
    totalTransactions: wallet.totalTransactions ?? 0,
    lastTransactionAt: wallet.lastTransactionAt || null,
  };
}

/**
 * Apply round-up credit after a payment.
 */
export async function applyPaymentToWallet(uid, roundUp) {
  let wallet = await getWallet(uid);
  if (!wallet) {
    wallet = await createWallet(uid);
  }

  const now = new Date().toISOString();
  const walletBalance = (wallet.walletBalance ?? wallet.investmentWallet ?? 0) + roundUp;
  const totalRoundups = (wallet.totalRoundups ?? wallet.lifetimeSavings ?? 0) + roundUp;
  const totalTransactions = (wallet.totalTransactions ?? 0) + 1;

  const updates = {
    walletBalance,
    totalRoundups,
    totalTransactions,
    lastTransactionAt: now,
    investmentWallet: walletBalance,
    lifetimeSavings: totalRoundups,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });

  logger.info('Wallet updated.', {
    event: 'wallet.updated',
    uid,
    roundUp,
    walletBalance,
    totalRoundups,
    totalTransactions,
  });

  return {
    walletBalance,
    totalRoundups,
    totalTransactions,
    lastTransactionAt: now,
  };
}

/**
 * Reset wallet payment totals (development only).
 */
export async function resetWallet(uid) {
  let wallet = await getWallet(uid);
  if (!wallet) {
    wallet = await createWallet(uid);
  }

  const now = new Date().toISOString();
  const updates = {
    walletBalance: 0,
    totalRoundups: 0,
    totalTransactions: 0,
    lastTransactionAt: null,
    investmentWallet: 0,
    lifetimeSavings: 0,
    todayRoundup: 0,
    monthlyTotal: 0,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });

  logger.info('Wallet reset.', { event: 'wallet.reset', uid });

  return {
    walletBalance: 0,
    totalRoundups: 0,
    totalTransactions: 0,
  };
}

/**
 * Ensure wallet exists or auto-create.
 */
export async function requireWallet(uid) {
  try {
    let wallet = await getWallet(uid);
    if (!wallet) {
      wallet = await createWallet(uid);
    }
    return wallet;
  } catch (error) {
    logger.error('Failed to ensure wallet existence:', error);
    throw new FirestoreUnavailableError();
  }
}
