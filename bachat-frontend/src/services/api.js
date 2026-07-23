import axios from 'axios';
import { auth } from '../firebase';

// Primary API Base URL: Uses environment variable VITE_API_URL if defined,
// otherwise defaults to deployed Render backend URL in production.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://baachat-plus.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Firebase Auth ID Token automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Fallback for dev mode when user is not signed in
        config.headers.Authorization = `Bearer dev-user-123`;
      }
    } catch (err) {
      config.headers.Authorization = `Bearer dev-user-123`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized status handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred';

    if (status === 401) {
      console.warn('⚡ [API 401] Unauthorized access - Token expired or invalid.');
    } else if (status === 403) {
      console.warn('⚡ [API 403] Forbidden request.');
    } else if (status === 404) {
      console.warn('⚡ [API 404] Resource not found.');
    } else if (status === 500) {
      console.error('⚡ [API 500] Internal server error:', message);
    } else if (!error.response) {
      console.error('⚡ [API Network Error] Connection to backend failed.');
    }

    return Promise.reject({ status, message, rawError: error });
  }
);

export default api;
