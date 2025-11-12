import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useNotificationStore, Notification } from '../stores/notification.stores';
import { NotificationService } from '../services/notification.services';
import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { NotificationInput } from './notification.hook';

interface UseUserNotificationsWithSyncReturn {
  notifications: Notification[];
  unreadCount: number;
  hasNotifications: boolean;
  isLoading: boolean;
  error: string | null;

  addNotification: (notification: NotificationInput) => Promise<Notification | null>;
  markAsRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  updateNotification: (id: string, updates: Partial<Notification>) => void;

  markAllAsRead: () => void;
  removeAllNotifications: () => void;

  markAllAsReadGlobal: () => void;
  removeAllNotificationsGlobal: () => void;

  refreshNotifications: () => Promise<void>;

  addSuccessNotification: (title: string, message: string, category?: string, metadata?: Record<string, any> | null) => Promise<Notification | null>;
  addErrorNotification: (title: string, message: string, category?: string, metadata?: Record<string, any> | null) => Promise<Notification | null>;
  addWarningNotification: (title: string, message: string, category?: string, metadata?: Record<string, any> | null) => Promise<Notification | null>;
  addInfoNotification: (title: string, message: string, category?: string, metadata?: Record<string, any> | null) => Promise<Notification | null>;

  stats: {
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
  };
}

export const useUserNotificationsWithSync = (): UseUserNotificationsWithSyncReturn => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);

  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeAllNotifications,
    markAllAsReadForUser,
    removeAllForUser,
    getNotificationsByUser,
    getUnreadByUser,
    updateNotification,
    getNotificationsByCategory,
    getNotificationsByType,
  } = useNotificationStore();

  // Memoized user notifications
  const userNotifications = useMemo(() => {
    if (!user?.user_id) return [];
    return getNotificationsByUser(user.user_id.toString());
  }, [notifications, user?.user_id, getNotificationsByUser]);

  const userUnreadCount = useMemo(() => {
    if (!user?.user_id) return 0;
    return getUnreadByUser(user.user_id.toString());
  }, [notifications, user?.user_id, getUnreadByUser]);

  // Sync with backend
  const syncWithBackend = useCallback(async () => {
    if (!user?.user_id) return;
    setIsLoading(true);
    setError(null);
    try {
      await NotificationService.syncWithBackend(user.user_id.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync notifications');
    } finally {
      setIsLoading(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (!user?.user_id) return;

    syncWithBackend();
    pollingRef.current = NotificationService.startPolling(user.user_id.toString(), 15000);

    return () => {
      if (pollingRef.current !== null) {
        NotificationService.stopPolling(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [user?.user_id, syncWithBackend]);

  const addUserNotification = useCallback(
    async (notification: NotificationInput) => {
      if (!user?.user_id) return null;
      const notificationData = { ...notification, userId: user.user_id.toString() };
      try {
        if (process.env.NODE_ENV === 'production') {
          const payload = { ...notificationData, userId: user.user_id, metadata: notificationData.metadata ?? undefined };
          await NotificationService.createNotification(payload);
        }
        return addNotification(notificationData);
      } catch {
        return addNotification(notificationData);
      }
    },
    [user?.user_id, addNotification]
  );

  const markAsReadWithSync = useCallback(
    async (id: string) => {
      try {
        if (process.env.NODE_ENV === 'production') {
          await NotificationService.markAsRead(id);
        }
        markAsRead(id);
      } catch {
        markAsRead(id);
      }
    },
    [markAsRead]
  );

  const removeNotificationWithSync = useCallback(
    async (id: string) => {
      try {
        if (process.env.NODE_ENV === 'production') {
          await NotificationService.deleteNotification(id);
        }
        removeNotification(id);
      } catch {
        removeNotification(id);
      }
    },
    [removeNotification]
  );

  const markAllAsReadForCurrentUser = useCallback(() => {
    if (!user?.user_id) return;
    markAllAsReadForUser(user.user_id.toString());
  }, [user?.user_id, markAllAsReadForUser]);

  const removeAllForCurrentUser = useCallback(() => {
    if (!user?.user_id) return;
    removeAllForUser(user.user_id.toString());
  }, [user?.user_id, removeAllForUser]);

  const getCurrentUserNotificationsByCategory = useCallback(
    (category: string) => {
      if (!user?.user_id) return [];
      return getNotificationsByCategory(user.user_id.toString(), category);
    },
    [user?.user_id, getNotificationsByCategory]
  );

  const getCurrentUserNotificationsByType = useCallback(
    (type: 'info' | 'success' | 'warning' | 'error') => {
      if (!user?.user_id) return [];
      return getNotificationsByType(user.user_id.toString(), type);
    },
    [user?.user_id, getNotificationsByType]
  );

  const addSuccessNotification = useCallback(
    (title: string, message: string, category = 'system', metadata: Record<string, any> | null = null) => addUserNotification({ type: 'success', title, message, category, metadata }),
    [addUserNotification]
  );

  const addErrorNotification = useCallback(
    (title: string, message: string, category = 'system', metadata: Record<string, any> | null = null) => addUserNotification({ type: 'error', title, message, category, metadata }),
    [addUserNotification]
  );

  const addWarningNotification = useCallback(
    (title: string, message: string, category = 'system', metadata: Record<string, any> | null = null) => addUserNotification({ type: 'warning', title, message, category, metadata }),
    [addUserNotification]
  );

  const addInfoNotification = useCallback(
    (title: string, message: string, category = 'system', metadata: Record<string, any> | null = null) => addUserNotification({ type: 'info', title, message, category, metadata }),
    [addUserNotification]
  );

  const stats = useMemo(() => {
    return {
      total: userNotifications.length,
      unread: userUnreadCount,
      read: userNotifications.length - userUnreadCount,
      byType: {
        info: getCurrentUserNotificationsByType('info').length,
        success: getCurrentUserNotificationsByType('success').length,
        warning: getCurrentUserNotificationsByType('warning').length,
        error: getCurrentUserNotificationsByType('error').length,
      },
      byCategory: userNotifications.reduce((acc, notif) => {
        const category = notif.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [userNotifications, userUnreadCount, getCurrentUserNotificationsByType]);

  return {
    notifications: userNotifications,
    unreadCount: userUnreadCount,
    hasNotifications: userNotifications.length > 0,
    isLoading,
    error,

    addNotification: addUserNotification,
    markAsRead: markAsReadWithSync,
    removeNotification: removeNotificationWithSync,
    updateNotification,

    markAllAsRead: markAllAsReadForCurrentUser,
    removeAllNotifications: removeAllForCurrentUser,

    markAllAsReadGlobal: markAllAsRead,
    removeAllNotificationsGlobal: removeAllNotifications,

    refreshNotifications: syncWithBackend,

    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,

    stats,
  };
};
