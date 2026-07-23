import db from '../config/firebase.js';
import logger from '../utils/logger.js';

export class WalletService {
  /**
   * Retrieve wallet details for a user.
   */
  async getWallet({ userId }) {
    const walletSnap = await db.collection('wallets').doc(userId).get();

    if (!walletSnap.exists) {
      return {
        walletBalance: 0,
        totalRoundups: 0,
        totalTransactions: 0,
        lastTransactionAt: ""
      };
    }

    const data = walletSnap.data();
    return {
      walletBalance: data.walletBalance || 0,
      totalRoundups: data.totalRoundups || 0,
      totalTransactions: data.totalTransactions || 0,
      lastTransactionAt: data.lastTransactionAt || ""
    };
  }

  /**
   * Reset user's wallet, analytics, and transaction history (Development Endpoint).
   */
  async resetWallet({ userId }) {
    const initialWallet = {
      walletBalance: 0,
      totalRoundups: 0,
      totalTransactions: 0,
      lastTransactionAt: ""
    };

    const initialAnalytics = {
      totalSpent: 0,
      totalSaved: 0,
      transactionCount: 0,
      averageRoundUp: 0,
      lastTransactionDate: ""
    };

    // Reset Wallet document
    await db.collection('wallets').doc(userId).set(initialWallet);

    // Reset Analytics document
    await db.collection('analytics').doc(userId).set(initialAnalytics);

    // Delete user's transactions
    const snapshot = await db.collection('transactions').where('userId', '==', userId).get();
    if (snapshot && snapshot.docs) {
      for (const doc of snapshot.docs) {
        await db.collection('transactions').doc(doc.id).delete();
      }
    }

    logger.info('Wallet and analytics reset completed', { userId });
    return initialWallet;
  }
}

export const walletService = new WalletService();
export default walletService;
