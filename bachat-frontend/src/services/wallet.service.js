import api from './api';

export const walletService = {
  /**
   * Fetch user wallet summary from backend
   * GET /api/v1/wallet
   */
  getWallet: async () => {
    return await api.get('/wallet');
  },

  /**
   * Reset user wallet (Dev-only endpoint)
   * POST /api/v1/wallet/reset
   */
  resetWallet: async () => {
    return await api.post('/wallet/reset');
  }
};

export default walletService;
