// hooks/useAuth.hook.ts
import { useState, useCallback, useEffect } from 'react';
import { AuthService } from '../services/auth.services';
import RIMS_API from '../api/auth.api';
import { AxiosError } from 'axios';
import { NotificationService } from '../../Dashboard/pages/notification/services/notification.services';
import { ProfileService } from '../../Dashboard/pages/profile/services/profile.services';
import { useNotificationStore } from '../../Dashboard/pages/notification/stores/notification.stores';

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

  // Function untuk membuat notifikasi login
  const createLoginNotification = useCallback(async (userId: number, userID: string) => {
    try {
      await NotificationService.createLoginNotification(userId, userID);
      await NotificationService.createUserStatusBroadcast(userId, userID, 'login');
      console.log('✅ Login notifications created for user:', userID);
    } catch (error) {
      console.error('❌ Failed to create login notifications:', error);
    }
  }, []);

  // Function untuk membuat notifikasi logout
  const createLogoutNotification = useCallback(async (userId: number, userID: string) => {
    try {
      await NotificationService.createLogoutNotification(userId, userID);
      await NotificationService.createUserStatusBroadcast(userId, userID, 'logout');
      console.log('✅ Logout notifications created for user:', userID);
    } catch (error) {
      console.error('❌ Failed to create logout notifications:', error);
    }
  }, []);

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
      const userData = res.data;
      setUser(userData);

      // Cek apakah sudah ada notifikasi login hari ini
      const lastLoginDate = localStorage.getItem(`last_login_${userData.user_id}`);
      const today = new Date().toDateString();

      if (lastLoginDate !== today) {
        await createLoginNotification(userData.user_id, userData.userID);
        localStorage.setItem(`last_login_${userData.user_id}`, today);
      }
    } catch (err) {
      console.error('Failed fetch /me:', err);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [createLoginNotification]);

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

        const res = await RIMS_API.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        setUser(userData);

        if (userData.user_id) {
          await createLoginNotification(userData.user_id, userData.userID);
          localStorage.setItem(`last_login_${userData.user_id}`, new Date().toDateString());
        }

        return token;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createLoginNotification]
  );

  // ✅ PERBAIKAN: Fix error handling untuk register
  const register = useCallback(async (data: { userID: string; password: string; role: string; gender: string }) => {
    setError(null);
    setLoading(true);
    try {
      const res = await RIMS_API.post('/auth/register', data);

      // Create welcome notification for new user
      if (res.data.user_id) {
        await NotificationService.createNotification({
          userId: res.data.user_id,
          type: 'success',
          title: 'Welcome to RIMS!',
          message: `Welcome to RIMS, ${data.userID}! Your account has been successfully created.`,
          category: 'system',
          metadata: {
            registration_time: new Date().toISOString(),
            activity_type: 'registration',
          },
        });
      }

      return res.data;
    } catch (err) {
      // ✅ PERBAIKAN: Handle error response yang berisi array message
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;

        let errorMessage = 'Register gagal';

        if (responseData) {
          // Jika response berisi array message (seperti validation errors)
          if (Array.isArray(responseData.message)) {
            // Gabungkan semua message menjadi satu string
            errorMessage = responseData.message
              .map((msg: any) => {
                if (typeof msg === 'string') return msg;
                if (msg.constraints) {
                  // Handle class-validator constraints
                  return Object.values(msg.constraints).join(', ');
                }
                return JSON.stringify(msg);
              })
              .join(', ');
          }
          // Jika response berisi string message
          else if (typeof responseData.message === 'string') {
            errorMessage = responseData.message;
          }
          // Jika response berisi error field
          else if (responseData.error) {
            errorMessage = responseData.error;
          }
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // Untuk error non-Axios
      const errorMessage = err instanceof Error ? err.message : 'Register gagal';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (user?.user_id) {
      // Create notifications before clearing data
      await createLogoutNotification(user.user_id, user.userID);
    }

    // Clear all auth data
    localStorage.removeItem('access_token');
    if (user?.user_id) {
      localStorage.removeItem(`last_login_${user.user_id}`);
    }

    setUser(null);
  }, [user, createLogoutNotification]);

  // ✅ FIX: Tambahkan fungsi fetchProfile yang hilang
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

        // Create profile update notification
        await NotificationService.createNotification({
          userId: user.user_id,
          type: 'info',
          title: 'Profile Updated',
          message: 'Your profile information has been successfully updated.',
          category: 'user_activity',
          metadata: {
            update_time: new Date().toISOString(),
            activity_type: 'profile_update',
          },
        });

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

  const changePassword = useCallback(
    async (passwordData: { currentPassword: string; newPassword: string }) => {
      setUpdating(true);
      setError(null);

      try {
        const res = await RIMS_API.put('/auth/change-password', passwordData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });

        // Create password change notification
        if (user?.user_id) {
          await NotificationService.createNotification({
            userId: user.user_id,
            type: 'success',
            title: 'Password Changed',
            message: 'Your password has been successfully changed.',
            category: 'security',
            metadata: {
              change_time: new Date().toISOString(),
              activity_type: 'password_change',
            },
          });
        }

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
    },
    [user?.user_id]
  );

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

  // Function untuk track aktivitas user lainnya
  const trackUserActivity = useCallback(
    async (activity: string, metadata?: any) => {
      if (!user?.user_id) return;

      try {
        await NotificationService.createNotification({
          userId: user.user_id,
          type: 'info',
          title: 'User Activity',
          message: activity,
          category: 'user_activity',
          metadata: {
            activity_time: new Date().toISOString(),
            activity_type: 'user_action',
            ...metadata,
          },
        });
      } catch (error) {
        console.error('Failed to track user activity:', error);
      }
    },
    [user?.user_id]
  );

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
    trackUserActivity,
  };
};
