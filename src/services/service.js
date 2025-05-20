import axios from 'axios';
import { API_URL } from './api';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error))
);

export const fetchAllServices = async () => {
  const response = await api.get('/services');
  return response.data.services || [];
};

export const createService = async (name) => {
  await api.post('/services', { name });
};

export const updateService = async (id, name) => {
  await api.put(`/services/${id}`, { name });
};

export const deleteService = async (id) => {
  await api.delete(`/services/${id}`);
};

export const searchServices = async (name) => {
  const response = await api.post('/services/search', { name });
  return response.data.services || [];
};
