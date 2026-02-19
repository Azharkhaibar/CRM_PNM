// src/features/Dashboard/pages/RAS/service/rasService/rasApi.service.ts
import axios, { AxiosError } from 'axios';


const CONSTANTS_BASE_API_URL = 'http://localhost:5530/api/v1/ras';

console.log('🚀 RAS API URL:', CONSTANTS_BASE_API_URL);

export const api_ras = axios.create({
  baseURL: CONSTANTS_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, 
});


api_ras.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

api_ras.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data?.length || 'object',
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('🔥 Menu RAS Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorCode: error.code,
      errorMessage: error.message,
      isNetworkError: error.code === 'ERR_NETWORK',
    });

    if (error.code === 'ERR_NETWORK') {
      error.message = '❌ TIDAK DAPAT TERHUBUNG KE SERVER\n\n' + 'Pastikan:\n' + '1. Backend berjalan di http://localhost:5530\n' + '2. Coba buka di browser: http://localhost:5530/api/v1/ras\n' + '3. Cek terminal backend (npm run start)';
    }

    return Promise.reject(error);
  },
);

export default api_ras;
