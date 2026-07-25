// ============================================
// payment.service.js — Payment & Transaction Engine
// ============================================
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';
import { calculateRoundUp } from '../utils/roundUp.js';
import {
  NotFoundError,
  FirestoreUnavailableError,
  BadRequestError,
} from '../utils/errors.js';

import * as walletService from './wallet.service.js';
import * as analyticsService from './analytics.service.js';
import traceSpan from '../utils/tracer.js';

const COLLECTION = 'transactions';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export { calculateRoundUp };

/**
 * Validate payment input. Throws BadRequestError on failure.
 */
export function validatePaymentInput({ amount, merchant }) {
  if (amount === null || amount === undefined) {
    throw new BadRequestError('Amount is required');
  }

  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new BadRequestError('Invalid amount');
  }

  if (amount <= 0) {
    throw new BadRequestError('Amount must be greater than zero');
  }

  if (merchant === null || merchant === undefined || typeof merchant !== 'string') {
    throw new BadRequestError('Merchant is required');
  }

  if (merchant.trim().length === 0) {
    throw new BadRequestError('Merchant cannot be empty');
  }
}

/**
 * Build a transaction document.
 */
export function buildTransaction({ uid, amount, roundUp, merchant, category }) {
  const now = new Date().toISOString();
  const id = uuidv4();

  return {
    id,
    userId: uid,
    amount,
    roundUp,
    merchant: merchant.trim(),
    category: category?.trim() || null,
    status: 'completed',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create a payment transaction and update wallet + analytics.
 */
export async function createPayment(uid, { amount, merchant, category }) {
  return traceSpan('payment.process', { uid, amount, merchant, category }, async () => {
    validatePaymentInput({ amount, merchant });

    await walletService.requireWallet(uid);

    const roundUp = await traceSpan('payment.calculate_roundup', { amount }, async () => calculateRoundUp(amount));
    const transaction = buildTransaction({ uid, amount, roundUp, merchant, category });

    try {
      const batch = db.batch();

      batch.set(db.collection(COLLECTION).doc(transaction.id), transaction);

      const wallet = await traceSpan('firestore.read', { collection: 'wallets', docId: uid }, () => walletService.getWallet(uid));
      const walletBalance = (wallet.walletBalance ?? 0) + roundUp;
      const totalRoundups = (wallet.totalRoundups ?? 0) + roundUp;
      const totalTransactions = (wallet.totalTransactions ?? 0) + 1;
      const now = transaction.createdAt;

      await traceSpan('wallet.update', { uid, roundUp, walletBalance }, async () => {
        batch.set(
          db.collection('wallets').doc(uid),
          {
            walletBalance,
            totalRoundups,
            totalTransactions,
            lastTransactionAt: now,
            investmentWallet: walletBalance,
            lifetimeSavings: totalRoundups,
            updatedAt: now,
          },
          { merge: true }
        );
      });

      const analytics = (await traceSpan('firestore.read', { collection: 'analytics', docId: uid }, () => analyticsService.getAnalytics(uid))) || analyticsService.buildDefaultAnalytics(uid);
      const totalSpent = (analytics.totalSpent ?? 0) + amount;
      const totalSaved = (analytics.totalSaved ?? 0) + roundUp;
      const transactionCount = (analytics.transactionCount ?? 0) + 1;
      const averageRoundUp = Math.round((totalSaved / transactionCount) * 100) / 100;

      batch.set(
        db.collection('analytics').doc(uid),
        {
          totalSpent,
          totalSaved,
          transactionCount,
          averageRoundUp,
          monthlySpending: totalSpent,
          monthlySavings: totalSaved,
          totalTransactions: transactionCount,
          updatedAt: now,
        },
        { merge: true }
      );

      await traceSpan('firestore.write', { type: 'batch_commit', uid }, () => batch.commit());

      logger.info('Payment created.', {
        event: 'payment.created',
        uid,
        transactionId: transaction.id,
        amount,
        roundUp,
        merchant: transaction.merchant,
      });

      logger.info('Transaction saved.', {
        event: 'transaction.saved',
        uid,
        transactionId: transaction.id,
      });

      const walletSummary = await walletService.getWalletSummary(uid);

      return {
        success: true,
        transaction,
        wallet: walletSummary,
      };
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Payment creation failed.', {
        event: 'payment.failed',
        uid,
        error: error.message,
      });
      throw new FirestoreUnavailableError();
    }
  });
}

/**
 * Parse pagination query parameters.
 */
export function parsePagination(query) {
  const page = Math.max(DEFAULT_PAGE, parseInt(query.page, 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT)
  );

  return { page, limit };
}

/**
 * Get paginated payment history for a user (newest first).
 */
export async function getPaymentHistory(uid, query = {}) {
  const { page, limit } = parsePagination(query);
  const offset = (page - 1) * limit;

  try {
    const snapshot = await traceSpan('firestore.read', { collection: COLLECTION, query: 'userId == uid', uid }, () =>
      db.collection(COLLECTION).where('userId', '==', uid).get()
    );

    const allTransactions = snapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = allTransactions.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const transactions = allTransactions.slice(offset, offset + limit);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error('Failed to fetch payment history.', {
      event: 'payment.history_failed',
      uid,
      error: error.message,
    });
    throw new FirestoreUnavailableError();
  }
}

/**
 * Get a single transaction by ID.
 */
export async function getPaymentById(uid, transactionId) {
  try {
    const doc = await traceSpan('firestore.read', { collection: COLLECTION, docId: transactionId, uid }, () =>
      db.collection(COLLECTION).doc(transactionId).get()
    );

    if (!doc.exists) {
      throw new NotFoundError('Transaction not found');
    }

    const transaction = doc.data();

    if (transaction.userId !== uid) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;

    logger.error('Failed to fetch transaction.', {
      event: 'payment.fetch_failed',
      uid,
      transactionId,
      error: error.message,
    });
    throw new FirestoreUnavailableError();
  }
}
