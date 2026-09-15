import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createCompany = (companyData) => api.post('/company', companyData);
export const getCompany = (companyId) => api.get(`/company/${companyId}`);

export const calculateEmissions = (companyId, emissionsData) => 
  api.post(`/emissions/${companyId}`, emissionsData);
export const getEmissions = (companyId) => api.get(`/emissions/${companyId}`);

export const getBenchmark = (companyId) => api.get(`/benchmark/${companyId}`);

export const generateRecommendations = (companyId) => api.post(`/recommendations/${companyId}`);
export const getRecommendations = (companyId) => api.get(`/recommendations/${companyId}`);

export const getOpportunities = (companyId) => api.get(`/opportunities/${companyId}`);

export const generateReport = (companyId) => api.post(`/report/${companyId}`);

export default api;
