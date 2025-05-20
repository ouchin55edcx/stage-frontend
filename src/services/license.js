// src/services/license.js
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
 * Fetch all licenses
 * @returns {Promise<Array>} Array of license objects
 */
export const fetchLicenses = async () => {
  try {
    const response = await api.get('/licenses');
    return response.data.data || [];
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
 * Fetch a specific license by ID
 * @param {number} id - The license ID
 * @returns {Promise<Object>} License object
 */
export const getLicenseById = async (id) => {
  try {
    const response = await api.get(`/licenses/${id}`);
    return response.data.data;
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
 * Create a new license
 * @param {Object} licenseData - The license data
 * @returns {Promise<Object>} Created license
 */
export const createLicense = async (licenseData) => {
  try {
    const response = await api.post('/licenses', licenseData);
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
 * Update a license
 * @param {number} id - The license ID
 * @param {Object} licenseData - The updated license data
 * @returns {Promise<Object>} Updated license
 */
export const updateLicense = async (id, licenseData) => {
  try {
    const response = await api.put(`/licenses/${id}`, licenseData);
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
 * Delete a license
 * @param {number} id - The license ID
 * @returns {Promise<Object>} Response data
 */
export const deleteLicense = async (id) => {
  try {
    const response = await api.delete(`/licenses/${id}`);
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
