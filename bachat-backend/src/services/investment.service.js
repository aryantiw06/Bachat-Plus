// ============================================
// investment.service.js — Production Investment & Portfolio Engine
// ============================================
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';
import { BadRequestError, FirestoreUnavailableError, NotFoundError } from '../utils/errors.js';
import * as walletService from './wallet.service.js';

const INVESTMENTS_COLLECTION = 'investments';
const PORTFOLIO_COLLECTION = 'portfolio';
const WALLETS_COLLECTION = 'wallets';

// ============================================
// INVESTMENT PRODUCTS CATALOG
// ============================================
export const PRODUCTS = [
  {
    id: 'gold',
    name: 'Gold ETF',
    category: 'Commodities',
    risk: 'Low',
    riskColor: 'text-emerald-600',
    expectedReturn: '9.0%',
    returnRate: 0.09,
    minInvestment: 100,
    description: 'Digital gold ETF providing safety and inflation protection.',
    recommendedFor: 'First-time & conservative investors',
    icon: 'Gem',
    color: '#f59e0b',
  },
  {
    id: 'nifty50',
    name: 'Nifty 50 ETF',
    category: 'Equity ETF',
    risk: 'Moderate',
    riskColor: 'text-blue-600',
    expectedReturn: '13.5%',
    returnRate: 0.135,
    minInvestment: 500,
    description: 'Tracks top 50 bluechip companies listed on India\'s NSE.',
    recommendedFor: 'Long-term capital growth',
    icon: 'TrendingUp',
    color: '#3b82f6',
  },
  {
    id: 'indexfund',
    name: 'Index Mutual Fund',
    category: 'Mutual Funds',
    risk: 'Moderate',
    riskColor: 'text-indigo-600',
    expectedReturn: '12.0%',
    returnRate: 0.12,
    minInvestment: 250,
    description: 'Professionally managed low-cost index tracking fund.',
    recommendedFor: 'Passive wealth building',
    icon: 'BarChart3',
    color: '#8b5cf6',
  },
  {
    id: 'stocks',
    name: 'Bluechip Equity Stocks',
    category: 'Direct Equity',
    risk: 'High',
    riskColor: 'text-amber-600',
    expectedReturn: '16.5%',
    returnRate: 0.165,
    minInvestment: 500,
    description: 'Direct exposure to high-performing market leaders.',
    recommendedFor: 'Growth-oriented portfolios',
    icon: 'LineChart',
    color: '#0f172a',
  },
  {
    id: 'crypto',
    name: 'Crypto Basket ETF',
    category: 'Digital Assets',
    risk: 'Very High',
    riskColor: 'text-rose-600',
    expectedReturn: '24.0%',
    returnRate: 0.24,
    minInvestment: 200,
    description: 'Diversified basket of leading decentralized digital assets.',
    recommendedFor: 'High-risk reward seekers',
    icon: 'Bitcoin',
    color: '#f97316',
  },
  {
    id: 'fd',
    name: 'Fixed Deposit (FD)',
    category: 'Fixed Income',
    risk: 'Very Low',
    riskColor: 'text-teal-600',
    expectedReturn: '7.5%',
    returnRate: 0.075,
    minInvestment: 1000,
    description: 'Guaranteed fixed interest backed by scheduled banks.',
    recommendedFor: 'Capital preservation',
    icon: 'Landmark',
    color: '#0d9488',
  },
];

/**
 * Helper to calculate simulated price growth for an investment
 */
export function calculateSimulatedPerformance(amount, product, createdAt) {
  const returnRate = product?.returnRate || 0.10;
  // Calculate simulated return: base 2.5% initial yield + deterministic variance
  const daysOld = Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)));
  const growthFactor = 1 + (returnRate * (daysOld / 365)) + 0.025;
  
  const currentValue = Math.round(amount * growthFactor * 100) / 100;
  const profit = Math.round((currentValue - amount) * 100) / 100;
  const profitPct = Math.round((profit / amount) * 10000) / 100;

  return { currentValue, profit, profitPct };
}

/**
 * Generate personalized AI Recommendation based on user balance and holdings
 */
export function generateAIRecommendation(availableBalance, holdings = []) {
  if (availableBalance < 100) {
    return {
      recommendedProduct: PRODUCTS[0], // Gold ETF
      reason: 'Build your wallet to ₹100 using round-ups or Add Money to start investing safely.',
      expectedReturn: '9.0%',
      confidence: 95,
      riskLevel: 'Low',
      alternatives: [PRODUCTS[1], PRODUCTS[5]],
    };
  }

  if (availableBalance < 500) {
    return {
      recommendedProduct: PRODUCTS[0], // Gold ETF
      reason: 'Gold ETF has low volatility and is the perfect starting asset for your available ₹' + availableBalance + ' balance.',
      expectedReturn: '9.0%',
      confidence: 94,
      riskLevel: 'Low',
      alternatives: [PRODUCTS[2]],
    };
  }

  if (availableBalance < 1500) {
    return {
      recommendedProduct: PRODUCTS[1], // Nifty 50 ETF
      reason: 'Your ₹' + availableBalance + ' balance is ideal for Nifty 50 ETF, granting instant exposure to India\'s top 50 companies.',
      expectedReturn: '13.5%',
      confidence: 92,
      riskLevel: 'Moderate',
      alternatives: [PRODUCTS[0], PRODUCTS[2]],
    };
  }

  return {
    recommendedProduct: PRODUCTS[3], // Bluechip Equity Stocks
    reason: 'With ₹' + availableBalance + ' in your Investment Wallet, diversifying into Bluechip Equity maximizes long-term compounding.',
    expectedReturn: '16.5%',
    confidence: 89,
    riskLevel: 'Balanced High Growth',
    alternatives: [PRODUCTS[1], PRODUCTS[4], PRODUCTS[5]],
  };
}

/**
 * Process Add Money top-up (simulated deposit into Investment Wallet)
 */
export async function addMoney(uid, amount) {
  if (!amount || typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    throw new BadRequestError('Add money amount must be greater than 0');
  }

  const now = new Date().toISOString();
  let wallet = await walletService.getWallet(uid);
  if (!wallet) {
    wallet = await walletService.createWallet(uid);
  }

  const currentAvailable = wallet.walletBalance ?? wallet.investmentWallet ?? 0;
  const currentManual = wallet.manualDeposits ?? 0;

  const updatedAvailable = currentAvailable + amount;
  const updatedManual = currentManual + amount;

  const updates = {
    walletBalance: updatedAvailable,
    investmentWallet: updatedAvailable,
    manualDeposits: updatedManual,
    updatedAt: now,
  };

  await db.collection(WALLETS_COLLECTION).doc(uid).set(updates, { merge: true });

  logger.info('Simulated Add Money completed.', { uid, amount, updatedAvailable });

  return {
    success: true,
    amountAdded: amount,
    wallet: {
      investmentWallet: updatedAvailable,
      walletBalance: updatedAvailable,
      manualDeposits: updatedManual,
      totalRoundups: wallet.totalRoundups ?? wallet.lifetimeSavings ?? 0,
    },
  };
}

/**
 * Execute Investment Order (deducts from Investment Wallet, adds to Portfolio)
 */
export async function createInvestment(uid, { productId, investmentType, amount }) {
  const targetProductId = productId || investmentType;
  const product = PRODUCTS.find((p) => p.id === targetProductId);

  if (!product) {
    throw new BadRequestError(`Unsupported investment product: ${targetProductId}`);
  }

  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);

  if (!numericAmount || Number.isNaN(numericAmount) || numericAmount < product.minInvestment) {
    throw new BadRequestError(`Minimum investment for ${product.name} is ₹${product.minInvestment}`);
  }

  const now = new Date().toISOString();
  const investmentId = uuidv4();

  // Initial simulated values
  const { currentValue, profit } = calculateSimulatedPerformance(numericAmount, product, now);

  const investmentRecord = {
    id: investmentId,
    userId: uid,
    productId: product.id,
    productName: product.name,
    category: product.category,
    amount: numericAmount,
    purchasePrice: 100,
    currentPrice: 102.8,
    currentValue,
    profit,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  try {
    let wallet = await walletService.getWallet(uid);
    if (!wallet) {
      wallet = await walletService.createWallet(uid);
    }

    const currentBalance = wallet.walletBalance ?? wallet.investmentWallet ?? 0;
    if (currentBalance < numericAmount) {
      throw new BadRequestError(`Insufficient Investment Wallet balance. You have ₹${currentBalance}, but ₹${numericAmount} is required.`);
    }

    const newBalance = currentBalance - numericAmount;

    // Atomically save investment & update wallet balance
    if (typeof db.batch === 'function') {
      const batch = db.batch();

      batch.set(db.collection(INVESTMENTS_COLLECTION).doc(investmentId), investmentRecord);
      batch.set(
        db.collection(WALLETS_COLLECTION).doc(uid),
        {
          walletBalance: newBalance,
          investmentWallet: newBalance,
          updatedAt: now,
        },
        { merge: true }
      );

      await batch.commit();
    } else {
      await db.collection(INVESTMENTS_COLLECTION).doc(investmentId).set(investmentRecord);
      await db.collection(WALLETS_COLLECTION).doc(uid).set(
        {
          walletBalance: newBalance,
          investmentWallet: newBalance,
          updatedAt: now,
        },
        { merge: true }
      );
    }

    logger.info('Investment successfully executed.', { uid, productId: product.id, amount: numericAmount });

    const portfolio = await getPortfolio(uid);

    return {
      success: true,
      investment: investmentRecord,
      wallet: {
        investmentWallet: newBalance,
        walletBalance: newBalance,
        manualDeposits: wallet.manualDeposits ?? 0,
        totalRoundups: wallet.totalRoundups ?? wallet.lifetimeSavings ?? 0,
      },
      portfolio,
    };
  } catch (error) {
    if (error instanceof BadRequestError) throw error;
    logger.error('Investment execution failed:', error);
    throw new FirestoreUnavailableError('Unable to process investment at this time');
  }
}

/**
 * Get user's active holdings and portfolio summary
 */
export async function getPortfolio(uid) {
  try {
    const snapshot = await db
      .collection(INVESTMENTS_COLLECTION)
      .where('userId', '==', uid)
      .get();

    const rawInvestments = snapshot.docs.map((doc) => doc.data());

    let totalInvested = 0;
    let currentValue = 0;
    const categoryTotals = {};

    const holdings = rawInvestments.map((inv) => {
      const product = PRODUCTS.find((p) => p.id === inv.productId) || { returnRate: 0.10, name: inv.productName };
      const { currentValue: val, profit, profitPct } = calculateSimulatedPerformance(inv.amount, product, inv.createdAt);

      totalInvested += inv.amount;
      currentValue += val;

      const cat = inv.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + val;

      return {
        ...inv,
        currentValue: val,
        profit,
        profitPct,
      };
    });

    totalInvested = Math.round(totalInvested * 100) / 100;
    currentValue = Math.round(currentValue * 100) / 100;
    const profit = Math.round((currentValue - totalInvested) * 100) / 100;
    const overallGainPercentage = totalInvested > 0 ? Math.round((profit / totalInvested) * 10000) / 100 : 0;
    const todayGain = Math.round(currentValue * 0.008 * 100) / 100; // Simulated 0.8% daily gain

    // Calculate allocation percentages
    const allocation = Object.entries(categoryTotals).map(([label, amount]) => {
      const pct = currentValue > 0 ? Math.round((amount / currentValue) * 100) : 0;
      const product = PRODUCTS.find((p) => p.category === label) || { color: '#3b82f6' };
      return { label, pct, amount, color: product.color };
    });

    if (allocation.length === 0) {
      allocation.push({ label: 'Cash', pct: 100, amount: 0, color: '#94a3b8' });
    }

    // Determine best asset
    let bestAsset = 'None';
    if (holdings.length > 0) {
      const sorted = [...holdings].sort((a, b) => b.profitPct - a.profitPct);
      bestAsset = `${sorted[0].productName} (+${sorted[0].profitPct}%)`;
    }

    return {
      totalInvested,
      currentValue,
      profit,
      overallGainPercentage,
      todayGain,
      bestAsset,
      allocation,
      holdingsCount: holdings.length,
    };
  } catch (error) {
    logger.error('Failed to calculate portfolio:', error);
    return {
      totalInvested: 0,
      currentValue: 0,
      profit: 0,
      overallGainPercentage: 0,
      todayGain: 0,
      bestAsset: 'None',
      allocation: [{ label: 'Cash', pct: 100, amount: 0, color: '#94a3b8' }],
      holdingsCount: 0,
    };
  }
}

/**
 * Get user investment history (sorted newest first)
 */
export async function getInvestmentHistory(uid) {
  try {
    const snapshot = await db
      .collection(INVESTMENTS_COLLECTION)
      .where('userId', '==', uid)
      .get();

    const docs = snapshot.docs.map((doc) => doc.data());
    
    docs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    return docs.map((inv) => {
      const product = PRODUCTS.find((p) => p.id === inv.productId) || { returnRate: 0.10, name: inv.productName };
      const { currentValue, profit, profitPct } = calculateSimulatedPerformance(inv.amount, product, inv.createdAt);
      return {
        ...inv,
        currentValue,
        profit,
        profitPct,
      };
    });
  } catch (error) {
    logger.error('Failed to fetch investment history:', error);
    return [];
  }
}

/**
 * Full Investment Page Bundle (GET /api/v1/investments)
 */
export async function getInvestmentBundle(uid) {
  let wallet = await walletService.getWallet(uid);
  if (!wallet) {
    wallet = await walletService.createWallet(uid);
  }

  const availableBalance = wallet.walletBalance ?? wallet.investmentWallet ?? 0;
  const totalRoundups = wallet.totalRoundups ?? wallet.lifetimeSavings ?? 0;
  const manualDeposits = wallet.manualDeposits ?? 0;

  const [portfolio, investments] = await Promise.all([
    getPortfolio(uid),
    getInvestmentHistory(uid),
  ]);

  const recommendation = generateAIRecommendation(availableBalance, investments);

  return {
    success: true,
    wallet: {
      investmentWallet: availableBalance,
      availableBalance,
      totalRoundups,
      manualDeposits,
    },
    portfolio,
    products: PRODUCTS,
    recommendation,
    investments,
  };
}
