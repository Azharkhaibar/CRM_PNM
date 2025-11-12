// hooks/useAuth.hook.ts
import { useState, useCallback, useEffect, useRef } from 'react';
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

  const userRef = useRef<AuthUser | null>(null);
  
  const loginNotificationSentRef = useRef<boolean>(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const createLoginNotification = useCallback(async (userId: number, userID: string) => {
    const notificationId = `login-${userId}-${Date.now()}`;
    console.log(`🔔 [${notificationId}] Starting login notification creation for user:`, { userId, userID });

    try {
      console.log(`🔔 [${notificationId}] Creating user-specific login notification...`);
      await NotificationService.createLoginNotification(userId, userID);
      console.log(`✅ [${notificationId}] User-specific login notification created successfully`);

      console.log(`🔔 [${notificationId}] Creating broadcast login notification...`);
      await NotificationService.createUserStatusBroadcast(userId, userID, 'login');
      console.log(`✅ [${notificationId}] Broadcast login notification created successfully`);

      console.log(`🎉 [${notificationId}] All login notifications completed for user: ${userID}`);
    } catch (error) {
      console.error(`❌ [${notificationId}] Failed to create login notifications:`, error);
    }
  }, []);

  const createLogoutNotification = useCallback(async (userId: number, userID: string) => {
    const notificationId = `logout-${userId}-${Date.now()}`;
    console.log(`🔔 [${notificationId}] Starting logout notification creation for user:`, { userId, userID });

    loginNotificationSentRef.current = false;

    try {
      console.log(`🔔 [${notificationId}] Creating user-specific logout notification...`);
      await NotificationService.createLogoutNotification(userId, userID);

      console.log(`✅ [${notificationId}] Logout notification created successfully for user: ${userID}`);
      return true;
    } catch (error) {
      console.error(`❌ [${notificationId}] Failed to create logout notification:`, error);
      try {
        console.log(`🔄 [${notificationId}] Creating local fallback notification...`);
        const store = useNotificationStore.getState();
        store.addNotification({
          userId: userId.toString(),
          type: 'info',
          title: 'Logout Successful',
          message: `You have successfully logged out. See you soon, ${userID}!`,
          category: 'security',
          metadata: {
            logout_time: new Date().toISOString(),
            activity_type: 'logout',
            user_id: userId,
            username: userID,
            is_fallback: true,
            notification_id: notificationId,
          },
        });
        console.log(`✅ [${notificationId}] Local fallback logout notification created`);
        return true;
      } catch (fallbackError) {
        console.error(`[${notificationId}] Fallback notification also failed:`, fallbackError);
        return false;
      }
    }
  }, []);

  const fetchUserLoginData = useCallback(async () => {
    console.log('🔄 Checking authentication status...');
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.log('ℹ️ No access token found, user is not authenticated');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Fetching user data from /auth/me endpoint...');
      const res = await RIMS_API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data;
      console.log('✅ User data fetched successfully:', {
        userID: userData.userID,
        user_id: userData.user_id,
        role: userData.role,
      });

      setUser(userData);

      const today = new Date().toDateString();
      const lastLoginKey = `last_login_${userData.user_id}`;
      const lastLoginDate = localStorage.getItem(lastLoginKey);

      if (lastLoginDate !== today) {
        console.log('🆕 First login today detected, will create notification on next actual login');
        localStorage.setItem(lastLoginKey, today);
      }
    } catch (err) {
      console.error('❌ Failed to fetch user data:', err);
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
      const loginId = `login-${Date.now()}`;
      console.log(`🔐 [${loginId}] Starting login process for user:`, userID);

      setError(null);
      setLoading(true);

      try {
        console.log(`🔐 [${loginId}] Authenticating user...`);
        const token = await AuthService.login({ userID, password });
        console.log(`✅ [${loginId}] Authentication successful, token received`);

        localStorage.setItem('access_token', token);

        console.log(`🔐 [${loginId}] Fetching user profile...`);
        const res = await RIMS_API.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        console.log(`✅ [${loginId}] User profile fetched:`, {
          userID: userData.userID,
          user_id: userData.user_id,
        });

        setUser(userData);

        if (userData.user_id) {
          console.log(`🔐 [${loginId}] Creating login notifications...`);
          await createLoginNotification(userData.user_id, userData.userID);
          localStorage.setItem(`last_login_${userData.user_id}`, new Date().toDateString());
        }

        console.log(`🎉 [${loginId}] Login process completed successfully for user: ${userID}`);
        return token;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        console.error(`❌ [${loginId}] Login failed:`, errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createLoginNotification]
  );

  const register = useCallback(async (data: { userID: string; password: string; role: string; gender: string }) => {
    const registerId = `register-${Date.now()}`;
    console.log(`📝 [${registerId}] Starting registration process for user:`, data.userID);

    setError(null);
    setLoading(true);

    try {
      console.log(`📝 [${registerId}] Sending registration request...`);
      const res = await RIMS_API.post('/auth/register', data);
      console.log(`✅ [${registerId}] Registration successful:`, { user_id: res.data.user_id });

      if (res.data.user_id) {
        try {
          console.log(`📝 [${registerId}] Creating welcome notification...`);
          await NotificationService.createNotification({
            userId: res.data.user_id,
            type: 'success',
            title: 'Welcome to RIMS!',
            message: `Welcome to RIMS, ${data.userID}! Your account has been successfully created.`,
            category: 'system',
            metadata: {
              registration_time: new Date().toISOString(),
              activity_type: 'registration',
              register_id: registerId,
            },
          });
          console.log(`✅ [${registerId}] Welcome notification created successfully`);
        } catch (notifError) {
          console.error(`[${registerId}] Failed to create welcome notification:`, notifError);
        }
      }

      console.log(`🎉 [${registerId}] Registration process completed for user: ${data.userID}`);
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;

        let errorMessage = 'Register gagal';

        if (responseData) {
          if (Array.isArray(responseData.message)) {
            errorMessage = responseData.message
              .map((msg: any) => {
                if (typeof msg === 'string') return msg;
                if (msg.constraints) {
                  return Object.values(msg.constraints).join(', ');
                }
                return JSON.stringify(msg);
              })
              .join(', ');
          } else if (typeof responseData.message === 'string') {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          }
        }

        console.error(`[${registerId}] Registration failed:`, errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const errorMessage = err instanceof Error ? err.message : 'Register gagal';
      console.error(`[${registerId}] Registration failed:`, errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    const logoutId = `logout-${Date.now()}`;
    console.log(`🚪 [${logoutId}] Starting logout process...`);

    const currentUser = userRef.current;
    const userId = currentUser?.user_id;
    const userID = currentUser?.userID;

    console.log(`🚪 [${logoutId}] Current user data:`, { userId, userID });

    if (!userId || !userID) {
      console.log(`⚠️ [${logoutId}] No user data found, clearing auth data only`);
      localStorage.removeItem('access_token');
      setUser(null);
      console.log(`✅ [${logoutId}] Logout completed (no user data)`);
      return;
    }

    try {
      console.log(`🚪 [${logoutId}] Creating logout notifications...`);
      const notificationSuccess = await createLogoutNotification(userId, userID);

      if (!notificationSuccess) {
        console.log(`⚠️ [${logoutId}] Logout notifications failed, but continuing logout process`);
      }

      console.log(`🚪 [${logoutId}] Finalizing logout process...`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[${logoutId}] Error during logout process:`, error);
    } finally {
      console.log(`🚪 [${logoutId}] Clearing authentication data...`);
      localStorage.removeItem('access_token');
      if (userId) {
        localStorage.removeItem(`last_login_${userId}`);
      }
      setUser(null);

      console.log(`✅ [${logoutId}] Logout process completed successfully for user: ${userID}`);
    }
  }, [createLogoutNotification]);

 
  const quickLogout = useCallback(() => {
    const logoutId = `quick-logout-${Date.now()}`;
    console.log(`[${logoutId}] Starting quick logout process...`);

    const currentUser = userRef.current;
    const userId = currentUser?.user_id;

    console.log(`[${logoutId}] Current user:`, { userId, userID: currentUser?.userID });

    localStorage.removeItem('access_token');
    if (userId) {
      localStorage.removeItem(`last_login_${userId}`);
    }
    setUser(null);

    console.log(`[${logoutId}] Quick logout completed`);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user?.user_id) {
      console.log('⚠️ Cannot fetch profile: no user ID');
      return null;
    }

    console.log(`👤 Fetching profile for user: ${user.user_id}`);
    try {
      const res = await ProfileService.getProfile(user.user_id);
      console.log(` Profile fetched successfully for user: ${user.user_id}`);
      return res;
    } catch (err) {
      console.error(`Failed to fetch profile for user ${user.user_id}:`, err);
      if (err instanceof Error) setError(err.message);
      return null;
    }
  }, [user?.user_id]);

  const updateProfile = useCallback(
    async (data: any) => {
      if (!user?.user_id) {
        throw new Error('User ID tidak ditemukan');
      }

      const updateId = `profile-update-${Date.now()}`;
      console.log(`✏️ [${updateId}] Starting profile update for user: ${user.user_id}`);

      setUpdating(true);
      setError(null);

      try {
        const updated = await ProfileService.updateProfile(user.user_id, data);
        console.log(`✅ [${updateId}] Profile updated successfully`);

        try {
          console.log(`✏️ [${updateId}] Creating profile update notification...`);
          await NotificationService.createNotification({
            userId: user.user_id,
            type: 'info',
            title: 'Profile Updated',
            message: 'Your profile information has been successfully updated.',
            category: 'user_activity',
            metadata: {
              update_time: new Date().toISOString(),
              activity_type: 'profile_update',
              update_id: updateId,
            },
          });
          console.log(`[${updateId}] Profile update notification created`);
        } catch (notifError) {
          console.error(`[${updateId}] Failed to create profile update notification:`, notifError);
        }

        return updated;
      } catch (err) {
        console.error(`❌ [${updateId}] Profile update failed:`, err);
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
      const changePwdId = `change-pwd-${Date.now()}`;
      console.log(`🔑 [${changePwdId}] Starting password change process...`);

      setUpdating(true);
      setError(null);

      try {
        const res = await RIMS_API.put('/auth/change-password', passwordData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });

        console.log(`✅ [${changePwdId}] Password changed successfully`);

        if (user?.user_id) {
          try {
            console.log(`🔑 [${changePwdId}] Creating password change notification...`);
            await NotificationService.createNotification({
              userId: user.user_id,
              type: 'success',
              title: 'Password Changed',
              message: 'Your password has been successfully changed.',
              category: 'security',
              metadata: {
                change_time: new Date().toISOString(),
                activity_type: 'password_change',
                change_id: changePwdId,
              },
            });
            console.log(`✅ [${changePwdId}] Password change notification created`);
          } catch (notifError) {
            console.error(`❌ [${changePwdId}] Failed to create password change notification:`, notifError);
          }
        }

        return res.data;
      } catch (err) {
        console.error(`❌ [${changePwdId}] Password change failed:`, err);
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
    const resetId = `pwd-reset-${Date.now()}`;
    console.log(`🔐 [${resetId}] Requesting password reset for user: ${userID}`);

    setLoading(true);
    setError(null);

    try {
      const res = await RIMS_API.post('/auth/forgot-password', { userID });
      console.log(`✅ [${resetId}] Password reset request sent successfully`);
      return res.data;
    } catch (err) {
      console.error(` [${resetId}] Password reset request failed:`, err);
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

  const trackUserActivity = useCallback(
    async (activity: string, metadata?: any) => {
      if (!user?.user_id) {
        console.log('⚠️ Cannot track activity: no user ID');
        return;
      }

      const activityId = `activity-${Date.now()}`;
      console.log(`📊 [${activityId}] Tracking user activity:`, { activity, user_id: user.user_id });

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
            activity_id: activityId,
            ...metadata,
          },
        });
        console.log(`✅ [${activityId}] Activity tracked successfully`);
      } catch (error) {
        console.error(`❌ [${activityId}] Failed to track user activity:`, error);
      }
    },
    [user?.user_id]
  );

  const testLogoutNotification = useCallback(async () => {
    if (!user?.user_id || !user?.userID) {
      console.error('❌ No user logged in to test logout notification');
      return;
    }

    const testId = `test-${Date.now()}`;
    console.log(`🧪 [${testId}] Testing logout notification...`);
    await createLogoutNotification(user.user_id, user.userID);

    setTimeout(() => {
      console.log(`🔍 [${testId}] Checking notification store...`);
      const store = useNotificationStore.getState();
      const logoutNotifications = store.notifications.filter((n) => n.metadata?.activity_type === 'logout');
      console.log(`📊 [${testId}] Logout notifications in store:`, logoutNotifications.length);
      console.log(`📋 [${testId}] Logout notifications details:`, logoutNotifications);
    }, 1000);
  }, [user, createLogoutNotification]);

  return {
    user,
    loading,
    updating,
    error,
    login,
    register,
    logout,
    quickLogout, 
    fetchProfile,
    updateProfile,
    changePassword,
    requestPasswordReset,
    trackUserActivity,
    testLogoutNotification,
  };
};
