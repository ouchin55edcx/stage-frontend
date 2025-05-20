// src/services/statistics.js
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
 * Fetch all statistics data
 * @returns {Promise<Object>} Statistics data object
 */
export const fetchStatistics = async () => {
  try {
    const response = await api.get('/statistics');
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
 * Fetch my statistics data
 * @returns {Promise<Object>} My statistics data object
 */
export const fetchMyStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Fetching statistics with token:', token ? 'Token exists' : 'No token found');

    const response = await axios.get(`${API_URL}/my-statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Statistics API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(error.response?.data?.message || 'Erreur lors du chargement des statistiques');
  }
};

/**
 * Format statistics data for charts and display
 * @param {Object} data - Raw statistics data from API
 * @returns {Object} Formatted data for dashboard
 */
export const formatStatisticsForDashboard = (data) => {
  if (!data) return null;

  return {
    users: {
      total: data.users.total || 0,
      admins: data.users.admins || 0,
      employers: data.users.employers || 0,
      active: data.users.active_employers || 0,
      inactive: data.users.inactive_employers || 0,
      recent: data.users.recent_users || [],
      byService: data.users.employers_by_service || {}
    },
    equipment: {
      total: data.equipment.total || 0,
      active: data.equipment.active || 0,
      onHold: data.equipment.on_hold || 0,
      inProgress: data.equipment.in_progress || 0,
      byType: data.equipment.by_type || [],
      byBrand: data.equipment.by_brand || [],
      backupEnabled: data.equipment.backup_enabled_count || 0,
      backupDisabled: data.equipment.backup_disabled_count || 0,
      recent: data.equipment.recent || []
    },
    services: {
      total: data.services.total || 0,
      withEmployers: data.services.with_employers || 0,
      withoutEmployers: data.services.without_employers || 0,
      distribution: data.services.employers_distribution || []
    },
    declarations: {
      total: data.declarations.total || 0,
      pending: data.declarations.pending || 0,
      approved: data.declarations.approved || 0,
      rejected: data.declarations.rejected || 0,
      recent: data.declarations.recent || []
    },
    interventions: {
      total: data.interventions.total || 0,
      recent: data.interventions.recent || [],
      byMonth: data.interventions.by_month || []
    },
    licenses: {
      total: data.licenses.total || 0,
      expiringSoon: data.licenses.expiring_soon || 0,
      expired: data.licenses.expired || 0,
      byType: data.licenses.by_type || []
    },
    timeStats: {
      declarationsByMonth: data.time_stats.declarations_by_month || [],
      equipmentByMonth: data.time_stats.equipment_by_month || [],
      usersByMonth: data.time_stats.users_by_month || []
    }
  };
};
