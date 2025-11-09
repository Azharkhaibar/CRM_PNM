import { useState, useCallback, useEffect } from 'react';
import { AuthService } from '../services/auth.services';
import RIMS_API from '../api/auth.api';
import { AxiosError } from 'axios';
import { ProfileService } from '../../Dashboard/pages/profile/services/profile.services';
interface AuthUser {
  userID: string;
  role?: string;
  email?: string;
  user_id?: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

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

  const fetchProfile = useCallback(async () => {
    if (!user?.user_id) {
      return null;
    }

    try {
      const res = await ProfileService.getProfile(user.user_id);
      return res;
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      return null;
    }
  }, [user?.user_id]);

  const updateProfile = useCallback(
    async (data: any) => {
      if (!user?.user_id) {
        throw new Error('User ID tidak ditemukan');
      }

      setUpdating(true);
      setError(null);

      try {
        const updated = await ProfileService.updateProfile(user.user_id, data);
        return updated;
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [user?.user_id]
  );

  // ganti password

  const changePassword = useCallback(async (passwordData: { currentPassword: string; newPassword: string }) => {
    setUpdating(true);
    setError(null);

    try {
      const res = await RIMS_API.put('/auth/change-password', passwordData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMsg = err.response?.data?.message || 'Gagal mengubah password';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (userID: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await RIMS_API.post('/auth/forgot-password', { userID });
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMsg = err.response?.data?.message || 'Gagal meminta reset password';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    updating,
    error,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    requestPasswordReset,
  };
};
