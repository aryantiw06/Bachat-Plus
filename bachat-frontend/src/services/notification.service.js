import api from './api';

export const notificationService = {
  getNotifications: async () => {
    try {
      return await api.get('/notifications');
    } catch {
      return { notifications: [] };
    }
  },
  markAsRead: async (id) => {
    try {
      return await api.put(`/notifications/${id}/read`);
    } catch {
      return { success: true };
    }
  },
  clearNotifications: async () => {
    try {
      return await api.delete('/notifications');
    } catch {
      return { success: true };
    }
  }
};

export default notificationService;
