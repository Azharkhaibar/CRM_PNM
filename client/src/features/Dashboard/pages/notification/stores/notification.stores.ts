import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadByUser: (userId: string) => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id: string) => {
        set((state) => {
          const notificationToRemove = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((notif) => notif.id !== id),
            unreadCount: notificationToRemove && !notificationToRemove.read ? state.unreadCount - 1 : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      getNotificationsByUser: (userId: string) => {
        return get().notifications.filter((notif) => notif.userId === userId);
      },

      getUnreadByUser: (userId: string) => {
        return get().notifications.filter((notif) => notif.userId === userId && !notif.read).length;
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);
