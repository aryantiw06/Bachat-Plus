// ============================================
// test-payments.js — Wallet & Payment Engine Verification
// ============================================
import app from '../app.js';
import logger from '../config/logger.js';
import { calculateRoundUp } from '../utils/roundUp.js';
import { clearMockFirestore } from '../utils/mockFirestore.js';

const PORT = 5098;
const AUTH_HEADER = { Authorization: 'Bearer mock-token' };

const runTests = async () => {
  // Unit tests for round-up calculation
  const roundUpTests = [
    { amount: 163, expected: 7 },
    { amount: 170, expected: 0 },
    { amount: 171, expected: 9 },
    { amount: 125.25, expected: 4.75 },
  ];

  for (const { amount, expected } of roundUpTests) {
    const result = calculateRoundUp(amount);
    if (result !== expected) {
      logger.error(`Round-up test failed: ${amount} → ${result}, expected ${expected}`);
      process.exit(1);
    }
    logger.info(`Round-up OK: ₹${amount} → ₹${result}`);
  }

  clearMockFirestore();

  const server = app.listen(PORT, async () => {
    logger.info(`[TEST] Payment verification server on port ${PORT}`);

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
      // Bootstrap user (creates wallet)
      logger.info('Establishing session...');
      const session = await request('/api/v1/auth/session', { method: 'POST' });
      if (session.status !== 200) throw new Error('Session failed');
      await request('/api/v1/wallet/reset', { method: 'POST' });

      // Test invalid amount → 400
      logger.info('Testing invalid amount...');
      const badAmount = await request('/api/v1/payments', {
        method: 'POST',
        body: JSON.stringify({ amount: -10, merchant: 'Test' }),
      });
      if (badAmount.status !== 400) throw new Error(`Expected 400, got ${badAmount.status}`);
      logger.info('Invalid amount returns 400 ✓');

      // Test missing merchant → 400
      const noMerchant = await request('/api/v1/payments', {
        method: 'POST',
        body: JSON.stringify({ amount: 100 }),
      });
      if (noMerchant.status !== 400) throw new Error(`Expected 400, got ${noMerchant.status}`);
      logger.info('Missing merchant returns 400 ✓');

      // Payment ₹163 → roundUp ₹7
      logger.info('Testing payment ₹163...');
      const pay1 = await request('/api/v1/payments', {
        method: 'POST',
        body: JSON.stringify({ amount: 163, merchant: 'Amazon', category: 'Shopping' }),
      });
      if (pay1.status !== 201) throw new Error(`Payment failed: ${JSON.stringify(pay1.data)}`);
      if (pay1.data.transaction.roundUp !== 7) throw new Error(`Expected roundUp 7, got ${pay1.data.transaction.roundUp}`);
      if (pay1.data.wallet.walletBalance !== 7) throw new Error(`Expected balance 7, got ${pay1.data.wallet.walletBalance}`);
      logger.info('Payment ₹163 adds ₹7 ✓');

      // Payment ₹170 → roundUp ₹0
      logger.info('Testing payment ₹170...');
      const pay2 = await request('/api/v1/payments', {
        method: 'POST',
        body: JSON.stringify({ amount: 170, merchant: 'Flipkart' }),
      });
      if (pay2.data.transaction.roundUp !== 0) throw new Error(`Expected roundUp 0, got ${pay2.data.transaction.roundUp}`);
      if (pay2.data.wallet.walletBalance !== 7) throw new Error(`Expected balance 7, got ${pay2.data.wallet.walletBalance}`);
      logger.info('Payment ₹170 adds ₹0 ✓');

      // Multiple payments accumulate
      logger.info('Testing payment ₹171...');
      const pay3 = await request('/api/v1/payments', {
        method: 'POST',
        body: JSON.stringify({ amount: 171, merchant: 'Swiggy', category: 'Food' }),
      });
      if (pay3.data.wallet.walletBalance !== 16) throw new Error(`Expected balance 16, got ${pay3.data.wallet.walletBalance}`);
      if (pay3.data.wallet.totalTransactions !== 3) throw new Error('Expected 3 transactions');
      logger.info('Multiple payments accumulate ✓');

      // GET wallet
      const wallet = await request('/api/v1/wallet');
      if (wallet.data.walletBalance !== 16 || wallet.data.totalRoundups !== 16) {
        throw new Error('Wallet totals incorrect');
      }
      logger.info('Wallet totals correct ✓');

      // GET payment history
      const history = await request('/api/v1/payments?page=1&limit=10');
      if (history.data.transactions.length !== 3) {
        throw new Error(`Expected 3 transactions, got ${history.data.transactions.length}`);
      }
      if (!history.data.pagination) throw new Error('Missing pagination');
      logger.info('Payment history correct ✓');

      // GET single transaction
      const txId = pay1.data.transaction.id;
      const single = await request(`/api/v1/payments/${txId}`);
      if (single.data.transaction.amount !== 163) throw new Error('Single transaction fetch failed');
      logger.info('Single transaction fetch ✓');

      // Unknown transaction → 404
      const notFound = await request('/api/v1/payments/unknown-id-12345');
      if (notFound.status !== 404) throw new Error(`Expected 404, got ${notFound.status}`);
      logger.info('Unknown transaction returns 404 ✓');

      // Auth protection
      const noAuth = await fetch(`http://localhost:${PORT}/api/v1/payments`, {
        method: 'GET',
      });
      if (noAuth.status !== 401) throw new Error('Auth middleware not protecting routes');
      logger.info('Auth middleware protects routes ✓');

      // Wallet reset (dev)
      const reset = await request('/api/v1/wallet/reset', { method: 'POST' });
      if (reset.data.wallet.walletBalance !== 0) throw new Error('Wallet reset failed');
      logger.info('Wallet reset works ✓');

      logger.info('[TEST] All payment engine checks passed.');
    } catch (err) {
      logger.error('[TEST] Payment verification failed:', err);
      process.exitCode = 1;
    } finally {
      server.close(() => process.exit(process.exitCode || 0));
    }
  });
};

runTests();
