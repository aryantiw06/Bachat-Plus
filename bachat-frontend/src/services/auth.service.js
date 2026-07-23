import api from './api';

export const authService = {
  getProfile: async () => {
    try {
      return await api.get('/auth/me');
    } catch {
      return { success: true };
    }
  }
};

export default authService;
