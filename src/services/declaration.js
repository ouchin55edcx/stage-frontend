// src/services/declaration.js
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
 * Fetch all declarations (admin only)
 * @returns {Promise<Array>} Array of declaration objects
 */
export const fetchDeclarations = async () => {
  try {
    const response = await api.get('/all-declarations');
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
 * Fetch declarations for the logged-in employer
 * @returns {Promise<Array>} Array of declaration objects for the current employer
 */
export const fetchMyDeclarations = async () => {
  try {
    const response = await api.get('/my-declarations');
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
 * Fetch a specific declaration by ID
 * @param {number} id - The declaration ID
 * @returns {Promise<Object>} Declaration object
 */
export const getDeclarationById = async (id) => {
  try {
    const response = await api.get(`/declarations/${id}`);
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
 * Create a new declaration
 * @param {Object} declarationData - The declaration data
 * @returns {Promise<Object>} Created declaration
 */
export const createDeclaration = async (declarationData) => {
  try {
    const response = await api.post('/declarations', declarationData);
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
 * Update an existing declaration
 * @param {number} id - The declaration ID
 * @param {Object} declarationData - The updated declaration data
 * @returns {Promise<Object>} Updated declaration
 */
export const updateDeclaration = async (id, declarationData) => {
  try {
    const response = await api.put(`/declarations/${id}`, declarationData);
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
 * Delete a declaration
 * @param {number} id - The declaration ID to delete
 * @returns {Promise<Object>} Response data
 */
export const deleteDeclaration = async (id) => {
  try {
    const response = await api.delete(`/declarations/${id}`);
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
 * Update declaration status (admin only)
 * @param {number} id - The declaration ID
 * @param {string} status - The new status ('resolved', 'rejected', 'in_progress', 'pending')
 * @param {string} adminComment - Admin comment for the status change
 * @returns {Promise<Object>} Updated declaration
 */
export const updateDeclarationStatus = async (id, status, adminComment) => {
  try {
    const response = await api.put(`/declarations/${id}`, {
      status,
      admin_comment: adminComment
    });
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
 * Approve a declaration (admin only)
 * @param {number} id - The declaration ID
 * @param {string} adminComment - Admin comment for approval
 * @returns {Promise<Object>} Updated declaration
 */
export const approveDeclaration = async (id, adminComment = "Issue has been reviewed and resolved") => {
  try {
    const response = await api.put(`/declarations/${id}`, {
      status: "resolved",
      admin_comment: adminComment
    });
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
 * Reject a declaration (admin only)
 * @param {number} id - The declaration ID
 * @param {string} adminComment - Admin comment for rejection
 * @returns {Promise<Object>} Updated declaration
 */
export const rejectDeclaration = async (id, adminComment = "Insufficient information provided") => {
  try {
    const response = await api.put(`/declarations/${id}`, {
      status: "rejected",
      admin_comment: adminComment
    });
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
