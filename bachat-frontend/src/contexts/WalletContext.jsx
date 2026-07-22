import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

const MAX_TRANSACTIONS = 20;

export function WalletProvider({ children }) {
  const { user } = useAuth();

  // ---- Persistent State (Saved to Firestore) ----
  const [investmentWallet, setInvestmentWallet] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(10000);
  const [goalName, setGoalName] = useState('Emergency Fund');
  const [transactions, setTransactions] = useState([]);

  // ---- UI / App State ----
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [syncStatus, setSyncStatus] = useState(''); // 'Saving', 'Synced', 'Failed'

  // ---- Load Data from Firestore when user logs in ----
  useEffect(() => {
    let isMounted = true;

    async function fetchWallet() {
      if (!user) {
        // Reset state on logout
        setInvestmentWallet(0);
        setSavingsGoal(10000);
        setGoalName('Emergency Fund');
        setTransactions([]);
        setLoadingWallet(false);
        setSyncStatus('');
        return;
      }

      setLoadingWallet(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (isMounted) {
            setInvestmentWallet(data.investmentWallet || 0);
            setSavingsGoal(data.savingsGoal || 10000);
            setGoalName(data.goalName || 'Emergency Fund');
            // Restore dates from string if needed, though they stay strings from our save logic
            setTransactions(data.transactions || []);
          }
        } else {
          // Initialize new user
          const initialData = {
            investmentWallet: 0,
            savingsGoal: 10000,
            goalName: 'Emergency Fund',
            transactions: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userRef, initialData, { merge: true });
          if (isMounted) {
            setInvestmentWallet(0);
            setSavingsGoal(10000);
            setGoalName('Emergency Fund');
            setTransactions([]);
          }
        }
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setSyncStatus('Failed');
      } finally {
        if (isMounted) setLoadingWallet(false);
      }
    }

    fetchWallet();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // ---- Derived Values ----
  const now = new Date();
  
  // Calculate today's roundup
  const todayRoundup = transactions.reduce((sum, tx) => {
    const txDate = new Date(tx.timestamp);
    if (
      txDate.getDate() === now.getDate() &&
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    ) {
      return sum + tx.roundup;
    }
    return sum;
  }, 0);

  // Calculate this month's roundup
  const monthlyTotal = transactions.reduce((sum, tx) => {
    const txDate = new Date(tx.timestamp);
    if (
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    ) {
      return sum + tx.roundup;
    }
    return sum;
  }, 0);

  const goalProgress = savingsGoal > 0 
    ? Math.min(Math.round((investmentWallet / savingsGoal) * 100), 100) 
    : 0;
    
  const totalTransactions = transactions.length;

  // ---- Analytics Derived Values ----
  const averageRoundup = totalTransactions > 0
    ? Math.round(transactions.reduce((sum, tx) => sum + tx.roundup, 0) / totalTransactions)
    : 0;

  const largestRoundup = totalTransactions > 0
    ? Math.max(...transactions.map((tx) => tx.roundup))
    : 0;

  // Category breakdown: { food: { spent: 500, roundup: 30, count: 3 }, ... }
  const categoryBreakdown = transactions.reduce((acc, tx) => {
    const cat = tx.category || 'other';
    if (!acc[cat]) acc[cat] = { spent: 0, roundup: 0, count: 0 };
    acc[cat].spent += tx.purchaseAmount;
    acc[cat].roundup += tx.roundup;
    acc[cat].count += 1;
    return acc;
  }, {});

  // ---- Unified Payment Processor ----
  const processRoundUpPayment = useCallback(
    async (transaction) => {
      if (!user) return; // Must be logged in

      setSyncStatus('Saving');

      // Optimistic UI updates
      const newWalletValue = investmentWallet + (transaction.roundup || 0);
      
      // We stringify the timestamp before saving to keep it simple in React state
      const serializedTx = {
        ...transaction,
        timestamp: transaction.timestamp.toISOString(),
      };

      const newTransactions = [serializedTx, ...transactions].slice(0, MAX_TRANSACTIONS);

      // Save previous state in case of rollback
      const prevWallet = investmentWallet;
      const prevTransactions = transactions;

      // Apply optimistic update
      setInvestmentWallet(newWalletValue);
      setTransactions(newTransactions);

      // Firestore Write
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(
          userRef,
          {
            investmentWallet: newWalletValue,
            transactions: newTransactions,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        setSyncStatus('Synced');
        
        // Optional: clear synced message after a bit
        setTimeout(() => setSyncStatus(''), 3000);
      } catch (err) {
        console.error('Failed to sync payment:', err);
        setSyncStatus('Failed');
        // Rollback on failure
        setInvestmentWallet(prevWallet);
        setTransactions(prevTransactions);
      }
    },
    [user, investmentWallet, transactions]
  );

  const value = {
    // Stored State
    investmentWallet,
    savingsGoal,
    goalName,
    transactions,
    // Derived State
    todayRoundup,
    monthlyTotal,
    goalProgress,
    totalTransactions,
    // Analytics
    averageRoundup,
    largestRoundup,
    categoryBreakdown,
    // Status State
    loadingWallet,
    syncStatus,
    // Actions
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
