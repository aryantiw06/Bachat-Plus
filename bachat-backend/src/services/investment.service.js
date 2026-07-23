import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase.js';
import { BadRequestError, FirestoreUnavailableError } from '../utils/errors.js';

const COLLECTION = 'investments';
const MINIMUMS = {
  gold: 100,
  nifty50: 500,
  indexfund: 500,
  crypto: 500,
  fd: 1000,
  stocks: 1000,
};

export async function createInvestment(uid, { amount, investmentType, riskLevel }) {
  const minimum = MINIMUMS[investmentType];
  if (!minimum) throw new BadRequestError('Unsupported investment type');
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < minimum) {
    throw new BadRequestError(`Minimum investment for ${investmentType} is ₹${minimum}`);
  }

  const now = new Date().toISOString();
  const investment = {
    id: uuidv4(),
    userId: uid,
    amount,
    investmentType,
    riskLevel: riskLevel || null,
    status: 'completed',
    createdAt: now,
    updatedAt: now,
  };

  try {
    const wallet = await db.runTransaction(async (firestoreTransaction) => {
      const walletRef = db.collection('wallets').doc(uid);
      const walletSnapshot = await firestoreTransaction.get(walletRef);
      const currentWallet = walletSnapshot.exists ? walletSnapshot.data() : null;
      const currentBalance = currentWallet?.walletBalance ?? currentWallet?.investmentWallet ?? 0;

      if (currentBalance < amount) {
        throw new BadRequestError('Insufficient investment wallet balance');
      }

      const walletBalance = currentBalance - amount;
      const totalRoundups = currentWallet?.totalRoundups ?? currentWallet?.lifetimeSavings ?? 0;
      const totalTransactions = currentWallet?.totalTransactions ?? 0;

      firestoreTransaction.set(db.collection(COLLECTION).doc(investment.id), investment);
      firestoreTransaction.set(walletRef, {
        walletBalance,
        investmentWallet: walletBalance,
        totalRoundups,
        lifetimeSavings: totalRoundups,
        totalTransactions,
        updatedAt: now,
      }, { merge: true });

      return { walletBalance, totalRoundups, totalTransactions, lastTransactionAt: currentWallet?.lastTransactionAt || null };
    });

    return { success: true, investment, wallet };
  } catch (error) {
    if (error instanceof BadRequestError) throw error;
    throw new FirestoreUnavailableError('Unable to create investment at this time');
  }
}

export async function getInvestmentHistory(uid) {
  try {
    const snapshot = await db.collection(COLLECTION)
      .where('userId', '==', uid)
      .get();
    return snapshot.docs
      .map((document) => document.data())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 20);
  } catch (error) {
    throw new FirestoreUnavailableError('Unable to load investments at this time');
  }
}
