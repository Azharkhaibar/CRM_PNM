// notification.stores.ts - PRODUCTION FIXED VERSION
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BackendNotification {
  notification_id: number;
  user_id: number | null;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  read: boolean;
  metadata: Record<string, any> | null;
  category: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
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
  _syncCounter: number;
  isLoading: boolean;

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'> & { id?: string; read?: boolean }) => Notification;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;

  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadByUser: (userId: string) => number;
  markAllAsReadForUser: (userId: string) => void;
  removeAllForUser: (userId: string) => void;

  getNotificationsByCategory: (userId: string, category: string) => Notification[];
  getNotificationsByType: (userId: string, type: Notification['type']) => Notification[];
  getBroadcastNotifications: () => Notification[];
  getUserSpecificNotifications: (userId: string) => Notification[];
  getAllNotificationsForUser: (userId: string) => Notification[];
  getRecentNotifications: (userId: string, limit?: number) => Notification[];

  recalcUnread: () => void;
  cleanupExpiredNotifications: () => void;
  syncWithBackendData: (backendNotifications: BackendNotification[], fullSync?: boolean) => void;

  setLoading: (loading: boolean) => void;
  mergeWithBackend: (backendNotifications: BackendNotification[]) => Notification[];
  findNotificationById: (id: string) => Notification | undefined;
  hasUnreadNotifications: (userId: string) => boolean;
}

const validateNotificationId = (id: string | number | undefined): string => {
  if (!id || id.toString().trim() === '') {
    return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return id.toString();
};

const validateUserId = (userId: string | number | null | undefined): string => {
  const userIdStr = userId?.toString()?.trim();
  if (!userIdStr || userIdStr === 'null' || userIdStr === 'undefined' || userIdStr === 'NaN') {
    return 'broadcast';
  }
  return userIdStr;
};

const ensureDate = (value: any): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date();
};

const convertFromBackend = (backendNotif: BackendNotification): Notification => {
  const userId = validateUserId(backendNotif.user_id);
  const isBroadcast = userId === 'broadcast';

  return {
    id: validateNotificationId(backendNotif.notification_id),
    userId,
    type: backendNotif.type,
    title: backendNotif.title,
    message: backendNotif.message,
    read: isBroadcast ? true : backendNotif.read,
    category: backendNotif.category || undefined,
    metadata: backendNotif.metadata || {},
    timestamp: ensureDate(backendNotif.created_at),
    expires_at: backendNotif.expires_at ? ensureDate(backendNotif.expires_at) : undefined,
  };
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      lastUpdated: new Date(),
      _syncCounter: 0,
      isLoading: false,

      addNotification: (notificationData) => {
        const validId = validateNotificationId(notificationData.id);
        const validUserId = validateUserId(notificationData.userId);
        const isBroadcast = validUserId === 'broadcast';

        const newNotification: Notification = {
          ...notificationData,
          id: validId,
          userId: validUserId,
          timestamp: notificationData.timestamp instanceof Date ? notificationData.timestamp : new Date(notificationData.timestamp || Date.now()),
          read: isBroadcast ? true : notificationData.read !== undefined ? notificationData.read : false,
        };

        set((state) => {
          const exists = state.notifications.find((n) => n.id === newNotification.id);
          if (exists) {
            const updatedNotifications = state.notifications.map((n) => (n.id === newNotification.id ? { ...n, ...newNotification } : n));

            const unreadCount = updatedNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

            return {
              notifications: updatedNotifications,
              unreadCount,
              lastUpdated: new Date(),
            };
          }

          const newNotifications = [newNotification, ...state.notifications].slice(0, 500);
          const unreadCount = newNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: newNotifications,
            unreadCount,
            lastUpdated: new Date(),
          };
        });

        return newNotification;
      },

      markAsRead: (id: string) => {
        const validId = validateNotificationId(id);

        set((state) => {
          const notification = state.notifications.find((n) => n.id === validId);
          if (!notification || notification.userId === 'broadcast' || notification.read) {
            return state;
          }

          const updatedNotifications = state.notifications.map((n) => (n.id === validId ? { ...n, read: true } : n));

          const newUnreadCount = updatedNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: updatedNotifications,
            unreadCount: newUnreadCount,
            lastUpdated: new Date(),
          };
        });
      },

      markAllAsRead: () => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) => (n.userId === 'broadcast' ? n : { ...n, read: true }));

          const newUnreadCount = updatedNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: updatedNotifications,
            unreadCount: newUnreadCount,
            lastUpdated: new Date(),
          };
        });
      },

      removeNotification: (id: string) => {
        const validId = validateNotificationId(id);

        set((state) => {
          const exists = state.notifications.find((n) => n.id === validId);
          if (!exists) {
            return state;
          }

          const remainingNotifications = state.notifications.filter((n) => n.id !== validId);
          const newUnreadCount = remainingNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: remainingNotifications,
            unreadCount: newUnreadCount,
            lastUpdated: new Date(),
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
          lastUpdated: new Date(),
          _syncCounter: 0,
          isLoading: false,
        });
      },

      updateNotification: (id, updates) => {
        const validId = validateNotificationId(id);

        set((state) => {
          const existing = state.notifications.find((n) => n.id === validId);
          if (!existing) return state;

          const safeUpdates = { ...updates };
          if (existing.userId === 'broadcast' && 'read' in safeUpdates) {
            delete safeUpdates.read;
          }

          if ('timestamp' in safeUpdates && safeUpdates.timestamp) {
            safeUpdates.timestamp = ensureDate(safeUpdates.timestamp);
          }

          const updatedNotifications = state.notifications.map((n) => (n.id === validId ? { ...n, ...safeUpdates } : n));

          const newUnreadCount = updatedNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: updatedNotifications,
            unreadCount: newUnreadCount,
            lastUpdated: new Date(),
          };
        });
      },

      getNotificationsByUser: (userId) => {
        const validUserId = validateUserId(userId);
        const notifications = get().notifications.filter((n) => n.userId === validUserId || n.userId === 'broadcast');
        return notifications.map((n) => ({
          ...n,
          timestamp: ensureDate(n.timestamp),
        }));
      },

      getUnreadByUser: (userId: string) => {
        const validUserId = validateUserId(userId);
        return get().notifications.filter((n) => n.userId === validUserId && !n.read).length;
      },

      markAllAsReadForUser: (userId: string) => {
        const validUserId = validateUserId(userId);

        set((state) => {
          const updatedNotifications = state.notifications.map((n) => (n.userId === validUserId && !n.read ? { ...n, read: true } : n));

          const newUnreadCount = updatedNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: updatedNotifications,
            unreadCount: newUnreadCount,
            lastUpdated: new Date(),
          };
        });
      },

      removeAllForUser: (userId: string) => {
        const validUserId = validateUserId(userId);

        set((state) => {
          const remainingNotifications = state.notifications.filter((n) => n.userId !== validUserId);

          const newUnreadCount = remainingNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: remainingNotifications,
            unreadCount: newUnreadCount,
            lastUpdated: new Date(),
          };
        });
      },

      getNotificationsByCategory: (userId, category) => {
        const validUserId = validateUserId(userId);
        const notifications = get().notifications.filter((n) => (n.userId === validUserId || n.userId === 'broadcast') && n.category === category);
        return notifications.map((n) => ({
          ...n,
          timestamp: ensureDate(n.timestamp),
        }));
      },

      getNotificationsByType: (userId, type) => {
        const validUserId = validateUserId(userId);
        const notifications = get().notifications.filter((n) => (n.userId === validUserId || n.userId === 'broadcast') && n.type === type);
        return notifications.map((n) => ({
          ...n,
          timestamp: ensureDate(n.timestamp),
        }));
      },

      getBroadcastNotifications: () => {
        const notifications = get().notifications.filter((n) => n.userId === 'broadcast');
        return notifications.map((n) => ({
          ...n,
          timestamp: ensureDate(n.timestamp),
        }));
      },

      getUserSpecificNotifications: (userId: string) => {
        const validUserId = validateUserId(userId);
        const notifications = get().notifications.filter((n) => n.userId === validUserId);
        return notifications.map((n) => ({
          ...n,
          timestamp: ensureDate(n.timestamp),
        }));
      },

      getAllNotificationsForUser: (userId: string) => {
        const validUserId = validateUserId(userId);
        const notifications = get().notifications.filter((n) => n.userId === validUserId || n.userId === 'broadcast');

        const notificationsWithDates = notifications.map((n) => ({
          ...n,
          timestamp: ensureDate(n.timestamp),
          expires_at: n.expires_at ? ensureDate(n.expires_at) : undefined,
        }));

        return notificationsWithDates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      },

      getRecentNotifications: (userId: string, limit: number = 10) => {
        return get().getAllNotificationsForUser(userId).slice(0, limit);
      },

      recalcUnread: () => {
        const unread = get().notifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;
        set({ unreadCount: unread });
      },

      cleanupExpiredNotifications: () => {
        const now = new Date();
        set((state) => {
          const validNotifications = state.notifications.filter((n) => {
            if (!n.expires_at) return true;
            const expiresDate = ensureDate(n.expires_at);
            return expiresDate > now;
          });

          if (validNotifications.length === state.notifications.length) {
            return state;
          }

          const newUnreadCount = validNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: validNotifications,
            unreadCount: newUnreadCount,
            lastUpdated: new Date(),
          };
        });
      },

      syncWithBackendData: (backendNotifications: BackendNotification[], fullSync: boolean = false) => {
        const syncId = get()._syncCounter + 1;

        if (!backendNotifications || !Array.isArray(backendNotifications)) {
          return;
        }

        const convertedNotifications = backendNotifications.filter((notif) => notif && notif.notification_id).map(convertFromBackend);

        set((state) => {
          let finalNotifications;

          if (fullSync) {
            finalNotifications = convertedNotifications;
          } else {
            const existingMap = new Map(state.notifications.map((n) => [n.id, n]));

            convertedNotifications.forEach((newNotif) => {
              const existing = existingMap.get(newNotif.id);
              if (existing) {
                const isBroadcast = newNotif.userId === 'broadcast';

                let finalRead = existing.read;
                if (!isBroadcast) {
                  if (existing.read) {
                    finalRead = true;
                  } else if (newNotif.read) {
                    finalRead = true;
                  } else {
                    finalRead = false;
                  }
                }

                const mergedNotification = {
                  ...existing,
                  ...newNotif,
                  read: finalRead,
                  timestamp: new Date(Math.max(ensureDate(existing.timestamp).getTime(), ensureDate(newNotif.timestamp).getTime())),
                };

                existingMap.set(newNotif.id, mergedNotification);
              } else {
                existingMap.set(newNotif.id, newNotif);
              }
            });

            finalNotifications = Array.from(existingMap.values());
          }

          const sortedNotifications = finalNotifications.sort((a, b) => ensureDate(b.timestamp).getTime() - ensureDate(a.timestamp).getTime()).slice(0, 500);

          const unreadCount = sortedNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: sortedNotifications,
            unreadCount,
            lastUpdated: new Date(),
            _syncCounter: syncId,
          };
        });
      },

      mergeWithBackend: (backendNotifications: BackendNotification[]) => {
        const converted = backendNotifications.map(convertFromBackend);
        let finalResult: Notification[] = [];

        set((state) => {
          const existingMap = new Map(state.notifications.map((n) => [n.id, n]));

          converted.forEach((newNotif) => {
            const existing = existingMap.get(newNotif.id);
            if (existing) {
              const isBroadcast = newNotif.userId === 'broadcast';

              let finalRead = existing.read;
              if (!isBroadcast) {
                if (existing.read) {
                  finalRead = true;
                } else if (newNotif.read) {
                  finalRead = true;
                } else {
                  finalRead = false;
                }
              }

              const mergedNotification = {
                ...existing,
                ...newNotif,
                read: finalRead,
                timestamp: new Date(Math.max(ensureDate(existing.timestamp).getTime(), ensureDate(newNotif.timestamp).getTime())),
              };

              existingMap.set(newNotif.id, mergedNotification);
            } else {
              existingMap.set(newNotif.id, newNotif);
            }
          });

          const allNotifications = Array.from(existingMap.values());
          const sortedNotifications = allNotifications.sort((a, b) => ensureDate(b.timestamp).getTime() - ensureDate(a.timestamp).getTime()).slice(0, 500);

          finalResult = sortedNotifications;

          const unreadCount = sortedNotifications.filter((n) => n.userId !== 'broadcast' && !n.read).length;

          return {
            notifications: sortedNotifications,
            unreadCount,
            lastUpdated: new Date(),
            _syncCounter: get()._syncCounter + 1,
          };
        });

        return finalResult;
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      findNotificationById: (id: string) => {
        const validId = validateNotificationId(id);
        const notification = get().notifications.find((n) => n.id === validId);
        if (!notification) return undefined;

        return {
          ...notification,
          timestamp: ensureDate(notification.timestamp),
          expires_at: notification.expires_at ? ensureDate(notification.expires_at) : undefined,
        };
      },

      hasUnreadNotifications: (userId: string) => {
        const validUserId = validateUserId(userId);
        return get().notifications.some((n) => n.userId === validUserId && !n.read);
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp,
          expires_at: n.expires_at instanceof Date ? n.expires_at.toISOString() : n.expires_at,
        })),
        unreadCount: state.unreadCount,
        lastUpdated: state.lastUpdated instanceof Date ? state.lastUpdated.toISOString() : state.lastUpdated,
      }),
      version: 10,
      migrate: (persistedState: any, version: number) => {
        if (version < 10) {
          const notifications = persistedState.notifications || [];

          const processedNotifications = notifications
            .filter((n: any) => n && n.id && n.id !== 'null' && n.id !== 'undefined')
            .map((n: any) => ({
              ...n,
              timestamp: n.timestamp instanceof Date ? n.timestamp : new Date(n.timestamp || Date.now()),
              expires_at: n.expires_at ? (n.expires_at instanceof Date ? n.expires_at : new Date(n.expires_at)) : undefined,
              userId: n.userId || 'broadcast',
              read: n.read !== undefined ? n.read : n.userId === 'broadcast' ? true : false,
            }));

          const unreadCount = processedNotifications.filter((n: any) => n.userId !== 'broadcast' && !n.read).length;

          return {
            ...persistedState,
            notifications: processedNotifications,
            unreadCount,
            _syncCounter: 0,
            isLoading: false,
            lastUpdated: new Date(persistedState.lastUpdated || Date.now()),
          };
        }
        return persistedState;
      },
    }
  )
);

export const notificationUtils = {
  convertFromBackend,

  filterForUser: (notifications: Notification[], userId: string): Notification[] => {
    const validUserId = validateUserId(userId);
    return notifications
      .map((n) => ({
        ...n,
        timestamp: ensureDate(n.timestamp),
        expires_at: n.expires_at ? ensureDate(n.expires_at) : undefined,
      }))
      .filter((n) => n.userId === validUserId || n.userId === 'broadcast');
  },

  filterUnread: (notifications: Notification[]): Notification[] => {
    return notifications
      .map((n) => ({
        ...n,
        timestamp: ensureDate(n.timestamp),
        expires_at: n.expires_at ? ensureDate(n.expires_at) : undefined,
      }))
      .filter((n) => n.userId !== 'broadcast' && !n.read);
  },

  filterByCategory: (notifications: Notification[], category: string): Notification[] => {
    return notifications
      .map((n) => ({
        ...n,
        timestamp: ensureDate(n.timestamp),
        expires_at: n.expires_at ? ensureDate(n.expires_at) : undefined,
      }))
      .filter((n) => n.category === category);
  },

  filterByType: (notifications: Notification[], type: Notification['type']): Notification[] => {
    return notifications
      .map((n) => ({
        ...n,
        timestamp: ensureDate(n.timestamp),
        expires_at: n.expires_at ? ensureDate(n.expires_at) : undefined,
      }))
      .filter((n) => n.type === type);
  },

  isExpired: (notification: Notification): boolean => {
    if (!notification.expires_at) return false;
    return ensureDate(notification.expires_at) < new Date();
  },

  formatTimestamp: (timestamp: Date | string | number): string => {
    const date = ensureDate(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  },

  ensureDate,
};
