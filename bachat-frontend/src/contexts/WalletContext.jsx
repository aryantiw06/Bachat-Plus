import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import walletService from '../services/wallet.service';
import paymentService from '../services/payment.service';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { user } = useAuth();

  // ---- Backend-synced State ----
  const [investmentWallet, setInvestmentWallet] = useState(0);
  const [totalRoundups, setTotalRoundups] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [lastTransactionAt, setLastTransactionAt] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  // ---- Local UI Settings ----
  const [savingsGoal, setSavingsGoal] = useState(10000);
  const [goalName, setGoalName] = useState('Emergency Fund');

  // ---- Loading / Sync Status ----
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [syncStatus, setSyncStatus] = useState('');

  // ---- Refresh Data from Backend API ----
  const refreshWallet = useCallback(async () => {
    try {
      setSyncStatus('Saving');
      const [walletData, paymentsData] = await Promise.all([
        walletService.getWallet(),
        paymentService.getPayments({ page: 1, limit: 20 })
      ]);

      if (walletData) {
        setInvestmentWallet(walletData.walletBalance || 0);
        setTotalRoundups(walletData.totalRoundups || 0);
        setTotalTransactions(walletData.totalTransactions || 0);
        setLastTransactionAt(walletData.lastTransactionAt || '');
      }

      if (paymentsData && paymentsData.transactions) {
        // Map backend transaction schema to frontend friendly properties
        const formattedTxns = paymentsData.transactions.map(tx => ({
          id: tx.id,
          merchantName: tx.merchant,
          merchant: tx.merchant,
          category: tx.category || 'General',
          purchaseAmount: tx.amount,
          amount: tx.amount,
          roundup: tx.roundUp,
          roundUp: tx.roundUp,
          roundedUp: (tx.amount || 0) + (tx.roundUp || 0),
          merchantReceives: tx.amount,
          timestamp: tx.createdAt || new Date().toISOString()
        }));
        setTransactions(formattedTxns);
      }
      setSyncStatus('Synced');
      setTimeout(() => setSyncStatus(''), 2000);
    } catch (err) {
      console.error('Failed to load wallet data from backend:', err);
      setSyncStatus('Failed');
    } finally {
      setLoadingWallet(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshWallet();
    } else {
      setInvestmentWallet(0);
      setTotalRoundups(0);
      setTotalTransactions(0);
      setTransactions([]);
      setLoadingWallet(false);
    }
  }, [user, refreshWallet]);

  // ---- Derived Values from Backend Data ----
  const now = new Date();

  const todayRoundup = transactions.reduce((sum, tx) => {
    const txDate = new Date(tx.timestamp);
    if (
      txDate.getDate() === now.getDate() &&
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    ) {
      return sum + (tx.roundup || 0);
    }
    return sum;
  }, 0);

  const monthlyTotal = transactions.reduce((sum, tx) => {
    const txDate = new Date(tx.timestamp);
    if (
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    ) {
      return sum + (tx.roundup || 0);
    }
    return sum;
  }, 0);

  const goalProgress = savingsGoal > 0
    ? Math.min(Math.round((investmentWallet / savingsGoal) * 100), 100)
    : 0;

  const averageRoundup = totalTransactions > 0
    ? Math.round(transactions.reduce((sum, tx) => sum + (tx.roundup || 0), 0) / totalTransactions * 100) / 100
    : 0;

  const largestRoundup = transactions.length > 0
    ? Math.max(...transactions.map((tx) => tx.roundup || 0))
    : 0;

  const categoryBreakdown = transactions.reduce((acc, tx) => {
    const cat = tx.category || 'other';
    if (!acc[cat]) acc[cat] = { spent: 0, roundup: 0, count: 0 };
    acc[cat].spent += tx.purchaseAmount || 0;
    acc[cat].roundup += tx.roundup || 0;
    acc[cat].count += 1;
    return acc;
  }, {});

  // ---- Unified Backend Payment Processor ----
  const processRoundUpPayment = useCallback(
    async (transactionData) => {
      setSyncStatus('Saving');
      try {
        const payload = {
          amount: transactionData.purchaseAmount || transactionData.amount,
          merchant: transactionData.merchantName || transactionData.merchant,
          category: transactionData.category || 'General'
        };

        const res = await paymentService.createPayment(payload);

        if (res && res.success) {
          // Immediately pull fresh Single Source of Truth backend state
          await refreshWallet();
          setSyncStatus('Synced');
          return { success: true, ...res };
        }
      } catch (err) {
        console.error('Payment processing failed:', err);
        setSyncStatus('Failed');
        return { success: false, error: err.message };
      }
    },
    [refreshWallet]
  );

  const value = {
    // Backend Stored State
    investmentWallet,
    totalRoundups,
    totalTransactions,
    lastTransactionAt,
    transactions,
    savingsGoal,
    goalName,

    // Derived Metrics
    todayRoundup,
    monthlyTotal,
    goalProgress,
    averageRoundup,
    largestRoundup,
    categoryBreakdown,

    // UI Status & Actions
    loadingWallet,
    syncStatus,
    refreshWallet,
    processRoundUpPayment,
    setSavingsGoal,
    setGoalName,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
