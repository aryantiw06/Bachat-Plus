import api from './api';
import paymentService from './payment.service';
import walletService from './wallet.service';

export const analyticsService = {
  /**
   * Consumes backend data to provide unified analytics metrics
   */
  getAnalytics: async () => {
    try {
      const [walletRes, paymentsRes] = await Promise.all([
        walletService.getWallet(),
        paymentService.getPayments({ page: 1, limit: 100 })
      ]);

      const wallet = walletRes || {};
      const transactions = paymentsRes.transactions || [];

      const totalSpent = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
      const totalSaved = wallet.walletBalance || wallet.totalRoundups || 0;
      const transactionCount = wallet.totalTransactions || transactions.length;
      const averageRoundUp = transactionCount > 0 ? Math.round((totalSaved / transactionCount) * 100) / 100 : 0;

      return {
        success: true,
        totalSpent,
        totalSaved,
        transactionCount,
        averageRoundUp,
        transactions
      };
    } catch (error) {
      return {
        success: false,
        totalSpent: 0,
        totalSaved: 0,
        transactionCount: 0,
        averageRoundUp: 0,
        transactions: []
      };
    }
  }
};

export default analyticsService;
