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
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  // CRUD actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  

  // Getters
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadByUser: (userId: string) => number;

  // Utilities
  recalcUnread: () => void;

  // set Notifications 
  

  // User-specific management
  markAllAsReadForUser: (userId: string) => void;
  removeAllForUser: (userId: string) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;

  // Filtering
  getNotificationsByCategory: (userId: string, category: string) => Notification[];
  getNotificationsByType: (userId: string, type: Notification['type']) => Notification[];
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // 💡 Kosongkan mock agar siap sync dengan backend
      notifications: [],
      unreadCount: 0,

      /** ➕ Tambahkan notifikasi manual (local event, alert, dll) */
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      /** ✅ Tandai satu notif sudah dibaca */
      markAsRead: (id: string) => {
        set((state) => {
          const updated = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        });
      },

      /** ✅ Tandai semua notif sebagai dibaca */
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      /** 🗑️ Hapus satu notifikasi */
      removeNotification: (id: string) => {
        set((state) => {
          const remaining = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: remaining,
            unreadCount: remaining.filter((n) => !n.read).length,
          };
        });
      },

      /** 🧹 Bersihkan semua notifikasi */
      clearAll: () => set({ notifications: [], unreadCount: 0 }),

      /** 🔍 Ambil semua notifikasi milik user tertentu */
      getNotificationsByUser: (userId: string) => get().notifications.filter((n) => n.userId === userId),

      /** 🔍 Hitung jumlah unread notifikasi untuk user */
      getUnreadByUser: (userId: string) => get().notifications.filter((n) => n.userId === userId && !n.read).length,

      /** 🔄 Hitung ulang total unread */
      recalcUnread: () => {
        const unread = get().notifications.filter((n) => !n.read).length;
        set({ unreadCount: unread });
      },

      /** ✅ Tandai semua notif user ini sebagai dibaca */
      markAllAsReadForUser: (userId: string) => {
        set((state) => {
          const updated = state.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n));
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        });
      },

      /** 🗑️ Hapus semua notif user tertentu */
      removeAllForUser: (userId: string) => {
        set((state) => {
          const remaining = state.notifications.filter((n) => n.userId !== userId);
          return {
            notifications: remaining,
            unreadCount: remaining.filter((n) => !n.read).length,
          };
        });
      },

      /** ✏️ Update properti notif tertentu */
      updateNotification: (id, updates) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        }));
      },

      /** 🔎 Filter berdasarkan kategori */
      getNotificationsByCategory: (userId, category) => get().notifications.filter((n) => n.userId === userId && n.category === category),

      /** 🔎 Filter berdasarkan tipe (info/success/warning/error) */
      getNotificationsByType: (userId, type) => get().notifications.filter((n) => n.userId === userId && n.type === type),
    }),
    {
      name: 'notification-storage', // persist key
    }
  )
);
