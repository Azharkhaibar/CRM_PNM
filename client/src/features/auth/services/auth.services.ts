import { AxiosError } from 'axios';
import RIMS_API from '../api/auth.api';

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user?: any;
}

interface AuthUser {
  userID: string;
  role?: string;
  email?: string;
  gender?: string;
}

export const AuthService = {
  login: async (payload: { userID: string; password: string }): Promise<string> => {
    try {
      const response = await RIMS_API.post<LoginResponse>('/auth/login', payload);

      const token = response.data?.accessToken;

      if (!token) {
        throw new Error('No Access Token received from server');
      }

      return token;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || 'Invalid credentials');
      }
      throw err;
    }
  },

  me: async (): Promise<AuthUser> => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No token found');

    const res = await RIMS_API.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  register: async (payload: { userID: string; password: string; role: string; gender: string }): Promise<void> => {
    try {
      await RIMS_API.post('/auth/register', payload);
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || 'Register failed');
      }
      throw err;
    }
  },
};
