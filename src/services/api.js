import axios from 'axios'; // Make sure axios is imported

// Define the API URL
export const API_URL = 'http://127.0.0.1:8000/api';
console.log('API_URL initialized as:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token to requests
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

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Test function to check if the API is available
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', API_URL);

    // Try different endpoints that might be available
    try {
      // First try the base URL
      const response = await axios.get(API_URL);
      console.log('API connection test response (base URL):', response);
      return { success: true, message: 'API connection successful (base URL)' };
    } catch (baseUrlError) {
      console.log('Base URL test failed, trying /login endpoint...');

      // If that fails, try the login endpoint
      try {
        const loginResponse = await axios.get(`${API_URL}/login`);
        console.log('API connection test response (login):', loginResponse);
        return { success: true, message: 'API connection successful (login endpoint)' };
      } catch (loginError) {
        console.log('Login endpoint test failed, trying OPTIONS request...');

        // If that fails, try an OPTIONS request which might be allowed by CORS
        try {
          const optionsResponse = await axios.options(API_URL);
          console.log('API connection test response (OPTIONS):', optionsResponse);
          return { success: true, message: 'API connection successful (OPTIONS request)' };
        } catch (optionsError) {
          console.log('OPTIONS request failed, trying profile endpoint with OPTIONS...');

          // Try the profile endpoint with OPTIONS
          const profileOptionsResponse = await axios.options(`${API_URL}/profile`);
          console.log('Profile OPTIONS response:', profileOptionsResponse);
          return { success: true, message: 'API connection successful (profile OPTIONS)' };
        }
      }
    }
  } catch (error) {
    console.error('API connection test failed:', error);
    return {
      success: false,
      message: 'API connection failed',
      error: error.message,
      status: error.response?.status
    };
  }
};

// Test function specifically for the profile update endpoint
export const testProfileEndpoint = async () => {
  try {
    console.log('Testing profile endpoint...');

    // Try OPTIONS request to the profile endpoint
    const optionsResponse = await axios.options(`${API_URL}/profile`);
    console.log('Profile endpoint OPTIONS response:', optionsResponse);

    // Check if PUT method is allowed
    const allowedMethods = optionsResponse.headers['access-control-allow-methods'] || '';
    const isPutAllowed = allowedMethods.includes('PUT');

    return {
      success: true,
      message: 'Profile endpoint available',
      isPutAllowed,
      allowedMethods
    };
  } catch (error) {
    console.error('Profile endpoint test failed:', error);
    return {
      success: false,
      message: 'Profile endpoint test failed',
      error: error.message
    };
  }
};

/**
 * Update user profile information
 * @param {Object} profileData - The profile data to update
 * @param {string} profileData.full_name - User's full name
 * @param {string} profileData.email - User's email
 * @param {string} [profileData.poste] - User's position (only for employers)
 * @param {string} [profileData.phone] - User's phone number (only for employers)
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (profileData) => {
  try {
    console.log('API service: updateProfile called with data:', profileData);
    console.log('API URL being used:', API_URL);

    // Log the request configuration for debugging
    const token = localStorage.getItem('token');
    console.log('Auth token available:', !!token);

    // Make the API request with full URL for debugging
    console.log('Full API URL:', `${API_URL}/profile`);

    // Try both approaches for debugging
    console.log('Trying with api instance...');
    try {
      // First try with the api instance
      const response = await api.put('/profile', profileData);
      console.log('API instance success!');
      return response.data;
    } catch (apiError) {
      console.error('API instance error:', apiError);

      // If that fails, try with direct axios call
      console.log('Trying with direct axios call...');
      const response = await axios.put(`${API_URL}/profile`, profileData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      console.log('Direct axios call success!');
      return response.data;
    }
  } catch (error) {
    console.error('API service: updateProfile error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    throw error;
  }
};