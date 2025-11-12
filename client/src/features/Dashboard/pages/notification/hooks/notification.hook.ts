// hooks/notification.hook.ts
import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useNotificationStore, Notification } from '../stores/notification.stores';
import { NotificationService } from '../services/notification.services';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

export interface NotificationInput {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category?: string;
  metadata?: Record<string, any> | null;
  action?: { label: string; onClick: () => void };
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: { info: number; success: number; warning: number; error: number };
  byCategory: Record<string, number>;
}

export const useUserNotifications = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);
  const userIdRef = useRef<string | null>(null);

  const { notifications, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll, getAllNotificationsForUser, getUnreadByUser, updateNotification, syncWithBackendData } = useNotificationStore();

  // Filter untuk aktivitas login/logout user
  const getLoginLogoutNotifications = useCallback((notifications: Notification[]) => {
    return notifications.filter((n) => (n.category === 'security' || n.category === 'system') && (n.metadata?.activity_type === 'login' || n.metadata?.activity_type === 'logout' || n.metadata?.activity_type === 'user_status'));
  }, []);

  // Compute activity stats
  const getActivityStats = useCallback(
    (notifications: Notification[]) => {
      const loginLogoutNotifs = getLoginLogoutNotifications(notifications);

      const today = new Date().toDateString();
      const todayActivities = loginLogoutNotifs.filter((n) => new Date(n.timestamp).toDateString() === today);

      const last7DaysActivities = loginLogoutNotifs.filter((n) => {
        const notifDate = new Date(n.timestamp);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return notifDate >= sevenDaysAgo;
      });

      const loginActivities = loginLogoutNotifs.filter((n) => n.metadata?.activity_type === 'login' || n.metadata?.action === 'login');
      const logoutActivities = loginLogoutNotifs.filter((n) => n.metadata?.activity_type === 'logout' || n.metadata?.action === 'logout');

      return {
        totalActivities: loginLogoutNotifs.length,
        todayActivities: todayActivities.length,
        last7DaysActivities: last7DaysActivities.length,
        loginActivities: loginActivities.length,
        logoutActivities: logoutActivities.length,
        lastActivity: loginLogoutNotifs[0]?.timestamp || null,
      };
    },
    [getLoginLogoutNotifications]
  );

  // Sync notifications dengan backend
  const syncNotifications = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Starting notification sync for user:', userId);

        // Gunakan getUserNotifications saja untuk menghindari error broadcast
        const result = await NotificationService.getUserNotifications(userId, {
          unreadOnly: false,
          limit: 50,
        });

        // Sync data ke store
        syncWithBackendData(result.notifications);

        console.log('✅ Notifications synced successfully:', {
          total: result.notifications.length,
          userSpecific: result.notifications.filter((n) => n.userId === userId).length,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to sync notifications';
        setError(errorMessage);
        console.warn('⚠️ Sync completed with warnings:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [syncWithBackendData]
  );

  // Setup polling dan sync
  useEffect(() => {
    const userId = user?.user_id?.toString();

    if (!userId) {
      // Cleanup jika user logout
      if (pollingRef.current && userIdRef.current) {
        NotificationService.stopPolling(userIdRef.current);
      }
      pollingRef.current = null;
      userIdRef.current = null;
      return;
    }

    // Jika user berubah, stop polling sebelumnya
    if (userIdRef.current !== userId && pollingRef.current && userIdRef.current) {
      NotificationService.stopPolling(userIdRef.current);
      pollingRef.current = null;
    }

    // Start polling untuk user baru
    if (!pollingRef.current || userIdRef.current !== userId) {
      userIdRef.current = userId;

      // Initial sync
      syncNotifications(userId);

      // Start polling dengan interval yang reasonable
      pollingRef.current = NotificationService.startPolling(userId, 15000); // 15 detik

      console.log('🔔 Started notification polling for user:', userId);
    }

    return () => {
      // Cleanup on unmount
      if (pollingRef.current && userIdRef.current) {
        NotificationService.stopPolling(userIdRef.current);
        pollingRef.current = null;
        userIdRef.current = null;
      }
    };
  }, [user?.user_id, syncNotifications]);

  // Get all notifications untuk user (termasuk yang broadcast jika ada di store)
  const allNotificationsForUser = useMemo(() => {
    if (!user?.user_id) return [];
    return getAllNotificationsForUser(user.user_id.toString());
  }, [notifications, user?.user_id, getAllNotificationsForUser]);

  // Hitung unread count
  const totalUnreadCount = useMemo(() => {
    if (!user?.user_id) return 0;
    return getUnreadByUser(user.user_id.toString());
  }, [notifications, user?.user_id, getUnreadByUser]);

  const loginLogoutNotifications = useMemo(() => getLoginLogoutNotifications(allNotificationsForUser), [allNotificationsForUser, getLoginLogoutNotifications]);

  const activityStats = useMemo(() => getActivityStats(allNotificationsForUser), [allNotificationsForUser, getActivityStats]);

  // Tambahkan notifikasi baru
  const addUserNotification = useCallback(
    async (notificationData: NotificationInput) => {
      if (!user?.user_id) return null;

      try {
        // Kirim ke backend
        await NotificationService.createNotification({
          userId: user.user_id,
          ...notificationData,
        });

        // Tambahkan ke store lokal
        return addNotification({
          ...notificationData,
          userId: user.user_id.toString(),
        });
      } catch (err) {
        console.error('Failed to create notification:', err);
        // Fallback: tambahkan ke store lokal saja
        return addNotification({
          ...notificationData,
          userId: user.user_id.toString(),
        });
      }
    },
    [user?.user_id, addNotification]
  );

  // Mark as read dengan sync ke backend
  const markAsReadWithSync = useCallback(
    async (id: string) => {
      try {
        await NotificationService.markAsRead(id);
      } catch (err) {
        console.error('Failed to mark as read on backend:', err);
        // Continue dengan update lokal meskipun backend gagal
      } finally {
        markAsRead(id);
      }
    },
    [markAsRead]
  );

  // Remove notification dengan sync ke backend
  const removeNotificationWithSync = useCallback(
    async (id: string) => {
      try {
        await NotificationService.deleteNotification(id);
      } catch (err) {
        console.error('Failed to delete on backend:', err);
        // Continue dengan delete lokal meskipun backend gagal
      } finally {
        removeNotification(id);
      }
    },
    [removeNotification]
  );

  // Mark all as read untuk user current
  const markAllAsReadForCurrentUser = useCallback(async () => {
    if (!user?.user_id) return;

    try {
      await NotificationService.markAllAsRead(user.user_id.toString());
    } catch (err) {
      console.error('Failed to mark all as read on backend:', err);
    } finally {
      markAllAsRead();
    }
  }, [user?.user_id, markAllAsRead]);

  // Remove all notifications untuk user current
  const removeAllForCurrentUser = useCallback(async () => {
    if (!user?.user_id) return;

    try {
      await NotificationService.deleteAllUserNotifications(user.user_id.toString());
    } catch (err) {
      console.error('Failed to delete all on backend:', err);
    } finally {
      clearAll();
    }
  }, [user?.user_id, clearAll]);

  // Helper methods untuk notifikasi cepat
  const addSuccessNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any> | null) => addUserNotification({ type: 'success', title, message, category, metadata }), [addUserNotification]);

  const addErrorNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any> | null) => addUserNotification({ type: 'error', title, message, category, metadata }), [addUserNotification]);

  const addWarningNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any> | null) => addUserNotification({ type: 'warning', title, message, category, metadata }), [addUserNotification]);

  const addInfoNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any> | null) => addUserNotification({ type: 'info', title, message, category, metadata }), [addUserNotification]);

  // Refresh notifications manual
  const refreshNotifications = useCallback(async () => {
    if (user?.user_id) {
      await syncNotifications(user.user_id.toString());
    }
  }, [user?.user_id, syncNotifications]);

  // Debug info untuk monitoring
  useEffect(() => {
    if (allNotificationsForUser.length > 0 && process.env.NODE_ENV === 'development') {
      console.log('📊 Notification Summary:', {
        total: allNotificationsForUser.length,
        unread: totalUnreadCount,
        loginLogout: loginLogoutNotifications.length,
        recent: allNotificationsForUser.slice(0, 3).map((n) => ({
          title: n.title,
          userId: n.userId,
          metadata: n.metadata,
        })),
      });
    }
  }, [allNotificationsForUser, totalUnreadCount, loginLogoutNotifications.length]);

  return {
    // Data
    notifications: allNotificationsForUser,
    unreadCount: totalUnreadCount,
    hasNotifications: allNotificationsForUser.length > 0,
    isLoading,
    error,
    loginLogoutNotifications,
    activityStats,

    // Actions
    addNotification: addUserNotification,
    markAsRead: markAsReadWithSync,
    removeNotification: removeNotificationWithSync,
    updateNotification,
    markAllAsRead: markAllAsReadForCurrentUser,
    removeAllNotifications: removeAllForCurrentUser,
    refreshNotifications,

    // Quick actions
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,

    // Stats
    stats: {
      total: allNotificationsForUser.length,
      unread: totalUnreadCount,
      read: allNotificationsForUser.length - totalUnreadCount,
    },
  };
};
