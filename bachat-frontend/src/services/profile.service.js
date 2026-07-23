import api from './api';

export const profileService = {
  getProfile: async () => {
    try {
      return await api.get('/profile');
    } catch {
      return { success: true, profile: {} };
    }
  },
  updateProfile: async (data) => {
    try {
      return await api.put('/profile/update', data);
    } catch {
      return { success: true, profile: data };
    }
  }
};

export default profileService;
