import api from './api';

export const paymentService = {
  /**
   * Create a new payment with round-up calculation
   * POST /api/v1/payments
   */
  createPayment: async ({ amount, merchant, category }) => {
    return await api.post('/payments', { amount, merchant, category });
  },

  /**
   * Fetch paginated payment transactions history
   * GET /api/v1/payments?page=1&limit=20
   */
  getPayments: async ({ page = 1, limit = 20 } = {}) => {
    return await api.get('/payments', { params: { page, limit } });
  },

  /**
   * Get single transaction by ID
   * GET /api/v1/payments/:id
   */
  getPaymentById: async (id) => {
    return await api.get(`/payments/${id}`);
  }
};

export default paymentService;
