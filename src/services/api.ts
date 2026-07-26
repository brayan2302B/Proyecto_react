import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stimi_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g., token expiration / 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Logging out...');
      localStorage.removeItem('stimi_token');
      localStorage.removeItem('stimi_user');
      // Only redirect to login if we are not already on public pages
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/registro') &&
        !window.location.pathname.includes('/recuperar-contrasena')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
