// api.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5530';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`, 
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk debugging
api.interceptors.request.use((config) => {
  console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status || 'Network'} ${error.config?.url}`);
    return Promise.reject(error);
  }
);

export default api;
