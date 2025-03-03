import axios from 'axios';

// Determine the API base URL based on environment
const getBaseUrl = () => {
  // For local development, the empty string will use the Vite proxy
  if (import.meta.env.DEV) {
    return '';
  }

  // For production, use your deployed backend URL
  return import.meta.env.VITE_API_URL;
};

// Create an axios instance with the appropriate base URL
const api = axios.create({
  baseURL: getBaseUrl(),
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;