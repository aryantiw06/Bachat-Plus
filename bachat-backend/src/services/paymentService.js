import db from '../config/firebase.js';
import logger from '../utils/logger.js';

export class PaymentService {
  /**
   * Process a payment, calculate round-up, save transaction, and update wallet & analytics.
   */
  async processPayment({ userId, amount, merchant, category = 'General' }) {
    const numAmount = Number(amount);
    
    // Calculate round-up: nearest ₹10
    const nextTen = Math.ceil(numAmount / 10) * 10;
    const rawRoundUp = nextTen - numAmount;
    const roundUp = Math.round(rawRoundUp * 100) / 100;

    logger.logEvent('Payment Created', { userId, amount: numAmount, merchant, category });
    logger.logEvent('Round-up Calculated', { amount: numAmount, roundUp });

    const now = new Date().toISOString();
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const transactionData = {
      id: transactionId,
      userId,
      amount: numAmount,
      roundUp,
      merchant: merchant.trim(),
      category: category ? category.trim() : 'General',
      status: 'completed',
      createdAt: now,
      updatedAt: now
    };

    // Save transaction doc in Firestore
    await db.collection('transactions').doc(transactionId).set(transactionData);
    logger.logEvent('Transaction Saved', { transactionId, userId });

    // Update Wallet
    const walletRef = db.collection('wallets').doc(userId);
    const walletSnap = await walletRef.get();

    let currentWallet = {
      walletBalance: 0,
      totalRoundups: 0,
      totalTransactions: 0,
      lastTransactionAt: ''
    };

    if (walletSnap.exists) {
      const existing = walletSnap.data();
      currentWallet = {
        walletBalance: Math.round(((existing.walletBalance || 0) + roundUp) * 100) / 100,
        totalRoundups: Math.round(((existing.totalRoundups || 0) + roundUp) * 100) / 100,
        totalTransactions: (existing.totalTransactions || 0) + 1,
        lastTransactionAt: now
      };
    } else {
      currentWallet = {
        walletBalance: roundUp,
        totalRoundups: roundUp,
        totalTransactions: 1,
        lastTransactionAt: now
      };
    }

    await walletRef.set(currentWallet, { merge: true });
    logger.logEvent('Wallet Updated', { userId, walletBalance: currentWallet.walletBalance, roundUp });

    // Update Analytics
    const analyticsRef = db.collection('analytics').doc(userId);
    const analyticsSnap = await analyticsRef.get();

    let currentAnalytics = {
      totalSpent: 0,
      totalSaved: 0,
      transactionCount: 0,
      averageRoundUp: 0,
      lastTransactionDate: ''
    };

    if (analyticsSnap.exists) {
      const existing = analyticsSnap.data();
      const newTotalSpent = Math.round(((existing.totalSpent || 0) + numAmount) * 100) / 100;
      const newTotalSaved = Math.round(((existing.totalSaved || 0) + roundUp) * 100) / 100;
      const newCount = (existing.transactionCount || 0) + 1;
      const avgRoundUp = Math.round((newTotalSaved / newCount) * 100) / 100;

      currentAnalytics = {
        totalSpent: newTotalSpent,
        totalSaved: newTotalSaved,
        transactionCount: newCount,
        averageRoundUp: avgRoundUp,
        lastTransactionDate: now
      };
    } else {
      currentAnalytics = {
        totalSpent: numAmount,
        totalSaved: roundUp,
        transactionCount: 1,
        averageRoundUp: roundUp,
        lastTransactionDate: now
      };
    }

    await analyticsRef.set(currentAnalytics, { merge: true });
    logger.logEvent('Analytics Updated', { userId, totalSpent: currentAnalytics.totalSpent, totalSaved: currentAnalytics.totalSaved });

    return {
      transaction: transactionData,
      wallet: currentWallet
    };
  }

  /**
   * Get paginated transactions for a user (newest first).
   */
  async getTransactions({ userId, page = 1, limit = 10 }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);

    const snapshot = await db.collection('transactions')
      .where('userId', '==', userId)
      .get();

    let allTransactions = [];
    if (snapshot && snapshot.docs) {
      allTransactions = snapshot.docs.map(doc => doc.data());
    }

    // Sort newest first with ID tie-breaker
    allTransactions.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      if (timeB !== timeA) {
        return timeB - timeA;
      }
      return b.id.localeCompare(a.id);
    });

    const total = allTransactions.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = allTransactions.slice(startIndex, startIndex + limitNum);

    return {
      transactions: paginatedItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    };
  }

  /**
   * Get a single transaction by ID for a user.
   */
  async getTransactionById({ userId, transactionId }) {
    const docSnap = await db.collection('transactions').doc(transactionId).get();

    if (!docSnap.exists) {
      return null;
    }

    const transaction = docSnap.data();
    if (transaction.userId !== userId) {
      return null;
    }

    return transaction;
  }
}

export const paymentService = new PaymentService();
export default paymentService;
