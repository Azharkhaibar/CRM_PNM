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

export const useUserNotifications = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);
  const userIdRef = useRef<string | null>(null);

  const { notifications, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll, getAllNotificationsForUser, getUnreadByUser, updateNotification, syncWithBackendData } = useNotificationStore();

  const userId = user?.user_id?.toString();

  const getLoginLogoutNotifications = useCallback((notifications: Notification[]) => {
    return notifications.filter((n) => (n.category === 'security' || n.category === 'system') && (n.metadata?.activity_type === 'login' || n.metadata?.activity_type === 'logout' || n.metadata?.activity_type === 'user_status'));
  }, []);

  const getActivityStats = useCallback(
    (notifications: Notification[]) => {
      const loginLogoutNotifs = getLoginLogoutNotifications(notifications);
      const now = new Date();

      const todayActivities = loginLogoutNotifs.filter((n) => {
        const notifDate = new Date(n.timestamp);
        return notifDate.toDateString() === now.toDateString();
      });

      const last7DaysActivities = loginLogoutNotifs.filter((n) => {
        const notifDate = new Date(n.timestamp);
        const sevenDaysAgo = new Date(now);
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
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Starting notification sync for user:', userId);

        const result = await NotificationService.getAllNotifications(userId, {
          unreadOnly: false,
          limit: 100,
        });

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

  useEffect(() => {
    const currentUserId = user?.user_id?.toString();

    if (pollingRef.current && userIdRef.current) {
      NotificationService.stopPolling(userIdRef.current);
      pollingRef.current = null;
      userIdRef.current = null;
    }

    if (!currentUserId) {
      return;
    }

    userIdRef.current = currentUserId;

    syncNotifications(currentUserId);

    pollingRef.current = NotificationService.startPolling(currentUserId, 15000);

    console.log('🔔 Started notification polling for user:', currentUserId);

    return () => {
      if (pollingRef.current && userIdRef.current) {
        NotificationService.stopPolling(userIdRef.current);
        pollingRef.current = null;
        userIdRef.current = null;
      }
    };
  }, [user?.user_id, syncNotifications]);

  const allNotificationsForUser = useMemo(() => {
    return userId ? getAllNotificationsForUser(userId) : [];
  }, [notifications, userId, getAllNotificationsForUser]);

  const totalUnreadCount = useMemo(() => {
    return userId ? getUnreadByUser(userId) : 0;
  }, [notifications, userId, getUnreadByUser]);

  const loginLogoutNotifications = useMemo(() => getLoginLogoutNotifications(allNotificationsForUser), [allNotificationsForUser, getLoginLogoutNotifications]);

  const activityStats = useMemo(() => getActivityStats(allNotificationsForUser), [allNotificationsForUser, getActivityStats]);

  const createNotification = useCallback(
    async (type: NotificationInput['type'], title: string, message: string, category?: string, metadata?: Record<string, any>) => {
      if (!userId) return null;

      const notificationData = {
        userId: parseInt(userId),
        type,
        title,
        message,
        ...(category && { category }),
        ...(metadata && { metadata }),
      };

      try {
        await NotificationService.createNotification(notificationData);
      } catch (err) {
        console.error('Failed to create backend notification:', err);
        addNotification({
          ...notificationData,
          userId: userId,
        });
      }
    },
    [userId, addNotification]
  );

  const addSuccessNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any>) => createNotification('success', title, message, category, metadata), [createNotification]);

  const addErrorNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any>) => createNotification('error', title, message, category, metadata), [createNotification]);

  const addWarningNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any>) => createNotification('warning', title, message, category, metadata), [createNotification]);

  const addInfoNotification = useCallback((title: string, message: string, category?: string, metadata?: Record<string, any>) => createNotification('info', title, message, category, metadata), [createNotification]);

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
    if (!userId) return;

    try {
      await NotificationService.markAllAsRead(userId);
    } catch (err) {
      console.error('Failed to mark all as read on backend:', err);
    } finally {
      markAllAsRead();
    }
  }, [userId, markAllAsRead]);

  const refreshNotifications = useCallback(async () => {
    if (userId) {
      await syncNotifications(userId);
    }
  }, [userId, syncNotifications]);

  useEffect(() => {
    if (import.meta.env.DEV && allNotificationsForUser.length > 0) {
      console.log('📊 Notification Stats:', {
        total: allNotificationsForUser.length,
        unread: totalUnreadCount,
        loginLogout: loginLogoutNotifications.length,
      });
    }
  }, [allNotificationsForUser.length, totalUnreadCount, loginLogoutNotifications.length]);

  return {
    notifications: allNotificationsForUser,
    unreadCount: totalUnreadCount,
    hasNotifications: allNotificationsForUser.length > 0,
    isLoading,
    error,
    loginLogoutNotifications,
    activityStats,

    addNotification: createNotification,
    markAsRead: markAsReadWithSync,
    removeNotification: removeNotificationWithSync,
    updateNotification,
    markAllAsRead: markAllAsReadForCurrentUser,
    removeAllNotifications: clearAll,
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
