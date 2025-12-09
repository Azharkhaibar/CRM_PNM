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
  _syncCounter: number; // ✅ Debug counter

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
  const numericId = idStr.replace('temp-', '');

  if (idStr === 'NaN' || idStr === 'null' || idStr === 'undefined' || isNaN(Number(numericId))) {
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
      _syncCounter: 0, // ✅ Debug counter

      addNotification: (notification) => {
        const validId = validateNotificationId(notification.id);
        const validUserId = validateUserId(notification.userId);

        const newNotification: Notification = {
          ...notification,
          id: validId,
          userId: validUserId,
          timestamp: new Date().toISOString(),
          read: false,
        };

        set((state) => {
          const exists = state.notifications.find((n) => n.id === newNotification.id);
          if (exists) {
            console.log('⏭️ Notification already exists, skipping:', newNotification.id);
            return state;
          }

          console.log('➕ Adding notification:', {
            id: newNotification.id,
            title: newNotification.title,
            userId: newNotification.userId,
          });

          const newNotifications = [newNotification, ...state.notifications];
          const limitedNotifications = newNotifications.slice(0, 200);

          const unreadCount = limitedNotifications.filter((n: { read: boolean; }) => n.read === false).length;

          return {
            notifications: limitedNotifications,
            unreadCount,
            lastUpdated: new Date(),
          };
        });

        // ✅ REMOVE EVENT untuk sementara - ini bisa cause loop
        // setTimeout(() => {
        //   const event = new CustomEvent('notificationAdded', {
        //     detail: { notification: newNotification },
        //   });
        //   window.dispatchEvent(event);
        // }, 50);
      },

      markAsRead: (id: string) => {
        const validId = validateNotificationId(id);

        set((state) => {
          const updated = state.notifications.map((n) => (n.id === validId ? { ...n, read: true } : n));

          const newUnreadCount = updated.filter((n) => !n.read).length;

          // ✅ Skip update jika tidak ada perubahan
          if (state.unreadCount === newUnreadCount) {
            return state;
          }

          console.log('📖 Marking as read:', validId);

          return {
            notifications: updated,
            unreadCount: newUnreadCount,
            lastUpdated: new Date(),
          };
        });

        // ✅ REMOVE EVENT untuk sementara
        // setTimeout(() => {
        //   const event = new CustomEvent('notificationRead', {
        //     detail: { id: validId },
        //   });
        //   window.dispatchEvent(event);
        // }, 50);
      },

      markAllAsRead: () => {
        set((state) => {
          const hasUnread = state.notifications.some((n) => !n.read);
          if (!hasUnread) {
            return state;
          }

          console.log('📖 Marking all as read');

          return {
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
            lastUpdated: new Date(),
          };
        });

        // ✅ REMOVE EVENT untuk sementara
        // setTimeout(() => {
        //   const event = new CustomEvent('allNotificationsRead');
        //   window.dispatchEvent(event);
        // }, 50);
      },

      removeNotification: (id: string) => {
        const validId = validateNotificationId(id);

        set((state) => {
          const exists = state.notifications.find((n) => n.id === validId);
          if (!exists) {
            return state;
          }

          console.log('🗑️ Removing notification:', validId);

          const remaining = state.notifications.filter((n) => n.id !== validId);
          return {
            notifications: remaining,
            unreadCount: remaining.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });

        // ✅ REMOVE EVENT untuk sementara
        // setTimeout(() => {
        //   const event = new CustomEvent('notificationRemoved', { detail: { id: validId } });
        //   window.dispatchEvent(event);
        // }, 50);
      },

      clearAll: () => {
        console.log('🧹 Clearing all notifications');
        set({
          notifications: [],
          unreadCount: 0,
          lastUpdated: new Date(),
          _syncCounter: 0,
        });
      },

      getNotificationsByUser: (userId) => {
        return get().notifications.filter((n) => n.userId === userId || n.userId === 'broadcast');
      },

      getUnreadByUser: (userId: string) => {
        return get().notifications.filter((n) => (n.userId === userId || n.userId === 'broadcast') && !n.read).length;
      },

      recalcUnread: () => {
        const unread = get().notifications.filter((n) => !n.read).length;
        set((state) => {
          if (state.unreadCount === unread) return state;
          return { unreadCount: unread };
        });
      },

      markAllAsReadForUser: (userId: string) => {
        set((state) => {
          const hasUnreadForUser = state.notifications.some((n) => n.userId === userId && !n.read);
          if (!hasUnreadForUser) return state;

          const updated = state.notifications.map((n) => (n.userId === userId || n.userId === 'broadcast' ? {
            ...n, read: true
          }: n ));
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });
      },

      removeAllForUser: (userId: string) => {
        set((state) => {
          const hasNotificationsForUser = state.notifications.some((n) => n.userId === userId);
          if (!hasNotificationsForUser) return state;

          const remaining = state.notifications.filter((n) => !(n.userId === userId || n.userId === "broadcast"));
          return {
            notifications: remaining,
            unreadCount: remaining.filter((n) => !n.read).length,
            lastUpdated: new Date(),
          };
        });
      },

      updateNotification: (id, updates) => {
        const validId = validateNotificationId(id);

        set((state) => {
          const existing = state.notifications.find((n) => n.id === validId);
          if (!existing) return state;

          return {
            notifications: state.notifications.map((n) => (n.id === validId ? { ...n, ...updates } : n)),
            lastUpdated: new Date(),
          };
        });
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

          const removedCount = state.notifications.length - validNotifications.length;
          if (removedCount > 0) {
            console.log(`🧹 Cleaned up ${removedCount} expired notifications`);
            return {
              notifications: validNotifications,
              unreadCount: validNotifications.filter((n) => !n.read).length,
              lastUpdated: new Date(),
            };
          }
          return state;
        });
      },

      // ✅ PERBAIKAN KRITIS: Sync dengan protection
      syncWithBackendData: (backendNotifications: any[]) => {
        const state = get();
        const syncId = state._syncCounter + 1;

        console.log(`🔄 [SYNC-${syncId}] Starting sync:`, {
          backendCount: backendNotifications.length,
          currentCount: state.notifications.length,
          timestamp: new Date().toISOString(),
        });

        // ✅ CEK: Skip jika data backend kosong dan kita sudah punya data
        if (!backendNotifications || backendNotifications.length === 0) {
          console.log(`⏭️ [SYNC-${syncId}] Skip - no backend data but we have local data`);
          return;
        }

        // ✅ CEK: Skip jika data sama persis
        if (backendNotifications.length === 0 && state.notifications.length === 0) {
          console.log(`⏭️ [SYNC-${syncId}] Skip - no data at all`);
          return;
        }

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
          // Filter invalid notifications
          const validNewNotifications = convertedNotifications.filter((n) => !n.id.includes('NaN') && n.id !== 'null' && n.id !== 'undefined');

          // Cari notifications baru yang belum ada
          const existingIds = new Map(state.notifications.map((n) => [n.id, n]));
          const newNotifications = validNewNotifications.filter((n) => !existingIds.has(n.id));

          // ✅ CEK: Skip jika tidak ada notifications baru
          if (newNotifications.length === 0) {
            console.log(`⏭️ [SYNC-${syncId}] Skip - no new notifications to add`);
            return state;
          }

          console.log(`✅ [SYNC-${syncId}] Adding ${newNotifications.length} new notifications`);

          const mergedNotifications = [...state.notifications, ...validNewNotifications.filter(n => !existingIds.has(n.id))]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 200);

          return {
            notifications: mergedNotifications,
            unreadCount: mergedNotifications.filter((n) => !n.read).length,
            lastUpdated: new Date(),
            _syncCounter: syncId,
          };
        });

        // ✅ REMOVE EVENT untuk sementara
        // setTimeout(() => {
        //   const event = new CustomEvent('notificationsSynced', {
        //     detail: { count: convertedNotifications.length, syncId },
        //   });
        //   window.dispatchEvent(event);
        // }, 50);
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
      notifications: state.notifications,
      unreadCount: state.unreadCount,
      lastUpdated: state.lastUpdated,
      }),

      version: 5, 
      migrate: (persistedState: any, version: number) => {
        console.log(`🔄 Migrating notification store from version ${version} to 5`);
        if (version < 5) {
          const notifications = persistedState.notifications || [];
          const validNotifications = notifications.filter((n: any) => n.id && !n.id.includes('NaN') && n.id !== 'null' && n.id !== 'undefined');
          return {
            ...persistedState,
            notifications: validNotifications,
            unreadCount: validNotifications.filter((n: any) => !n.read).length,
            _syncCounter: 0,
          };
        }
        return persistedState;
      },
    }
  )
);

// ... notificationUtils tetap sama
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
