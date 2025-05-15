// src/services/employer.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

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
  (error) => Promise.reject(error)
);

export const fetchEmployers = async () => {
  const response = await api.get('/employers');
  return response.data.employers || [];
};
