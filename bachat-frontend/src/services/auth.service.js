import api from './api';

export const authService = {
  createSession: async () => {
    try {
      return await api.post('/auth/session');
    } catch (err) {
      console.warn('Session initialization warning:', err?.message || err);
      return { success: false, error: err?.message || err };
    }
  },
  getProfile: async () => {
    try {
      return await api.get('/auth/me');
    } catch {
      return { success: true };
    }
  },
};

export default authService;
