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
 * @param {Object} filters - Optional filters (month, year, intervention_id, scheduled_date)
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
    console.log('Creating maintenance with input data:', maintenanceData); // Debug log

    // Validate required fields
    if (!maintenanceData.intervention_id) {
      throw new Error('Intervention is required');
    }

    if (!maintenanceData.maintenance_type) {
      throw new Error('Maintenance type is required');
    }

    if (!maintenanceData.scheduled_date) {
      throw new Error('Scheduled date is required');
    }

    // First, we need to get the equipment_id from the selected intervention
    let equipmentId = null;

    try {
      // Fetch the intervention to get its equipment_id
      const interventionResponse = await api.get(`/interventions/${maintenanceData.intervention_id}`);
      console.log('Intervention response:', interventionResponse); // Debug log

      // Try different possible field names for equipment_id
      equipmentId = interventionResponse.data?.equipment_id ||
                   interventionResponse.data?.data?.equipment_id ||
                   interventionResponse.data?.equipement_id ||
                   interventionResponse.data?.data?.equipement_id;

      console.log('Retrieved equipment_id from intervention:', equipmentId);
    } catch (error) {
      console.error('Error fetching intervention:', error);
      if (error.response && error.response.status === 404) {
        throw new Error('Selected intervention not found');
      }
      throw new Error('Failed to retrieve intervention details');
    }

    if (!equipmentId) {
      throw new Error('Equipment ID could not be determined from the selected intervention');
    }

    // Validate equipment ID
    if (isNaN(parseInt(equipmentId))) {
      throw new Error('Invalid equipment ID from intervention');
    }

    // Map the form data to match the backend validation expectations (English field names)
    // The backend will handle mapping these to the French database column names
    const formattedData = {
      intervention_id: parseInt(maintenanceData.intervention_id),
      equipment_id: parseInt(equipmentId), // Equipment ID derived from intervention
      maintenance_type: maintenanceData.maintenance_type,
      scheduled_date: maintenanceData.scheduled_date,
      performed_date: maintenanceData.performed_date || null,
      next_maintenance_date: maintenanceData.next_maintenance_date || null,
      observations: maintenanceData.observations || '',
      technician_id: maintenanceData.technician_id ? parseInt(maintenanceData.technician_id) : null
    };

    console.log('Creating maintenance with formatted data:', formattedData); // Debug log
    const response = await api.post('/maintenances', formattedData);
    console.log('Create maintenance response:', response); // Debug log

    // Check if response.data has a data property
    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error('Error in createMaintenance:', error);

    // Propagate the error with more details
    if (error.response && error.response.data) {
      // Handle Laravel validation errors
      if (error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Handle other server errors
      const errorMessage = error.response.data.message ||
                          error.response.data.error ||
                          'Server validation failed';
      throw new Error(errorMessage);
    }

    // Handle network or other errors
    throw new Error(error.message || 'Failed to create maintenance');
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
 * Get maintenances by intervention ID
 * @param {number} interventionId - The intervention ID
 * @returns {Promise<Array>} Array of maintenance objects for the specified intervention
 */
export const getMaintenancesByIntervention = async (interventionId) => {
  try {
    console.log('Fetching maintenances for intervention ID:', interventionId); // Debug log

    // Use the more general getAllMaintenances function with an intervention_id filter
    // This ensures consistent behavior between the two functions
    return await getAllMaintenances({ intervention_id: interventionId });
  } catch (error) {
    console.error('Error in getMaintenancesByIntervention:', error);

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
