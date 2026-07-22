// ============================================
// test-api.js — Backend Verification Script
// ============================================
// Programmatically spins up the Express app on a test port,
// sends HTTP fetch requests to core endpoints, prints
// responses, and shuts down.

import app from '../app.js';
import logger from '../config/logger.js';

const PORT = 5099;

const runTests = async () => {
  const server = app.listen(PORT, async () => {
    logger.info(`[TEST] Verification server listening on port ${PORT}`);

    try {
      const request = async (path, options = {}) => {
        const res = await fetch(`http://localhost:${PORT}${path}`, options);
        const data = await res.json();
        return { status: res.status, data };
      };

      // Test 1: Root service details
      logger.info('Testing GET / ...');
      const rootRes = await request('/');
      logger.info(`Response status: ${rootRes.status}`, rootRes.data);

      // Test 2: Health check
      logger.info('Testing GET /health ...');
      const healthRes = await request('/health');
      logger.info(`Response status: ${healthRes.status}`, healthRes.data);

      // Test 3: Auth session without token (expect 401)
      logger.info('Testing POST /api/v1/auth/session (no token) ...');
      const sessionNoToken = await request('/api/v1/auth/session', { method: 'POST' });
      logger.info(`Response status: ${sessionNoToken.status}`, sessionNoToken.data);

      // Test 4: Auth session with invalid token (expect 401)
      logger.info('Testing POST /api/v1/auth/session (invalid token) ...');
      const sessionBadToken = await request('/api/v1/auth/session', {
        method: 'POST',
        headers: { Authorization: 'Bearer invalid-token' },
      });
      logger.info(`Response status: ${sessionBadToken.status}`, sessionBadToken.data);

      // Test 5: Auth me without token (expect 401)
      logger.info('Testing GET /api/v1/auth/me (no token) ...');
      const meNoToken = await request('/api/v1/auth/me');
      logger.info(`Response status: ${meNoToken.status}`, meNoToken.data);

      // Test 6: Auth logout without token (expect 401)
      logger.info('Testing POST /api/v1/auth/logout (no token) ...');
      const logoutNoToken = await request('/api/v1/auth/logout', { method: 'POST' });
      logger.info(`Response status: ${logoutNoToken.status}`, logoutNoToken.data);

      // Test 7: Placeholder Route (Profile)
      logger.info('Testing GET /api/v1/profile ...');
      const profileRes = await request('/api/v1/profile');
      logger.info(`Response status: ${profileRes.status}`, profileRes.data);

      // Test 8: 404 handler
      logger.info('Testing GET /api/v1/invalid-route ...');
      const notFoundRes = await request('/api/v1/invalid-route');
      logger.info(`Response status: ${notFoundRes.status}`, notFoundRes.data);

      logger.info('[TEST] All verification checks completed.');
    } catch (err) {
      logger.error('[TEST] Verification failed with error:', err);
    } finally {
      server.close(() => {
        logger.info('[TEST] Verification server closed.');
        process.exit(0);
      });
    }
  });
};

runTests();
