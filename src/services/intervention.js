// src/services/intervention.js
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
  (error) => Promise.reject(error)
);

/**
 * Fetch all interventions
 * @returns {Promise<Array>} Array of intervention objects
 */
export const fetchInterventions = async () => {
  try {
    const response = await api.get('/interventions');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

/**
 * Fetch a specific intervention by ID
 * @param {number} id - The intervention ID
 * @returns {Promise<Object>} Intervention object
 */
export const getInterventionById = async (id) => {
  try {
    const response = await api.get(`/interventions/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

/**
 * Create a new intervention
 * @param {Object} interventionData - The intervention data
 * @returns {Promise<Object>} Created intervention
 */
export const createIntervention = async (interventionData) => {
  try {
    const response = await api.post('/interventions', interventionData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

/**
 * Update an existing intervention
 * @param {number} id - The intervention ID
 * @param {Object} interventionData - The updated intervention data
 * @returns {Promise<Object>} Updated intervention
 */
export const updateIntervention = async (id, interventionData) => {
  try {
    const response = await api.put(`/interventions/${id}`, interventionData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

/**
 * Delete an intervention
 * @param {number} id - The intervention ID to delete
 * @returns {Promise<Object>} Response data
 */
export const deleteIntervention = async (id) => {
  try {
    const response = await api.delete(`/interventions/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};
