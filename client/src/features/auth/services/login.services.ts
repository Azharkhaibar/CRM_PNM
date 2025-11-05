import { AxiosError } from 'axios';
import RIMS_API from '../api/auth.api';

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user?: any;
}

export const LoginService = {
  login: async (payload: { userID: string; hash_password: string }): Promise<string> => {
    try {
      const response = await RIMS_API.post<LoginResponse>('/auth/login', payload);

      const token = response.data?.access_token;

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
};
