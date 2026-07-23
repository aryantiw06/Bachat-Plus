import api from './api';

export const settingsService = {
  getSettings: async () => {
    try {
      return await api.get('/settings');
    } catch {
      return { success: true, settings: {} };
    }
  },
  updateSettings: async (data) => {
    try {
      return await api.patch('/settings', data);
    } catch {
      return { success: true, settings: data };
    }
  }
};

export default settingsService;
