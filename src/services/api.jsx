import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/ahorraHoy/v1/';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  httpsAgent: false, // Disable SSL verification
});

apiClient.interceptors.request.use(
    (config) => {

        const userDetails = localStorage.getItem('user');

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (err) {
                console.warn('Error al leer el token:', err);
            }
        }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      if (window.location.pathname !== '/auth') {
        window.location.replace('/auth');
      }
    }
    return Promise.reject(error);
  }
);

export const register = async (data) => {
  try {
    return await apiClient.post('/auth/register', data);
  } catch (e) {
    return {
        error: true,
        e
    }
  }
};

export const login = async (data) => {
    return await apiClient.post('/auth/login', data);
};