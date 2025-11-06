import { useState, useCallback, useEffect } from 'react';
import { LoginService } from '../services/login.services';
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        const token = await LoginService.login({ userID, password });

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

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
};
