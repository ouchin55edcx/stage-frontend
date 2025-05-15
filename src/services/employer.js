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

export const createEmployer = async (employerData) => {
  // employerData: { full_name, email, poste, phone, service_id }
  const response = await api.post('/employers', employerData);
  return response.data;
};

export const updateEmployer = async (id, employerData) => {
  // employerData: { full_name, email, poste, phone, service_id }
  const response = await api.put(`/employers/${id}`, employerData);
  return response.data;
};

export const fetchEmployer = async (id) => {
  try {
    const response = await api.get(`/employers/${id}`);
    return response.data.employer;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const toggleEmployerStatus = async (id) => {
  try {
    const response = await api.patch(`/employers/${id}/toggle-active`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
