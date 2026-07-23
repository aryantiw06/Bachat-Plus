import app from '../server.js';
import paymentService from '../src/services/paymentService.js';
import walletService from '../src/services/walletService.js';
import http from 'http';

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 RUNNING PHASE 9C VERIFICATION TESTS');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Start HTTP Server for API endpoint testing
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  try {
    const testUserId = 'test_user_phase9c';
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // Reset user state first
    await walletService.resetWallet({ userId: testUserId });

    // Test 1: ₹163 -> ₹7 round-up
    console.log('\n--- Test 1: Payment ₹163 ---');
    const res1 = await paymentService.processPayment({
      userId: testUserId,
      amount: 163,
      merchant: 'Amazon',
      category: 'Shopping'
    });

    assert(res1.transaction.roundUp === 7, '₹163 produces ₹7 round-up');
    assert(res1.wallet.walletBalance === 7, 'Wallet balance is ₹7');
    assert(res1.wallet.totalTransactions === 1, 'Total transactions count is 1');

    await sleep(10);

    // Test 2: ₹170 -> ₹0 round-up
    console.log('\n--- Test 2: Payment ₹170 ---');
    const res2 = await paymentService.processPayment({
      userId: testUserId,
      amount: 170,
      merchant: 'Flipkart',
      category: 'Electronics'
    });

    assert(res2.transaction.roundUp === 0, '₹170 produces ₹0 round-up');
    assert(res2.wallet.walletBalance === 7, 'Wallet balance remains ₹7 (7 + 0)');
    assert(res2.wallet.totalTransactions === 2, 'Total transactions count is 2');

    await sleep(10);

    // Test 3: ₹171 -> ₹9 round-up
    console.log('\n--- Test 3: Payment ₹171 ---');
    const res3 = await paymentService.processPayment({
      userId: testUserId,
      amount: 171,
      merchant: 'Swiggy',
      category: 'Food'
    });

    assert(res3.transaction.roundUp === 9, '₹171 produces ₹9 round-up');
    assert(res3.wallet.walletBalance === 16, 'Wallet balance accumulates to ₹16 (7 + 0 + 9)');

    await sleep(10);

    // Test 4: ₹125.25 -> ₹4.75 round-up
    console.log('\n--- Test 4: Payment ₹125.25 ---');
    const res4 = await paymentService.processPayment({
      userId: testUserId,
      amount: 125.25,
      merchant: 'Uber',
      category: 'Travel'
    });

    assert(res4.transaction.roundUp === 4.75, '₹125.25 produces ₹4.75 round-up');
    assert(res4.wallet.walletBalance === 20.75, 'Wallet balance accumulates to ₹20.75 (16 + 4.75)');

    // Test 5: Check Wallet retrieval
    console.log('\n--- Test 5: Wallet Retrieval ---');
    const wallet = await walletService.getWallet({ userId: testUserId });
    assert(wallet.walletBalance === 20.75, 'Retrieved wallet balance is 20.75');
    assert(wallet.totalRoundups === 20.75, 'Retrieved total roundups is 20.75');
    assert(wallet.totalTransactions === 4, 'Retrieved total transactions is 4');

    // Test 6: Check Paginated Transactions History
    console.log('\n--- Test 6: Transaction History Pagination ---');
    const history = await paymentService.getTransactions({ userId: testUserId, page: 1, limit: 2 });
    assert(history.transactions.length === 2, 'Returns 2 items for limit=2');
    assert(history.pagination.total === 4, 'Total items count is 4');
    assert(history.pagination.totalPages === 2, 'Total pages is 2');
    assert(history.transactions[0].amount === 125.25, 'Newest transaction comes first (₹125.25)');

    // Test 7: Check Get Transaction by ID
    console.log('\n--- Test 7: Get Transaction by ID ---');
    const targetTxId = res1.transaction.id;
    const foundTx = await paymentService.getTransactionById({ userId: testUserId, transactionId: targetTxId });
    assert(foundTx && foundTx.id === targetTxId, 'Transaction retrieved successfully by ID');

    // Test 8: Unknown Transaction returns null / 404
    console.log('\n--- Test 8: Unknown Transaction ---');
    const unknownTx = await paymentService.getTransactionById({ userId: testUserId, transactionId: 'non_existent_id' });
    assert(unknownTx === null, 'Unknown transaction ID returns null');

    // HTTP ENDPOINT TESTS
    console.log('\n--- HTTP API Endpoint Tests ---');

    // Test 9: POST /api/v1/payments (Valid)
    const httpPaymentRes = await fetch(`${baseUrl}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-user-http-test'
      },
      body: JSON.stringify({ amount: 163, merchant: 'Zomato', category: 'Food' })
    });
    const httpPaymentData = await httpPaymentRes.json();
    assert(httpPaymentRes.status === 201, 'POST /api/v1/payments returns 201 Created');
    assert(httpPaymentData.transaction.roundUp === 7, 'HTTP Payment ₹163 returns roundUp ₹7');

    // Test 10: POST /api/v1/payments (Invalid Amount <= 0)
    const httpInvalidAmtRes = await fetch(`${baseUrl}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-user-http-test'
      },
      body: JSON.stringify({ amount: -50, merchant: 'Amazon' })
    });
    assert(httpInvalidAmtRes.status === 400, 'POST /api/v1/payments with amount <= 0 returns 400 Bad Request');

    // Test 11: POST /api/v1/payments (Empty Merchant)
    const httpInvalidMerchRes = await fetch(`${baseUrl}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-user-http-test'
      },
      body: JSON.stringify({ amount: 100, merchant: '  ' })
    });
    assert(httpInvalidMerchRes.status === 400, 'POST /api/v1/payments with empty merchant returns 400 Bad Request');

    // Test 12: GET /api/v1/payments (Paginated History)
    const httpGetPaymentsRes = await fetch(`${baseUrl}/api/v1/payments?page=1&limit=5`, {
      headers: { 'Authorization': 'Bearer dev-user-http-test' }
    });
    const httpGetPaymentsData = await httpGetPaymentsRes.json();
    assert(httpGetPaymentsRes.status === 200, 'GET /api/v1/payments returns 200 OK');
    assert(httpGetPaymentsData.success === true, 'GET /api/v1/payments success is true');

    // Test 13: GET /api/v1/payments/:id (404 for unknown)
    const httpGetUnknownTxRes = await fetch(`${baseUrl}/api/v1/payments/invalid_id_999`, {
      headers: { 'Authorization': 'Bearer dev-user-http-test' }
    });
    assert(httpGetUnknownTxRes.status === 404, 'GET /api/v1/payments/:id for unknown ID returns 404 Not Found');

    // Test 14: GET /api/v1/wallet
    const httpGetWalletRes = await fetch(`${baseUrl}/api/v1/wallet`, {
      headers: { 'Authorization': 'Bearer dev-user-http-test' }
    });
    const httpGetWalletData = await httpGetWalletRes.json();
    assert(httpGetWalletRes.status === 200, 'GET /api/v1/wallet returns 200 OK');
    assert(typeof httpGetWalletData.walletBalance === 'number', 'GET /api/v1/wallet returns walletBalance');

    // Test 15: POST /api/v1/wallet/reset
    const httpResetRes = await fetch(`${baseUrl}/api/v1/wallet/reset`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer dev-user-http-test' }
    });
    const httpResetData = await httpResetRes.json();
    assert(httpResetRes.status === 200, 'POST /api/v1/wallet/reset returns 200 OK');
    assert(httpResetData.wallet.walletBalance === 0, 'POST /api/v1/wallet/reset resets balance to 0');

    // Summary
    console.log('\n========================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================\n');

    server.close();

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error during test run:', error);
    server.close();
    process.exit(1);
  }
}

runTests();
