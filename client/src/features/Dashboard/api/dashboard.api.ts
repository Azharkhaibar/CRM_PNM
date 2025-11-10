import axios from 'axios';

export const BASE_URL_DASHBOARD_API = 'http://localhost:5530/api/v1';

const DB_API = axios.create({
  baseURL: BASE_URL_DASHBOARD_API,
  timeout: 10000,
});

DB_API.interceptors.request.use((d) => {
  const token = localStorage.getItem('access_token');
  if (token && d.headers) {
    d.headers.Authorization = `Bearer ${token}`;
  }
  return d;
});

export default DB_API;
