// src/services/api-hukum.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5530/api/v1';

export const apiHukum = axios.create({
  baseURL: `${API_BASE_URL}/hukum`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk debugging
apiHukum.interceptors.request.use((config) => {
  console.log(`📤 [HUKUM] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

apiHukum.interceptors.response.use(
  (response) => {
    console.log(`📥 [HUKUM] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ [HUKUM] ${error.response?.status || 'Network'} ${error.config?.url}`);
    return Promise.reject(error);
  }
);

export default apiHukum;
