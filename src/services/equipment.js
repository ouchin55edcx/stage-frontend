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

const getAllEquipments = async () => {
    try {
        const response = await api.get('/equipments');

        // Ensure we return an array
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data && typeof response.data === 'object') {
            // Check if there's an array property in the response
            const possibleArrays = Object.entries(response.data)
                .filter(([key, value]) => Array.isArray(value))
                .map(([key, value]) => value);

            if (possibleArrays.length > 0) {
                return possibleArrays[0]; // Return the first array found
            } else if (response.data.id) {
                // If it's a single equipment object, wrap it in an array
                return [response.data];
            }
        }

        // Default to empty array if no valid data found
        console.warn('No equipment data found in response, returning empty array');
        return [];
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

const getEquipmentById = async (id) => {
    try {
        const response = await api.get(`/equipments/${id}`);
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

const createEquipment = async (equipmentData) => {
    try {
        const response = await api.post('/equipments', equipmentData);
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

const updateEquipment = async (id, equipmentData) => {
    try {
        const response = await api.put(`/equipments/${id}`, equipmentData);
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

const deleteEquipment = async (id) => {
    try {
        const response = await api.delete(`/equipments/${id}`);
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

export {
    getAllEquipments,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};
