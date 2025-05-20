// src/services/maintenance.js
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
 * Get all maintenances with optional filtering
 * @param {Object} filters - Optional filters (month, year, equipment_id, scheduled_date)
 * @returns {Promise<Array>} Array of maintenance objects
 */
export const getAllMaintenances = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    // Handle all filters including scheduled_date
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Just add the filter as is - we'll handle date normalization in the component
        queryParams.append(key, value);
        console.log(`Adding filter: ${key}=${value}`);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/maintenances?${queryString}` : '/maintenances';

    console.log('Fetching maintenances from URL:', url); // Debug log
    const response = await api.get(url);
    console.log('Raw maintenances response:', response); // Debug log

    // Check if response.data has a data property
    if (response.data && response.data.data) {
      console.log('Returning response.data.data:', response.data.data);
      return response.data.data;
    }

    // If response.data is an array, return it
    if (Array.isArray(response.data)) {
      console.log('Returning response.data array:', response.data);
      return response.data;
    }

    // Default to empty array if no valid data found
    console.warn('No maintenance data found in response');
    return [];
  } catch (error) {
    console.error('Error in getAllMaintenances:', error);

    // Return empty array on error
    console.warn('Error occurred fetching maintenances');
    return [];
  }
};

/**
 * Get maintenance by ID
 * @param {number} id - The maintenance ID
 * @returns {Promise<Object>} Maintenance object
 */
export const getMaintenanceById = async (id) => {
  try {
    const response = await api.get(`/maintenances/${id}`);
    console.log('Raw maintenance by ID response:', response); // Debug log

    // Check if response.data has a data property
    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error('Error in getMaintenanceById:', error);

    // Return null on error
    console.warn('Error occurred fetching maintenance by ID');
    return null;
  }
};

/**
 * Create a new maintenance
 * @param {Object} maintenanceData - The maintenance data
 * @returns {Promise<Object>} Created maintenance
 */
export const createMaintenance = async (maintenanceData) => {
  try {
    console.log('Creating maintenance with data:', maintenanceData); // Debug log
    const response = await api.post('/maintenances', maintenanceData);
    console.log('Create maintenance response:', response); // Debug log

    // Check if response.data has a data property
    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error('Error in createMaintenance:', error);

    // Propagate the error
    console.error('Failed to create maintenance');
    throw error;
  }
};

/**
 * Update an existing maintenance
 * @param {number} id - The maintenance ID
 * @param {Object} maintenanceData - The updated maintenance data
 * @returns {Promise<Object>} Updated maintenance
 */
export const updateMaintenance = async (id, maintenanceData) => {
  try {
    const response = await api.put(`/maintenances/${id}`, maintenanceData);
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
 * Delete a maintenance
 * @param {number} id - The maintenance ID
 * @returns {Promise<Object>} Response data
 */
export const deleteMaintenance = async (id) => {
  try {
    const response = await api.delete(`/maintenances/${id}`);
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
 * Get maintenances by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of maintenance objects for the specified date
 */
export const getMaintenancesByDate = async (date) => {
  try {
    console.log('Fetching maintenances for date:', date); // Debug log

    // Use the more general getAllMaintenances function with a scheduled_date filter
    // This ensures consistent behavior between the two functions
    return await getAllMaintenances({ scheduled_date: date });
  } catch (error) {
    console.error('Error in getMaintenancesByDate:', error);

    // Return empty data array on error
    console.warn('Error occurred fetching maintenances by date');
    return [];
  }
};

/**
 * Get maintenances by equipment ID
 * @param {number} equipmentId - The equipment ID
 * @returns {Promise<Array>} Array of maintenance objects for the specified equipment
 */
export const getMaintenancesByEquipment = async (equipmentId) => {
  try {
    console.log('Fetching maintenances for equipment ID:', equipmentId); // Debug log

    // Use the more general getAllMaintenances function with an equipment_id filter
    // This ensures consistent behavior between the two functions
    return await getAllMaintenances({ equipment_id: equipmentId });
  } catch (error) {
    console.error('Error in getMaintenancesByEquipment:', error);

    // Propagate the error
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};
