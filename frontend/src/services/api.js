import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT Bearer token on all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getCustomers = async () => {
  const { data } = await api.get('/customers');
  return data.data;
};

export const createCustomer = async (customerData) => {
  const { data } = await api.post('/customers', customerData);
  return data.data;
};

export const getOrders = async () => {
  const { data } = await api.get('/orders');
  return data.data;
};

export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data.data;
};

export const getOverviewAnalytics = async () => {
  const { data } = await api.get('/analytics/overview');
  return data.data;
};

export const getCampaignAnalytics = async () => {
  const { data } = await api.get('/analytics/campaigns');
  return data.data;
};

export const generateSegment = async (prompt) => {
  const { data } = await api.post('/segments/generate', { prompt });
  return data.data;
};

export const generateCampaignMessage = async (goal) => {
  const { data } = await api.post('/ai/message', { goal });
  return data.data;
};

export const generateInsights = async () => {
  const { data } = await api.post('/ai/insights', { campaignData: {} });
  return data.data;
};

export const getSegments = async () => {
  const { data } = await api.get('/segments');
  return data.data;
};

export const createCampaign = async (campaignData) => {
  const { data } = await api.post('/campaigns', campaignData);
  return data.data;
};

export const launchCampaign = async (campaignId) => {
  const { data } = await api.post(`/campaigns/${campaignId}/launch`);
  return data.data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data.data;
};

export const signupUser = async (userData) => {
  const { data } = await api.post('/auth/signup', userData);
  return data.data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (resetData) => {
  const { data } = await api.post('/auth/reset-password', resetData);
  return data;
};

export default api;
