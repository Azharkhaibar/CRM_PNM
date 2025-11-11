import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useNotificationStore, Notification } from '../stores/notification.stores';
import { NotificationService } from '../services/notification.services';
import { useCallback, useMemo, useEffect, useState } from 'react';

export interface NotificationInput {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category?: string;
  metadata?: Record<string, any> | null;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: {
    info: number;
    success: number;
    warning: number;
    error: number;
  };
  byCategory: Record<string, number>;
}

interface UseUserNotificationsReturn {
  // Data
  notifications: Notification[];
  unreadCount: number;
  hasNotifications: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  addNotification: (notification: NotificationInput) => Promise<Notification | null>;
  markAsRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  updateNotification: (id: string, updates: Partial<Notification>) => void;

  // Bulk actions
  markAllAsRead: () => Promise<void>;
  removeAllNotifications: () => Promise<void>;

  // Global actions (admin)
  markAllAsReadGlobal: () => void;
  removeAllNotificationsGlobal: () => void;

  // Sync
  refreshNotifications: () => Promise<void>;

  // Convenience methods
  addSuccessNotification: (title: string, message: string, category?: string, metadata?: Record<string, any> | null) => Promise<Notification | null>;
  addErrorNotification: (title: string, message: string, category?: string, metadata?: Record<string, any> | null) => Promise<Notification | null>;
  addWarningNotification: (title: string, message: string, category?: string, metadata?: Record<string, any> | null) => Promise<Notification | null>;
  addInfoNotification: (title: string, message: string, category?: string, metadata?: Record<string, any> | null) => Promise<Notification | null>;

  // Stats
  stats: NotificationStats;

  // Filter methods
  getNotificationsByCategory: (category: string) => Notification[];
  getNotificationsByType: (type: 'info' | 'success' | 'warning' | 'error') => Notification[];
}

export const useUserNotifications = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);

  const { notifications, addNotification, markAsRead, markAllAsRead, removeNotification, removeAllNotifications, markAllAsReadForUser, removeAllForUser, getNotificationsByUser, getUnreadByUser, updateNotification } = useNotificationStore();

  // Function untuk mendapatkan login/logout notifications
  const getLoginLogoutNotifications = useCallback((notifications: Notification[]) => {
    return notifications.filter((notif) => notif.category === 'security' && notif.metadata?.activity_type === 'login');
  }, []);

  // Function untuk mendapatkan activity statistics dengan default values
  const getActivityStats = useCallback(
    (notifications: Notification[]) => {
      const loginLogoutNotifs = getLoginLogoutNotifications(notifications);

      const today = new Date().toDateString();
      const todayLogins = loginLogoutNotifs.filter((notif) => new Date(notif.timestamp).toDateString() === today);

      const last7DaysLogins = loginLogoutNotifs.filter((notif) => {
        const notifDate = new Date(notif.timestamp);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return notifDate >= sevenDaysAgo;
      });

      return {
        totalLogins: loginLogoutNotifs.length,
        todayLogins: todayLogins.length,
        last7DaysLogins: last7DaysLogins.length,
        lastLogin: loginLogoutNotifs[0]?.timestamp || null,
      };
    },
    [getLoginLogoutNotifications]
  );

  // Auto-sync dengan backend saat user login
  useEffect(() => {
    if (user?.user_id) {
      console.log('🔄 Starting notification system for user:', user.user_id);
      syncWithBackend();

      // Start polling for real-time updates (setiap 15 detik)
      const intervalId = NotificationService.startPolling(user.user_id.toString(), 15000);
      setPollingIntervalId(intervalId);

      return () => {
        if (intervalId) {
          NotificationService.stopPolling(intervalId);
        }
      };
    }
  }, [user?.user_id]);

  const syncWithBackend = useCallback(async () => {
    if (!user?.user_id) return;

    setIsLoading(true);
    setError(null);

    try {
      await NotificationService.syncWithBackend(user.user_id.toString());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync notifications';
      setError(errorMessage);
      console.warn('Sync failed, using local data:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?.user_id]);

  const userNotifications = useMemo(() => {
    if (!user?.user_id) return [];
    return getNotificationsByUser(user.user_id.toString());
  }, [notifications, user?.user_id, getNotificationsByUser]);

  const userUnreadCount = useMemo(() => {
    if (!user?.user_id) return 0;
    return getUnreadByUser(user.user_id.toString());
  }, [notifications, user?.user_id, getUnreadByUser]);

  // Login/logout specific notifications
  const loginLogoutNotifications = useMemo(() => {
    return getLoginLogoutNotifications(userNotifications);
  }, [userNotifications, getLoginLogoutNotifications]);

  // Activity statistics dengan default values
  const activityStats = useMemo(() => {
    return getActivityStats(userNotifications);
  }, [userNotifications, getActivityStats]);

  // Default activity stats untuk menghindari undefined
  const safeActivityStats = useMemo(() => {
    return {
      totalLogins: activityStats?.totalLogins || 0,
      todayLogins: activityStats?.todayLogins || 0,
      last7DaysLogins: activityStats?.last7DaysLogins || 0,
      lastLogin: activityStats?.lastLogin || null,
    };
  }, [activityStats]);

  const addUserNotification = useCallback(
    async (notificationData: any) => {
      if (!user?.user_id) {
        console.warn('Cannot add notification: No user ID');
        return null;
      }

      try {
        // Coba sync dengan backend
        await NotificationService.createNotification({
          userId: user.user_id,
          ...notificationData,
        });

        // Tambahkan ke local store
        return addNotification({
          ...notificationData,
          userId: user.user_id.toString(),
        });
      } catch (err) {
        console.warn('Failed to add notification to backend, using local store only:', err);
        // Fallback: tambahkan ke local store saja
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
        // Coba sync dengan backend
        await NotificationService.markAsRead(id);

        // Update local store
        markAsRead(id);
      } catch (err) {
        console.warn('Failed to mark as read on backend, using local store only:', err);
        markAsRead(id);
      }
    },
    [markAsRead]
  );

  const removeNotificationWithSync = useCallback(
    async (id: string) => {
      try {
        // Coba sync dengan backend
        await NotificationService.deleteNotification(id);

        // Update local store
        removeNotification(id);
      } catch (err) {
        console.warn('Failed to delete notification on backend, using local store only:', err);
        removeNotification(id);
      }
    },
    [removeNotification]
  );

  const markAllAsReadForCurrentUser = useCallback(async () => {
    if (!user?.user_id) {
      console.warn('Cannot mark as read: No user ID');
      return;
    }

    try {
      // Coba sync dengan backend
      await NotificationService.markAllAsRead(user.user_id.toString());

      markAllAsReadForUser(user.user_id.toString());
    } catch (err) {
      console.warn('Failed to mark all as read on backend, using local store only:', err);
      markAllAsReadForUser(user.user_id.toString());
    }
  }, [user?.user_id, markAllAsReadForUser]);

  const removeAllForCurrentUser = useCallback(async () => {
    if (!user?.user_id) {
      console.warn('Cannot remove notifications: No user ID');
      return;
    }

    try {
      await NotificationService.deleteAllUserNotifications(user.user_id.toString());

      removeAllForUser(user.user_id.toString());
    } catch (err) {
      console.warn('Failed to delete all notifications on backend, using local store only:', err);
      removeAllForUser(user.user_id.toString());
    }
  }, [user?.user_id, removeAllForUser]);

  const addSuccessNotification = useCallback(
    (title: string, message: string, category: string = 'system', metadata: any = null) => {
      return addUserNotification({
        type: 'success',
        title,
        message,
        category,
        metadata,
      });
    },
    [addUserNotification]
  );

  const addErrorNotification = useCallback(
    (title: string, message: string, category: string = 'system', metadata: any = null) => {
      return addUserNotification({
        type: 'error',
        title,
        message,
        category,
        metadata,
      });
    },
    [addUserNotification]
  );

  const addWarningNotification = useCallback(
    (title: string, message: string, category: string = 'system', metadata: any = null) => {
      return addUserNotification({
        type: 'warning',
        title,
        message,
        category,
        metadata,
      });
    },
    [addUserNotification]
  );

  const addInfoNotification = useCallback(
    (title: string, message: string, category: string = 'system', metadata: any = null) => {
      return addUserNotification({
        type: 'info',
        title,
        message,
        category,
        metadata,
      });
    },
    [addUserNotification]
  );

  // Manual refresh
  const refreshNotifications = useCallback(async () => {
    await syncWithBackend();
  }, [syncWithBackend]);

  return {
    // Data
    notifications: userNotifications,
    unreadCount: userUnreadCount,
    hasNotifications: userNotifications.length > 0,
    isLoading,
    error,

    // Login/Logout specific data
    loginLogoutNotifications,
    activityStats: safeActivityStats, // Gunakan safeActivityStats yang sudah ada default values

    // Actions
    addNotification: addUserNotification,
    markAsRead: markAsReadWithSync,
    removeNotification: removeNotificationWithSync,
    updateNotification,

    // Bulk actions
    markAllAsRead: markAllAsReadForCurrentUser,
    removeAllNotifications: removeAllForCurrentUser,

    // Sync
    refreshNotifications,

    // Convenience methods
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,

    // Stats
    stats: {
      total: userNotifications.length,
      unread: userUnreadCount,
      read: userNotifications.length - userUnreadCount,
      ...safeActivityStats,
    },
  };
};
