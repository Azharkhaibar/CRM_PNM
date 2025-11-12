// notification.services.ts
import { Notification, useNotificationStore } from '../stores/notification.stores';

export interface BackendNotification {
  notification_id: number;
  user_id: number | null; // null untuk broadcast ke semua user
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  metadata: Record<string, any> | null;
  category: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface CreateNotificationDto {
  userId: number | null; // null untuk broadcast ke semua user
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

export class NotificationService {
  private static baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/notifications` : '/api/v1/notifications';

  private static pollingIntervals = new Map<string, number>();

  private static async handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      const message = (data && (data.message || data.error)) || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return data as T;
  }

  // Get notifications for specific user
  static async getUserNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());

      const url = `${this.baseUrl}/user/${userId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      const data = await this.handleResponse<{ notifications: BackendNotification[]; total: number }>(response);

      return {
        notifications: data.notifications.map((notif) => this.convertFromBackend(notif)),
        total: data.total,
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  // Get broadcast notifications (untuk semua user)
  static async getBroadcastNotifications(options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());
      params.append('broadcast', 'true');

      const url = `${this.baseUrl}/broadcast${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      const data = await this.handleResponse<{ notifications: BackendNotification[]; total: number }>(response);

      return {
        notifications: data.notifications.map((notif) => this.convertFromBackend(notif)),
        total: data.total,
      };
    } catch (error) {
      console.warn('⚠️ Broadcast endpoint failed, falling back to regular notifications:', error);

      // ✅ FALLBACK: Jika endpoint broadcast tidak ada, coba ambil dari regular endpoint dengan filter
      try {
        // Coba ambil semua notifikasi dan filter yang broadcast
        const allResponse = await fetch(`${this.baseUrl}?limit=${options?.limit || 50}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        });

        const allData = await this.handleResponse<{ notifications: BackendNotification[]; total: number }>(allResponse);

        // Filter notifikasi broadcast (user_id null)
        const broadcastNotifications = allData.notifications.filter((notif) => notif.user_id === null || notif.user_id === undefined);

        return {
          notifications: broadcastNotifications.map((notif) => this.convertFromBackend(notif)),
          total: broadcastNotifications.length,
        };
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        // Return empty array sebagai last resort
        return {
          notifications: [],
          total: 0,
        };
      }
    }
  }

  // Get all notifications (user-specific + broadcast)
  static async getAllNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      // Coba ambil user notifications dan broadcast secara parallel
      const [userNotifications, broadcastNotifications] = await Promise.allSettled([this.getUserNotifications(userId, options), this.getBroadcastNotifications(options)]);

      let userNotifsResult = { notifications: [], total: 0 };
      let broadcastNotifsResult = { notifications: [], total: 0 };

      // Handle user notifications result
      if (userNotifications.status === 'fulfilled') {
        userNotifsResult = userNotifications.value;
      } else {
        console.error('❌ Failed to get user notifications:', userNotifications.reason);
      }

      // Handle broadcast notifications result
      if (broadcastNotifications.status === 'fulfilled') {
        broadcastNotifsResult = broadcastNotifications.value;
      } else {
        console.error('❌ Failed to get broadcast notifications:', broadcastNotifications.reason);
      }

      // Gabungkan dan sort by timestamp
      const allNotifications = [...userNotifsResult.notifications, ...broadcastNotifsResult.notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        notifications: allNotifications,
        total: userNotifsResult.total + broadcastNotifsResult.total,
      };
    } catch (error) {
      console.error('❌ Error fetching all notifications:', error);

      // ✅ FALLBACK: Coba ambil hanya user notifications saja
      try {
        console.log('🔄 Falling back to user notifications only...');
        const userNotifications = await this.getUserNotifications(userId, options);
        return {
          notifications: userNotifications.notifications,
          total: userNotifications.total,
        };
      } catch (fallbackError) {
        console.error('❌ Complete failure:', fallbackError);
        // Last resort: return empty
        return {
          notifications: [],
          total: 0,
        };
      }
    }
  }

  // Create notification (bisa untuk user specific atau broadcast)
  static async createNotification(notificationData: CreateNotificationDto): Promise<BackendNotification> {
    try {
      const payload = {
        ...notificationData,
        expires_at: notificationData.expiresAt?.toISOString() || null,
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await this.handleResponse<BackendNotification>(response);

      // Auto-sync untuk user yang terkait
      if (notificationData.userId) {
        setTimeout(() => {
          this.syncWithBackend(notificationData.userId!.toString()).catch(console.error);
        }, 100);
      } else {
        // Untuk broadcast, sync untuk semua user yang sedang online
        setTimeout(() => {
          this.syncBroadcastNotifications().catch(console.error);
        }, 100);
      }

      return result;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create login notification khusus
  static async createLoginNotification(userId: number, userID: string): Promise<BackendNotification> {
    return await this.createNotification({
      userId: userId,
      type: 'success',
      title: 'Login Successful',
      message: `Welcome back, ${userID}! You have successfully logged into RIMS.`,
      category: 'security',
      metadata: {
        login_time: new Date().toISOString(),
        user_agent: navigator.userAgent,
        activity_type: 'login',
        ip_address: 'system',
      },
    });
  }

  // Create logout notification khusus
  static async createLogoutNotification(userId: number, userID: string): Promise<BackendNotification> {
    return await this.createNotification({
      userId: userId,
      type: 'info',
      title: 'Logout Successful',
      message: `You have logged out from RIMS.`,
      category: 'security',
      metadata: {
        logout_time: new Date().toISOString(),
        activity_type: 'logout',
      },
    });
  }

  // Create broadcast notification untuk login/logout user lain
  static async createUserStatusBroadcast(userId: number, userID: string, action: 'login' | 'logout'): Promise<BackendNotification> {
    return await this.createNotification({
      userId: null, // null berarti broadcast ke semua user
      type: 'info',
      title: action === 'login' ? 'User Logged In' : 'User Logged Out',
      message: action === 'login' ? `User ${userID} has logged into the system.` : `User ${userID} has logged out from the system.`,
      category: 'system',
      metadata: {
        timestamp: new Date().toISOString(),
        activity_type: 'user_status',
        user_id: userId,
        user_name: userID,
        action: action,
      },
    });
  }

  static async markAsRead(notificationId: string): Promise<BackendNotification> {
    try {
      // ✅ FIX: Validasi notificationId sebelum digunakan
      if (!notificationId || notificationId === 'NaN' || isNaN(Number(notificationId))) {
        throw new Error(`Invalid notification ID: ${notificationId}`);
      }

      const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      return await this.handleResponse<BackendNotification>(response);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });
      if (!response.ok) await this.handleResponse(response);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      // ✅ FIX: Validasi notificationId sebelum digunakan
      if (!notificationId || notificationId === 'NaN' || isNaN(Number(notificationId))) {
        throw new Error(`Invalid notification ID: ${notificationId}`);
      }

      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  static async syncWithBackend(userId: string): Promise<Notification[]> {
    try {
      const { notifications: backendNotifications } = await this.getAllNotifications(userId);
      const store = useNotificationStore.getState();

      // Filter valid notifications
      const validNotifications = backendNotifications.filter((notif) => notif.id && notif.id !== 'NaN' && !isNaN(Number(notif.id.replace('temp-', ''))));

      store.syncWithBackendData(validNotifications);
      return validNotifications;
    } catch (error) {
      console.error('Error syncing with backend:', error);
      const store = useNotificationStore.getState();
      return store.getNotificationsByUser(userId);
    }
  }

  static async syncBroadcastNotifications(): Promise<Notification[]> {
    try {
      const { notifications: broadcastNotifications } = await this.getBroadcastNotifications();
      const store = useNotificationStore.getState();

      // Tambahkan broadcast notifications ke store
      broadcastNotifications.forEach((notif) => {
        if (!store.notifications.find((n) => n.id === notif.id)) {
          store.addNotification(notif);
        }
      });

      return broadcastNotifications;
    } catch (error) {
      console.error('Error syncing broadcast notifications:', error);
      return [];
    }
  }

  static async deleteAllUserNotifications(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}/delete-all`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });
      if (!response.ok) await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting all user notifications:', error);
      throw error;
    }
  }

  // Polling untuk real-time updates
  static startPolling(userId: string, interval: number = 15000): number {
    this.stopPolling(userId);

    const intervalId = window.setInterval(async () => {
      try {
        await this.syncWithBackend(userId);
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, interval);

    this.pollingIntervals.set(userId, intervalId);
    return intervalId;
  }

  static stopPolling(userId: string): void {
    const intervalId = this.pollingIntervals.get(userId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(userId);
    }
  }

  static stopAllPolling(): void {
    this.pollingIntervals.forEach((intervalId) => clearInterval(intervalId));
    this.pollingIntervals.clear();
  }

  private static convertFromBackend(backendNotif: BackendNotification): Notification {
    // Validasi ID sebelum konversi
    const validId = backendNotif.notification_id && !isNaN(backendNotif.notification_id) && backendNotif.notification_id > 0 ? backendNotif.notification_id.toString() : `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: validId,
      userId: backendNotif.user_id ? backendNotif.user_id.toString() : 'broadcast',
      type: backendNotif.type as Notification['type'],
      title: backendNotif.title,
      message: backendNotif.message,
      read: backendNotif.read,
      category: backendNotif.category || undefined,
      timestamp: new Date(backendNotif.created_at),
      metadata: backendNotif.metadata || {},
      expires_at: backendNotif.expires_at ? new Date(backendNotif.expires_at) : undefined,
    };
  }

  // Utility function untuk membersihkan notifikasi expired
  static async cleanupExpiredNotifications(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/cleanup-expired`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) await this.handleResponse(response);
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
    }
  }
}
