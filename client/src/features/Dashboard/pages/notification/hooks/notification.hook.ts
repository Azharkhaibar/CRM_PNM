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
  const getLoginLogoutNotifications = useCallback((notifications: Notification[]) => {
    return notifications.filter((n) => (n.category === 'security' || n.category === 'system') && (n.metadata?.activity_type === 'login' || n.metadata?.activity_type === 'logout' || n.metadata?.activity_type === 'user_status'));
  }, []);

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

  const syncNotifications = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Starting notification sync for user:', userId);

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
      if (pollingRef.current && userIdRef.current) {
        NotificationService.stopPolling(userIdRef.current);
      }
      pollingRef.current = null;
      userIdRef.current = null;
      return;
    }

    if (userIdRef.current !== userId && pollingRef.current && userIdRef.current) {
      NotificationService.stopPolling(userIdRef.current);
      pollingRef.current = null;
    }

    if (!pollingRef.current || userIdRef.current !== userId) {
      userIdRef.current = userId;
      syncNotifications(userId);
      pollingRef.current = NotificationService.startPolling(userId, 15000); // 15 detik

      console.log('🔔 Started notification polling for user:', userId);
    }

    return () => {
      if (pollingRef.current && userIdRef.current) {
        NotificationService.stopPolling(userIdRef.current);
        pollingRef.current = null;
        userIdRef.current = null;
      }
    };
  }, [user?.user_id, syncNotifications]);
  const allNotificationsForUser = useMemo(() => {
    if (!user?.user_id) return [];
    return getAllNotificationsForUser(user.user_id.toString());
  }, [notifications, user?.user_id, getAllNotificationsForUser]);

  const totalUnreadCount = useMemo(() => {
    if (!user?.user_id) return 0;
    return getUnreadByUser(user.user_id.toString());
  }, [notifications, user?.user_id, getUnreadByUser]);

  const loginLogoutNotifications = useMemo(() => getLoginLogoutNotifications(allNotificationsForUser), [allNotificationsForUser, getLoginLogoutNotifications]);

  const activityStats = useMemo(() => getActivityStats(allNotificationsForUser), [allNotificationsForUser, getActivityStats]);

  const addUserNotification = useCallback(
    async (notificationData: NotificationInput) => {
      if (!user?.user_id) return null;

      try {
        await NotificationService.createNotification({
          userId: user.user_id,
          ...notificationData,
        });

        return addNotification({
          ...notificationData,
          userId: user.user_id.toString(),
        });
      } catch (err) {
        console.error('Failed to create notification:', err);
        return addNotification({
          ...notificationData,
          userId: user.user_id.toString(),
        });
      }
    },
    [user?.user_id, addNotification]
  );

  const markAsReadWithSync = useCallback(
    async (id: string) => {
      try {
        await NotificationService.markAsRead(id);
      } catch (err) {
        console.error('Failed to mark as read on backend:', err);
      } finally {
        markAsRead(id);
      }
    },
    [markAsRead]
  );

  const removeNotificationWithSync = useCallback(
    async (id: string) => {
      try {
        await NotificationService.deleteNotification(id);
      } catch (err) {
        console.error('Failed to delete on backend:', err);
      } finally {
        removeNotification(id);
      }
    },
    [removeNotification]
  );

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

  const addSuccessNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any> | null) => addUserNotification({ type: 'success', title, message, category, metadata }), [addUserNotification]);

  const addErrorNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any> | null) => addUserNotification({ type: 'error', title, message, category, metadata }), [addUserNotification]);

  const addWarningNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any> | null) => addUserNotification({ type: 'warning', title, message, category, metadata }), [addUserNotification]);

  const addInfoNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any> | null) => addUserNotification({ type: 'info', title, message, category, metadata }), [addUserNotification]);

  const refreshNotifications = useCallback(async () => {
    if (user?.user_id) {
      await syncNotifications(user.user_id.toString());
    }
  }, [user?.user_id, syncNotifications]);

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
    notifications: allNotificationsForUser,
    unreadCount: totalUnreadCount,
    hasNotifications: allNotificationsForUser.length > 0,
    isLoading,
    error,
    loginLogoutNotifications,
    activityStats,
    addNotification: addUserNotification,
    markAsRead: markAsReadWithSync,
    removeNotification: removeNotificationWithSync,
    updateNotification,
    markAllAsRead: markAllAsReadForCurrentUser,
    removeAllNotifications: removeAllForCurrentUser,
    refreshNotifications,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
    stats: {
      total: allNotificationsForUser.length,
      unread: totalUnreadCount,
      read: allNotificationsForUser.length - totalUnreadCount,
    },
  };
};
