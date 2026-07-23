import api from './api';

export const investmentService = {
  createInvestment: ({ amount, investmentType, riskLevel }) =>
    api.post('/investments', { amount, investmentType, riskLevel }),
  getInvestments: () => api.get('/investments'),
};

export default investmentService;
