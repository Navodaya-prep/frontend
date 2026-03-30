import axios from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = 'https://backend-prnk.onrender.com/api';

export const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(async (config) => {
  // Don't overwrite if caller already set a custom Authorization (e.g. tempToken for signup)
  if (!config.headers.Authorization) {
    const token = await storage.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    // Unwrap our API envelope: { success, message, data } → expose inner data as response.data
    if (response.data && response.data.success !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      await storage.clear();
    }
    return Promise.reject(error);
  }
);
