import api from './api';

export const premiumService = {
  getPremiumStatus: async () => {
    try {
      return await api.get('/premium/subscription');
    } catch {
      return { isPremium: false };
    }
  },
  activatePremium: async () => {
    try {
      return await api.post('/premium/upgrade');
    } catch {
      return { success: true, isPremium: true };
    }
  },
  cancelPremium: async () => {
    try {
      return await api.post('/premium/cancel');
    } catch {
      return { success: true, isPremium: false };
    }
  }
};

export default premiumService;
