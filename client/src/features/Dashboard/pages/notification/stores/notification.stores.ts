
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  userId: string; 
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  category?: string;
  metadata?: Record<string, any> | null;
  action?: {
    label: string;
    onClick: () => void;
  };
  expires_at?: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  lastUpdated: Date;

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'> & { id?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadByUser: (userId: string) => number;
  recalcUnread: () => void;
  markAllAsReadForUser: (userId: string) => void;
  removeAllForUser: (userId: string) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  getNotificationsByCategory: (userId: string, category: string) => Notification[];
  getNotificationsByType: (userId: string, type: Notification['type']) => Notification[];
  getBroadcastNotifications: () => Notification[];
  getUserSpecificNotifications: (userId: string) => Notification[];
  getAllNotificationsForUser: (userId: string) => Notification[];
  cleanupExpiredNotifications: () => void;
  syncWithBackendData: (backendNotifications: any[]) => void;
}

const validateNotificationId = (id: string | number | undefined): string => {
  if (!id) {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  const idStr = id.toString();

  if (idStr === 'NaN' || idStr === 'null' || idStr === 'undefined' || isNaN(Number(idStr.replace('temp-', '')))) {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return idStr;
};

const validateUserId = (userId: string | number | null | undefined): string => {
  if (!userId || userId === 'null' || userId === 'undefined' || userId === 'NaN') {
    return 'broadcast';
  }

  const userIdStr = userId.toString();
  return userIdStr === 'null' || userIdStr === 'undefined' || userIdStr === 'NaN' ? 'broadcast' : userIdStr;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      lastUpdated: new Date(),

      addNotification: (notification) => {
        const validId = validateNotificationId(notification.id);

        const newNotification: Notification = {
          ...notification,
          id: validId,
          timestamp: new Date(),
          read: false,
        };

        set((state) => {
          const exists = state.notifications.find((n) => n.id === newNotification.id);
          if (exists) {
            console.log(' Notification already exists:', newNotification.id);
            return state;
          }

          console.log('➕ Adding notification:', {
            id: newNotification.id,
            title: newNotification.title,
            userId: newNotification.userId,
            type: newNotification.type,
          });

          const newNotifications = [newNotification, ...state.notifications];
          const limitedNotifications = newNotifications.slice(0, 200);

          const unreadCount = limitedNotifications.filter((n) => !n.read).length;

          return {
            notifications: limitedNotifications,
            unreadCount,
            lastUpdated: new Date(),
          };
        });

        setTimeout(() => {
          const event = new CustomEvent('notificationAdded', {
            detail: { notification: newNotification },
          });
          window.dispatchEvent(event);
        }, 50);
      },

      markAsRead: (id: string) => {
        const validId = validateNotificationId(id);
        if (validId.startsWith('temp-')) {
          console.warn('⚠️ Using temporary ID for markAsRead:', validId);
        }

        set((state) => {
          const updated = state.notifications.map((n) => (n.id === validId ? { ...n, read: true } : n));

          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });

        setTimeout(() => {
          const event = new CustomEvent('notificationRead', { detail: { id: validId } });
          window.dispatchEvent(event);
        }, 50);
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
          lastUpdated: new Date(),
        }));

        setTimeout(() => {
          const event = new CustomEvent('allNotificationsRead');
          window.dispatchEvent(event);
        }, 50);
      },

      removeNotification: (id: string) => {
        const validId = validateNotificationId(id);
        if (validId.startsWith('temp-')) {
          console.warn('⚠️ Using temporary ID for removeNotification:', validId);
        }

        set((state) => {
          const remaining = state.notifications.filter((n) => n.id !== validId);
          return {
            notifications: remaining,
            unreadCount: remaining.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });

        setTimeout(() => {
          const event = new CustomEvent('notificationRemoved', { detail: { id: validId } });
          window.dispatchEvent(event);
        }, 50);
      },

      clearAll: () =>
        set({
          notifications: [],
          unreadCount: 0,
          lastUpdated: new Date(),
        }),

      getNotificationsByUser: (userId: string) => {
        return get().notifications.filter((n) => n.userId === userId);
      },

      getUnreadByUser: (userId: string) => {
        return get().notifications.filter((n) => (n.userId === userId || n.userId === 'broadcast') && !n.read).length;
      },

      recalcUnread: () => {
        const unread = get().notifications.filter((n) => !n.read).length;
        set({ unreadCount: unread });
      },

      markAllAsReadForUser: (userId: string) => {
        set((state) => {
          const updated = state.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n));
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });
      },

      removeAllForUser: (userId: string) => {
        set((state) => {
          const remaining = state.notifications.filter((n) => n.userId !== userId);
          return {
            notifications: remaining,
            unreadCount: remaining.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });
      },

      updateNotification: (id, updates) => {
        const validId = validateNotificationId(id);

        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === validId ? { ...n, ...updates } : n)),
          lastUpdated: new Date(),
        }));
      },

      getNotificationsByCategory: (userId, category) => {
        return get().notifications.filter((n) => (n.userId === userId || n.userId === 'broadcast') && n.category === category);
      },

      getNotificationsByType: (userId, type) => {
        return get().notifications.filter((n) => (n.userId === userId || n.userId === 'broadcast') && n.type === type);
      },

      getBroadcastNotifications: () => {
        return get().notifications.filter((n) => n.userId === 'broadcast');
      },

      getUserSpecificNotifications: (userId: string) => {
        return get().notifications.filter((n) => n.userId === userId);
      },

      getAllNotificationsForUser: (userId: string) => {
        return get()
          .notifications.filter((n) => n.userId === userId || n.userId === 'broadcast')
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },

      cleanupExpiredNotifications: () => {
        const now = new Date();
        set((state) => {
          const validNotifications = state.notifications.filter((n) => {
            if (!n.expires_at) return true;
            return new Date(n.expires_at) > now;
          });

          console.log(`🧹 Cleaned up ${state.notifications.length - validNotifications.length} expired notifications`);

          return {
            notifications: validNotifications,
            unreadCount: validNotifications.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });
      },

      syncWithBackendData: (backendNotifications: any[]) => {
        const convertedNotifications: Notification[] = backendNotifications.map((backendNotif) => {
          const validId = validateNotificationId(backendNotif.notification_id || backendNotif.id);
          const validUserId = validateUserId(backendNotif.user_id);

          return {
            id: validId,
            userId: validUserId,
            type: backendNotif.type || 'info',
            title: backendNotif.title || 'No Title',
            message: backendNotif.message || 'No Message',
            read: Boolean(backendNotif.read),
            timestamp: new Date(backendNotif.created_at || backendNotif.timestamp || Date.now()),
            category: backendNotif.category || undefined,
            metadata: backendNotif.metadata || {},
            expires_at: backendNotif.expires_at ? new Date(backendNotif.expires_at) : undefined,
          };
        });

        set((state) => {
          const validNewNotifications = convertedNotifications.filter((n) => !n.id.includes('NaN') && n.id !== 'null' && n.id !== 'undefined');
          const existingIds = new Set(state.notifications.map((n) => n.id));
          const newNotifications = validNewNotifications.filter((n) => !existingIds.has(n.id));

          const mergedNotifications = [...newNotifications, ...state.notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 200);

          console.log(`🔄 Synced ${newNotifications.length} new notifications from backend`);

          return {
            notifications: mergedNotifications,
            unreadCount: mergedNotifications.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });

        setTimeout(() => {
          const event = new CustomEvent('notificationsSynced', {
            detail: { count: convertedNotifications.length },
          });
          window.dispatchEvent(event);
        }, 50);
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications.filter((n) => !n.id.includes('NaN') && n.id !== 'null' && n.id !== 'undefined'),
        unreadCount: state.unreadCount,
        lastUpdated: state.lastUpdated,
      }),
      version: 3, 
      migrate: (persistedState: any, version: number) => {
        if (version < 3) {
          const notifications = persistedState.notifications || [];
          const validNotifications = notifications.filter((n: any) => n.id && !n.id.includes('NaN') && n.id !== 'null' && n.id !== 'undefined');

          return {
            ...persistedState,
            notifications: validNotifications,
            unreadCount: validNotifications.filter((n: any) => !n.read).length,
          };
        }
        return persistedState;
      },
    }
  )
);

export const notificationUtils = {
  filterForUser: (notifications: Notification[], userId: string): Notification[] => {
    return notifications.filter((n) => n.userId === userId || n.userId === 'broadcast');
  },

  groupByDate: (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    return groups;
  },

  isExpired: (notification: Notification): boolean => {
    if (!notification.expires_at) return false;
    return new Date(notification.expires_at) < new Date();
  },

  createLoginNotification: (userId: string, username: string) => ({
    userId,
    type: 'success' as const,
    title: 'Login Successful',
    message: `Welcome back, ${username}! You have successfully logged in.`,
    category: 'security',
    metadata: {
      login_time: new Date().toISOString(),
      activity_type: 'login',
      user_id: userId,
      username: username,
    },
  }),

  createLogoutNotification: (userId: string, username: string) => ({
    userId,
    type: 'info' as const,
    title: 'Logout Successful',
    message: `You have successfully logged out. See you soon, ${username}!`,
    category: 'security',
    metadata: {
      logout_time: new Date().toISOString(),
      activity_type: 'logout',
      user_id: userId,
      username: username,
    },
  }),

  createUserStatusBroadcast: (userId: string, username: string, action: 'login' | 'logout') => ({
    userId: 'broadcast',
    type: 'info' as const,
    title: action === 'login' ? 'User Logged In' : 'User Logged Out',
    message: action === 'login' ? `User ${username} has logged into the system.` : `User ${username} has logged out from the system.`,
    category: 'system',
    metadata: {
      timestamp: new Date().toISOString(),
      activity_type: 'user_status',
      user_id: userId,
      username: username,
      action: action,
    },
  }),
};
