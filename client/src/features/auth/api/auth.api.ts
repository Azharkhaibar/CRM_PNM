import axios from 'axios';

const BASE_URL_API = 'http://localhost:5530/api/v1';

const RIMS_API = axios.create({
  baseURL: BASE_URL_API,
  timeout: 10000,
});

RIMS_API.interceptors.request.use((c) => {
  const token = localStorage.getItem('access_token');
  if (token && c.headers) {
    c.headers.Authorization = `Bearer ${token}`;
  }
  return c;
});

export default RIMS_API;
