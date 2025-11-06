import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: '/api' // Base URL for all API requests
});

// Add a request interceptor to include the auth token
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
instance.interceptors.response.use(
  response => response, // Pass through successful responses
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // You might want to show a toast notification here
      toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
      // Redirect to login page
      window.location.href = '/login'; 
    }
    return Promise.reject(error); // Pass on other errors
  }
);

export default instance;
