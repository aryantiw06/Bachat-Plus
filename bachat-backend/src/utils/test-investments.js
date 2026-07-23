// ============================================
// test-investments.js — Investment Engine & Portfolio Verification
// ============================================
import app from '../app.js';
import logger from '../config/logger.js';
import { clearMockFirestore } from './mockFirestore.js';

const PORT = 5097;
const AUTH_HEADER = { Authorization: 'Bearer mock-token' };

const runTests = async () => {
  clearMockFirestore();

  const server = app.listen(PORT, async () => {
    logger.info(`[TEST] Investment verification server running on port ${PORT}`);

    const request = async (path, options = {}) => {
      const res = await fetch(`http://localhost:${PORT}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...AUTH_HEADER,
          ...options.headers,
        },
      });
      const data = await res.json();
      return { status: res.status, data };
    };

    try {
      // 1. Establish Session
      logger.info('1. Establishing user session...');
      const session = await request('/api/v1/auth/session', { method: 'POST' });
      if (session.status !== 200) throw new Error('Session establishment failed');
      logger.info('Session established ✓');

      // 2. Fetch Initial Investment Bundle
      logger.info('2. Fetching initial investment bundle...');
      const bundle = await request('/api/v1/investments');
      if (bundle.status !== 200 || !bundle.data.success) throw new Error('Failed to fetch investment bundle');
      if (bundle.data.wallet.investmentWallet !== 0) throw new Error('Initial wallet balance should be 0');
      logger.info('Initial bundle fetched ✓');

      // 3. Test Add Money (Top-Up)
      logger.info('3. Testing Add Money (top-up ₹5,000)...');
      const addMoneyRes = await request('/api/v1/investments/add-money', {
        method: 'POST',
        body: JSON.stringify({ amount: 5000 }),
      });
      if (addMoneyRes.status !== 200 || !addMoneyRes.data.success) throw new Error('Add money failed');
      if (addMoneyRes.data.wallet.investmentWallet !== 5000) throw new Error('Expected investment wallet balance 5000');
      logger.info('Add money ₹5,000 successful ✓');

      // 4. Test Investment Execution Validation (below minimum)
      logger.info('4. Testing investment validation below minimum...');
      const lowInvest = await request('/api/v1/investments', {
        method: 'POST',
        body: JSON.stringify({ productId: 'gold', amount: 50 }),
      });
      if (lowInvest.status !== 400) throw new Error('Expected 400 for investment below minimum');
      logger.info('Validation below minimum returns 400 ✓');

      // 5. Test Successful Gold ETF Investment (₹1,000)
      logger.info('5. Executing Gold ETF investment (₹1,000)...');
      const goldInvest = await request('/api/v1/investments', {
        method: 'POST',
        body: JSON.stringify({ productId: 'gold', amount: 1000 }),
      });
      if (goldInvest.status !== 201 || !goldInvest.data.success) throw new Error('Gold ETF investment failed');
      if (goldInvest.data.wallet.investmentWallet !== 4000) throw new Error('Expected wallet balance 4000');
      logger.info('Gold ETF investment created, wallet balance updated to ₹4,000 ✓');

      // 6. Executing Nifty 50 ETF Investment (₹2,000)
      logger.info('6. Executing Nifty 50 ETF investment (₹2,000)...');
      const niftyInvest = await request('/api/v1/investments', {
        method: 'POST',
        body: JSON.stringify({ productId: 'nifty50', amount: 2000 }),
      });
      if (niftyInvest.status !== 201 || !niftyInvest.data.success) throw new Error('Nifty 50 investment failed');
      if (niftyInvest.data.wallet.investmentWallet !== 2000) throw new Error('Expected wallet balance 2000');
      logger.info('Nifty 50 ETF investment created, wallet balance updated to ₹2,000 ✓');

      // 7. Insufficient Balance Test
      logger.info('7. Testing insufficient balance error...');
      const excessiveInvest = await request('/api/v1/investments', {
        method: 'POST',
        body: JSON.stringify({ productId: 'fd', amount: 10000 }),
      });
      if (excessiveInvest.status !== 400) throw new Error('Expected 400 for insufficient balance');
      logger.info('Insufficient balance returns 400 ✓');

      // 8. Fetch Portfolio Summary
      logger.info('8. Fetching updated portfolio...');
      const portfolioRes = await request('/api/v1/investments/portfolio');
      if (portfolioRes.status !== 200 || !portfolioRes.data.portfolio) throw new Error('Failed to fetch portfolio');
      if (portfolioRes.data.portfolio.totalInvested !== 3000) throw new Error('Expected total invested 3000');
      if (portfolioRes.data.portfolio.holdingsCount !== 2) throw new Error('Expected 2 holdings');
      logger.info('Portfolio analytics correctly computed (Total Invested: ₹3,000) ✓');

      // 9. Fetch Investment History
      logger.info('9. Fetching investment history...');
      const historyRes = await request('/api/v1/investments/history');
      if (historyRes.status !== 200 || historyRes.data.investments.length !== 2) throw new Error('History fetch failed');
      logger.info('Investment history returns 2 transactions ✓');

      logger.info('[TEST] All Investment Engine & Portfolio tests passed cleanly!');
    } catch (err) {
      logger.error('[TEST] Investment verification failed:', err);
      process.exitCode = 1;
    } finally {
      server.close(() => process.exit(process.exitCode || 0));
    }
  });
};

runTests();
