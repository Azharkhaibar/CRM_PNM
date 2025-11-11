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
      const { addNotification } = useNotificationStore.getState();

      await NotificationService.createNotification({
        userId: userId,
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${userID}! You have successfully logged into RIMS at ${new Date().toLocaleTimeString()}.`,
        category: 'security',
        metadata: {
          login_time: new Date().toISOString(),
          user_agent: navigator.userAgent,
          activity_type: 'login',
          ip_address: 'system', // Bisa diganti dengan real IP jika ada
        },
      });

      addNotification({
        userId: userId.toString(),
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${userID}! You have successfully logged into RIMS at ${new Date().toLocaleTimeString()}.`,
        category: 'security',
        metadata: {
          login_time: new Date().toISOString(),
          user_agent: navigator.userAgent,
          activity_type: 'login',
        },
      });
      console.log('✅ Login notification created for user:', userID);
    } catch (error) {
      console.error('❌ Failed to create login notification:', error);
    }
  }, []);

  // Function untuk membuat notifikasi logout
  const createLogoutNotification = useCallback(async (userId: number, userID: string) => {
    try {
      const { addNotification } = useNotificationStore.getState();
      await NotificationService.createNotification({
        userId: userId,
        type: 'info',
        title: 'Logout Successful',
        message: `You have logged out from RIMS at ${new Date().toLocaleTimeString()}.`,
        category: 'security',
        metadata: {
          logout_time: new Date().toISOString(),
          activity_type: 'logout',
          session_duration: 'system', // Bisa dihitung duration session
        },
      });

      addNotification({
        userId: userId.toString(),
        type: 'info',
        title: 'Logout Successful',
        message: `You have logged out from RIMS at ${new Date().toLocaleTimeString()}.`,
        category: 'security',
        metadata: {
          logout_time: new Date().toISOString(),
          activity_type: 'logout',
        },
      });
      console.log('✅ Logout notification created for user:', userID);
    } catch (error) {
      console.error('❌ Failed to create logout notification:', error);
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

      // Check if this is first login today to create notification
      const lastLoginDate = localStorage.getItem(`last_login_${userData.user_id}`);
      const today = new Date().toDateString();

      if (lastLoginDate !== today) {
        await createLoginNotification(userData.user_id, userData.userID);
        localStorage.setItem(`last_login_${userData.user_id}`, today);

        // Juga simpan waktu login untuk tracking session
        localStorage.setItem(`login_time_${userData.user_id}`, new Date().toISOString());
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

        // Create login notification after successful login
        if (userData.user_id) {
          await createLoginNotification(userData.user_id, userData.userID);

          // Simpan waktu login untuk tracking session duration
          localStorage.setItem(`login_time_${userData.user_id}`, new Date().toISOString());
        }

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
    [createLoginNotification]
  );

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
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Register gagal');
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (user?.user_id) {
      // Create logout notification before clearing data
      await createLogoutNotification(user.user_id, user.userID);
    }

    // Clear all auth data
    localStorage.removeItem('access_token');
    if (user?.user_id) {
      localStorage.removeItem(`last_login_${user.user_id}`);
      localStorage.removeItem(`login_time_${user.user_id}`);
    }

    setUser(null);
  }, [user, createLogoutNotification]);

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
    trackUserActivity, // Export trackUserActivity untuk digunakan di komponen lain
  };
};
