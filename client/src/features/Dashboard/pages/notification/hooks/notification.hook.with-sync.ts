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
  loginLogoutNotifications: Notification[];
  activityStats: {
    totalActivities: number;
    todayActivities: number;
    last7DaysActivities: number;
    loginActivities: number;
    logoutActivities: number;
    lastActivity: Date | null;
  };

  addNotification: (notification: NotificationInput) => Promise<Notification | null>;
  markAsRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  updateNotification: (id: string, updates: Partial<Notification>) => void;

  markAllAsRead: () => Promise<void>;
  removeAllNotifications: () => Promise<void>;

  markAllAsReadGlobal: () => void;
  removeAllNotificationsGlobal: () => void;

  refreshNotifications: () => Promise<void>;

  addSuccessNotification: (title: string, message: string, category?: string, metadata?: Record<string, any>) => Promise<Notification | null>;
  addErrorNotification: (title: string, message: string, category?: string, metadata?: Record<string, any>) => Promise<Notification | null>;
  addWarningNotification: (title: string, message: string, category?: string, metadata?: Record<string, any>) => Promise<Notification | null>;
  addInfoNotification: (title: string, message: string, category?: string, metadata?: Record<string, any>) => Promise<Notification | null>;

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

const isTemporaryId = (id: string): boolean => {
  return !id || id.startsWith('temp-') || isNaN(Number(id.replace('temp-', '')));
};

export const useUserNotificationsWithSync = (): UseUserNotificationsWithSyncReturn => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);
  const userIdRef = useRef<string | null>(null);
  const syncInProgressRef = useRef<boolean>(false);
  const lastSyncRef = useRef<number>(0);

  const { notifications, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll, getAllNotificationsForUser, getUnreadByUser, updateNotification, syncWithBackendData } = useNotificationStore();

  const userId = user?.user_id?.toString();
  const userNotifications = useMemo(() => {
    if (!userId) return [];
    return getAllNotificationsForUser(userId);
  }, [notifications, userId, getAllNotificationsForUser]); 

  const userUnreadCount = useMemo(() => {
    if (!userId) return 0;
    return getUnreadByUser(userId);
  }, [notifications, userId, getUnreadByUser]); 

 
  const loginLogoutNotifications = useMemo(() => {
    if (!userId) return [];

    return userNotifications
      .filter((notif) => {
        const activityType = notif.metadata?.activity_type;
        const action = notif.metadata?.action;
        const title = notif.title?.toLowerCase();
        const message = notif.message?.toLowerCase();
        const category = notif.category?.toLowerCase();

        const isLoginLogoutActivity =
          activityType === 'login' ||
          activityType === 'logout' ||
          action === 'login' ||
          action === 'logout' ||

          title?.includes('login') ||
          title?.includes('logout') ||
          title?.includes('sign in') ||
          title?.includes('sign out') ||
          message?.includes('login') ||
          message?.includes('logout') ||
          message?.includes('sign in') ||
          message?.includes('sign out') ||

          category === 'security' ||
          category === 'system' ||
          category === 'authentication' ||
          category === 'auth';

        console.log('🔍 Checking notification:', {
          id: notif.id,
          title: notif.title,
          category: notif.category,
          activityType,
          action,
          isLoginLogoutActivity,
        });

        return isLoginLogoutActivity;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [userNotifications]);

  const activityStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const todayActivities = loginLogoutNotifications.filter((notif) => new Date(notif.timestamp) >= today);
    const last7DaysActivities = loginLogoutNotifications.filter((notif) => new Date(notif.timestamp) >= sevenDaysAgo);

    const loginActivities = loginLogoutNotifications.filter((notif) => {
      const activityType = notif.metadata?.activity_type;
      const action = notif.metadata?.action;
      const title = notif.title?.toLowerCase();
      const message = notif.message?.toLowerCase();

      return activityType === 'login' || action === 'login' || title?.includes('login') || title?.includes('sign in') || message?.includes('login') || message?.includes('sign in');
    });

    const logoutActivities = loginLogoutNotifications.filter((notif) => {
      const activityType = notif.metadata?.activity_type;
      const action = notif.metadata?.action;
      const title = notif.title?.toLowerCase();
      const message = notif.message?.toLowerCase();

      return activityType === 'logout' || action === 'logout' || title?.includes('logout') || title?.includes('sign out') || message?.includes('logout') || message?.includes('sign out');
    });

    console.log('📊 Activity Stats:', {
      total: loginLogoutNotifications.length,
      login: loginActivities.length,
      logout: logoutActivities.length,
      today: todayActivities.length,
      last7Days: last7DaysActivities.length,
    });

    return {
      totalActivities: loginLogoutNotifications.length,
      todayActivities: todayActivities.length,
      last7DaysActivities: last7DaysActivities.length,
      loginActivities: loginActivities.length,
      logoutActivities: logoutActivities.length,
      lastActivity: loginLogoutNotifications[0]?.timestamp || null,
    };
  }, [loginLogoutNotifications]);

  // ✅ PERBAIKAN: Tambahkan useCallback dependency yang diperlukan
  const syncWithBackend = useCallback(async () => {
    if (!userId) return;

    // ✅ PROTECTION 1: Prevent concurrent sync
    if (syncInProgressRef.current) {
      console.log('⏭️ Sync already in progress, skipping');
      return;
    }

    // ✅ PROTECTION 2: Rate limiting (minimal 10 detik antara sync)
    const now = Date.now();
    if (now - lastSyncRef.current < 10000) {
      console.log('⏭️ Sync too soon, skipping');
      return;
    }

    syncInProgressRef.current = true;
    lastSyncRef.current = now;

    console.log('🔄 Starting sync for user:', userId);

    setIsLoading(true);
    setError(null);

    try {
      const result = await NotificationService.getAllNotifications(userId, {
        unreadOnly: false,
        limit: 100,
      });

      console.log('📦 Sync result:', {
        notificationCount: result.notifications.length,
        total: result.total,
        notifications: result.notifications.map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          metadata: n.metadata,
          userId: n.userId,
        })),
      });

      if (result.notifications.length > 0) {
        syncWithBackendData(result.notifications);
        console.log('✅ Sync completed successfully');
      } else {
        console.log('⏭️ No notifications to sync');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync notifications';
      setError(errorMessage);
      console.warn('❌ Sync failed:', errorMessage);
    } finally {
      setIsLoading(false);
      syncInProgressRef.current = false;
    }
  }, [userId, syncWithBackendData]);

  useEffect(() => {
    const currentUserId = user?.user_id?.toString();

    console.log('🎯 useEffect triggered, user:', currentUserId);

    if (pollingRef.current && userIdRef.current) {
      console.log('🧹 Cleaning up previous polling for:', userIdRef.current);
      NotificationService.stopPolling(userIdRef.current);
      pollingRef.current = null;
      userIdRef.current = null;
    }

    if (!currentUserId) {
      console.log('⏭️ No user ID, skipping setup');
      return;
    }

    userIdRef.current = currentUserId;

    console.log('🚀 Initial sync for user:', currentUserId);
    syncWithBackend();

    console.log('⏰ Setting up polling for user:', currentUserId);
    pollingRef.current = NotificationService.startPolling(currentUserId, 30000);

    return () => {
      console.log('🧹 useEffect cleanup for user:', userIdRef.current);
      if (pollingRef.current && userIdRef.current) {
        NotificationService.stopPolling(userIdRef.current);
        pollingRef.current = null;
        userIdRef.current = null;
      }
      syncInProgressRef.current = false;
    };
  }, [user?.user_id, syncWithBackend]);

  const addUserNotification = useCallback(
    async (notification: NotificationInput): Promise<Notification | null> => {
      if (!userId) return null;

      try {
        const backendPayload = {
          userId: parseInt(userId),
          type: notification.type,
          title: notification.title,
          message: notification.message,
          ...(notification.category && { category: notification.category }),
          ...(notification.metadata && { metadata: notification.metadata }),
        };

        const backendResult = await NotificationService.createNotification(backendPayload);

        return addNotification({
          ...notification,
          userId: userId,
          id: backendResult.notification_id.toString(),
        });
      } catch (err) {
        console.error('Failed to create backend notification. Skipping entirely:', err);
        return null;
      }
    },
    [userId, addNotification]
  );

  const markAsReadWithSync = useCallback(
    async (id: string): Promise<void> => {
      try {
        if (!isTemporaryId(id)) {
          await NotificationService.markAsRead(id);
        } else {
          console.log('📝 Marking temporary notification as read locally:', id);
        }
      } catch (err) {
        console.error('Failed to mark as read on backend:', err);
        if (!isTemporaryId(id)) {
          throw err;
        }
      } finally {
        markAsRead(id);
      }
    },
    [markAsRead]
  );

  const removeNotificationWithSync = useCallback(
    async (id: string): Promise<void> => {
      try {
        if (!isTemporaryId(id)) {
          await NotificationService.deleteNotification(id);
        } else {
          console.log('🗑️ Deleting temporary notification locally:', id);
        }
      } catch (err) {
        console.error('Failed to delete on backend:', err);
        if (!isTemporaryId(id)) {
          throw err;
        }
      } finally {
        removeNotification(id);
      }
    },
    [removeNotification]
  );

  const markAllAsReadForCurrentUser = useCallback(async (): Promise<void> => {
    if (!userId) return;

    try {
      await NotificationService.markAllAsRead(userId);
    } catch (err) {
      console.error('Failed to mark all as read on backend:', err);
    } finally {
      markAllAsRead();
    }
  }, [userId, markAllAsRead]);

  const removeAllForCurrentUser = useCallback(async (): Promise<void> => {
    if (!userId) return;

    try {
      await NotificationService.deleteAllUserNotifications(userId);
    } catch (err) {
      console.error('Failed to delete all on backend:', err);
    } finally {
      clearAll();
    }
  }, [userId, clearAll]);

  const addSuccessNotification = useCallback(
    (title: string, message: string, category = 'system', metadata?: Record<string, any>) =>
      addUserNotification({
        type: 'success',
        title,
        message,
        category,
        metadata,
      }),
    [addUserNotification]
  );

  const addErrorNotification = useCallback(
    (title: string, message: string, category = 'system', metadata?: Record<string, any>) =>
      addUserNotification({
        type: 'error',
        title,
        message,
        category,
        metadata,
      }),
    [addUserNotification]
  );

  const addWarningNotification = useCallback(
    (title: string, message: string, category = 'system', metadata?: Record<string, any>) =>
      addUserNotification({
        type: 'warning',
        title,
        message,
        category,
        metadata,
      }),
    [addUserNotification]
  );

  const addInfoNotification = useCallback(
    (title: string, message: string, category = 'system', metadata?: Record<string, any>) =>
      addUserNotification({
        type: 'info',
        title,
        message,
        category,
        metadata,
      }),
    [addUserNotification]
  );

  const stats = useMemo(() => {
    const byType = {
      info: userNotifications.filter((n) => n.type === 'info').length,
      success: userNotifications.filter((n) => n.type === 'success').length,
      warning: userNotifications.filter((n) => n.type === 'warning').length,
      error: userNotifications.filter((n) => n.type === 'error').length,
    };

    const byCategory = userNotifications.reduce((acc, notif) => {
      const category = notif.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: userNotifications.length,
      unread: userUnreadCount,
      read: userNotifications.length - userUnreadCount,
      byType,
      byCategory,
    };
  }, [userNotifications, userUnreadCount]);

  useEffect(() => {
    if (import.meta.env.DEV && userNotifications.length > 0) {
      console.log('📊 Notification Stats:', {
        user: userId,
        total: userNotifications.length,
        unread: userUnreadCount,
        loginLogout: loginLogoutNotifications.length,
        polling: !!pollingRef.current,
        syncInProgress: syncInProgressRef.current,
      });
    }
  }, [userNotifications.length, userUnreadCount, userId, loginLogoutNotifications.length]);

  useEffect(() => {
    if (import.meta.env.DEV && loginLogoutNotifications.length > 0) {
      console.log('🔐 Login/Logout Notifications:', {
        total: loginLogoutNotifications.length,
        login: activityStats.loginActivities,
        logout: activityStats.logoutActivities,
        notifications: loginLogoutNotifications.map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          metadata: n.metadata,
          timestamp: n.timestamp,
        })),
      });
    }
  }, [loginLogoutNotifications, activityStats]);

  return {

    notifications: userNotifications,
    unreadCount: userUnreadCount,
    hasNotifications: userNotifications.length > 0,
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

    markAllAsReadGlobal: markAllAsRead,
    removeAllNotificationsGlobal: clearAll,

    refreshNotifications: syncWithBackend,

    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,

    stats,
  };
};
