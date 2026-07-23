import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import walletService from '../services/wallet.service';
import paymentService from '../services/payment.service';
import investmentService from '../services/investment.service';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { user } = useAuth();

  // ---- Backend-synced State ----
  const [investmentWallet, setInvestmentWallet] = useState(0);
  const [totalRoundups, setTotalRoundups] = useState(0);
  const [manualDeposits, setManualDeposits] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [lastTransactionAt, setLastTransactionAt] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [portfolio, setPortfolio] = useState({
    totalInvested: 0,
    currentValue: 0,
    profit: 0,
    overallGainPercentage: 0,
    todayGain: 0,
    bestAsset: 'None',
    allocation: [{ label: 'Cash', pct: 100, amount: 0, color: '#94a3b8' }],
  });
  
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
      const [walletData, paymentsData, investmentsBundle] = await Promise.all([
        walletService.getWallet().catch((err) => {
          console.warn('Wallet fetch warning:', err?.message || err);
          return null;
        }),
        paymentService.getPayments({ page: 1, limit: 20 }).catch((err) => {
          console.warn('Payments fetch warning:', err?.message || err);
          return null;
        }),
        investmentService.getInvestments().catch((err) => {
          console.warn('Investments fetch warning:', err?.message || err);
          return null;
        }),
      ]);

      if (walletData) {
        setInvestmentWallet(walletData.walletBalance ?? walletData.investmentWallet ?? 0);
        setTotalRoundups(walletData.totalRoundups ?? walletData.lifetimeSavings ?? 0);
        setManualDeposits(walletData.manualDeposits ?? 0);
        setTotalTransactions(walletData.totalTransactions ?? 0);
        setLastTransactionAt(walletData.lastTransactionAt || '');
      }

      if (paymentsData && paymentsData.transactions) {
        const formattedTxns = paymentsData.transactions.map((tx) => ({
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
          timestamp: tx.createdAt || new Date().toISOString(),
        }));
        setTransactions(formattedTxns);
      }

      if (investmentsBundle) {
        if (investmentsBundle.investments) {
          setInvestments(investmentsBundle.investments);
        }
        if (investmentsBundle.portfolio) {
          setPortfolio(investmentsBundle.portfolio);
        }
        if (investmentsBundle.wallet) {
          setInvestmentWallet(investmentsBundle.wallet.investmentWallet ?? investmentsBundle.wallet.availableBalance ?? 0);
          setTotalRoundups(investmentsBundle.wallet.totalRoundups ?? 0);
          setManualDeposits(investmentsBundle.wallet.manualDeposits ?? 0);
        }
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
      setLoadingWallet(true);
      refreshWallet();
    } else {
      setInvestmentWallet(0);
      setTotalRoundups(0);
      setManualDeposits(0);
      setTotalTransactions(0);
      setTransactions([]);
      setInvestments([]);
      setPortfolio({
        totalInvested: 0,
        currentValue: 0,
        profit: 0,
        overallGainPercentage: 0,
        todayGain: 0,
        bestAsset: 'None',
        allocation: [{ label: 'Cash', pct: 100, amount: 0, color: '#94a3b8' }],
      });
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
          const wallet = res.wallet || {};
          setInvestmentWallet(wallet.walletBalance ?? 0);
          setTotalRoundups(wallet.totalRoundups ?? 0);
          setTotalTransactions(wallet.totalTransactions ?? 0);
          setLastTransactionAt(wallet.lastTransactionAt ?? '');
          setTransactions((current) => [
            {
              id: res.transaction.id,
              merchantName: res.transaction.merchant,
              merchant: res.transaction.merchant,
              category: res.transaction.category || 'General',
              purchaseAmount: res.transaction.amount,
              amount: res.transaction.amount,
              roundup: res.transaction.roundUp,
              roundUp: res.transaction.roundUp,
              roundedUp: res.transaction.amount + res.transaction.roundUp,
              merchantReceives: res.transaction.amount,
              timestamp: res.transaction.createdAt,
            },
            ...current.filter((transaction) => transaction.id !== res.transaction.id),
          ].slice(0, 20));

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

  // ---- Add Money (Simulated Wallet Deposit) ----
  const addMoney = useCallback(async (amount) => {
    setSyncStatus('Saving');
    try {
      const res = await investmentService.addMoney({ amount });
      if (res && res.success) {
        if (res.wallet) {
          setInvestmentWallet(res.wallet.investmentWallet ?? res.wallet.walletBalance ?? 0);
          setManualDeposits(res.wallet.manualDeposits ?? 0);
        }
        await refreshWallet();
        setSyncStatus('Synced');
        return { success: true, ...res };
      }
      return { success: false, error: res?.message || 'Failed to add money' };
    } catch (err) {
      console.error('Add money failed:', err);
      setSyncStatus('Failed');
      return { success: false, error: err.message || 'Add money failed' };
    }
  }, [refreshWallet]);

  // ---- Execute Investment ----
  const invest = useCallback(async ({ productId, investmentType, amount, riskLevel }) => {
    setSyncStatus('Saving');
    try {
      const targetId = productId || investmentType;
      const res = await investmentService.createInvestment({ productId: targetId, amount, riskLevel });
      if (!res?.success) return { success: false, error: res?.message || 'Investment could not be completed.' };

      if (res.wallet) {
        setInvestmentWallet(res.wallet.investmentWallet ?? res.wallet.walletBalance ?? 0);
      }
      if (res.portfolio) {
        setPortfolio(res.portfolio);
      }
      if (res.investment) {
        setInvestments((current) => [res.investment, ...current.filter((item) => item.id !== res.investment.id)]);
      }

      await refreshWallet();
      setSyncStatus('Synced');
      return res;
    } catch (err) {
      setSyncStatus('Failed');
      return { success: false, error: err.message || 'Investment could not be completed.' };
    }
  }, [refreshWallet]);

  const value = {
    // Backend Stored State
    investmentWallet,
    totalRoundups,
    manualDeposits,
    totalTransactions,
    lastTransactionAt,
    transactions,
    investments,
    portfolio,
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
    addMoney,
    invest,
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
