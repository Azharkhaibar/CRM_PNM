import { useState, useCallback, useEffect } from 'react';
import { AuthService } from '../services/auth.services';
import RIMS_API from '../api/auth.api';
import { AxiosError } from 'axios';

interface AuthUser {
  userID: string;
  role?: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserLoginData = useCallback(async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await RIMS_API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      console.error('Failed fetch /me:', err);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserLoginData();
  }, [fetchUserLoginData]);

  const login = useCallback(
    async (userID: string, password: string) => {
      setError(null);
      setLoading(true);

      try {
        const token = await AuthService.login({ userID, password });

        localStorage.setItem('access_token', token);

        await fetchUserLoginData();

        return token;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchUserLoginData]
  );

  const register = useCallback(async (data: { userID: string; password: string; role: string; gender: string }) => {
    setError(null);
    setLoading(true);
    try {
      const res = await RIMS_API.post('/auth/register', data);
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Register gagal');
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };
};
