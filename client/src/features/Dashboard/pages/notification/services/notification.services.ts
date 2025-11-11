import { Notification, useNotificationStore } from '../stores/notification.stores';

export interface BackendNotification {
  notification_id: number;
  user_id: number;
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
  userId: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

export class NotificationService {
  private static baseUrl = '/api/notifications';
  private static pollingIntervals = new Map<string, number>();

  /**
   * Handle API response and errors consistently
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get all notifications for a user with pagination and filtering
   */
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
        },
        credentials: 'include',
      });

      const data = await this.handleResponse<{
        notifications: BackendNotification[];
        total: number;
      }>(response);

      return {
        notifications: data.notifications.map((notif) => this.convertFromBackend(notif)),
        total: data.total,
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  /**
   * Create a new notification
   */
  static async createNotification(notificationData: CreateNotificationDto): Promise<BackendNotification> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(notificationData),
      });

      const result = await this.handleResponse<BackendNotification>(response);

      // Immediately sync the store after creating notification
      if (notificationData.userId) {
        setTimeout(() => {
          this.syncWithBackend(notificationData.userId.toString()).catch(console.error);
        }, 100);
      }

      return result;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<BackendNotification> {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      });

      return await this.handleResponse<BackendNotification>(response);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await this.handleResponse(response);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        await this.handleResponse(response);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Sync local store with backend
   */
  static async syncWithBackend(userId: string): Promise<Notification[]> {
    try {
      const { notifications: backendNotifications } = await this.getUserNotifications(userId);

      // Update local store dengan data dari backend
      const store = useNotificationStore.getState();

      // Hapus notifikasi lama untuk user ini
      const currentNotifications = store.notifications.filter((n) => n.userId !== userId);

      // Gabungkan notifikasi lama (dari user lain) dengan yang baru
      const updatedNotifications = [...currentNotifications, ...backendNotifications];

      // Update store - clear all dan rebuild
      store.clearAll();
      updatedNotifications.forEach((notif) => {
        store.addNotification({
          userId: notif.userId,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          category: notif.category,
          metadata: notif.metadata,
        });
      });

      return backendNotifications;
    } catch (error) {
      console.error('Error syncing with backend:', error);

      // Fallback: return local notifications untuk user ini
      const store = useNotificationStore.getState();
      const localNotifications = store.getNotificationsByUser(userId);

      return localNotifications;
    }
  }

  /**
   * Poll for new notifications (for real-time updates)
   */
  static startPolling(userId: string, interval: number = 10000): number {
    // Stop existing polling for this user
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

  /**
   * Stop polling for a specific user
   */
  static stopPolling(userId: string): void {
    const intervalId = this.pollingIntervals.get(userId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(userId);
    }
  }

  /**
   * Stop all polling
   */
  static stopAllPolling(): void {
    this.pollingIntervals.forEach((intervalId, userId) => {
      clearInterval(intervalId);
    });
    this.pollingIntervals.clear();
  }

  /**
   * Convert backend format to frontend format
   */
  private static convertFromBackend(backendNotif: BackendNotification): Notification {
    return {
      id: backendNotif.notification_id.toString(),
      userId: backendNotif.user_id.toString(),
      type: backendNotif.type,
      title: backendNotif.title,
      message: backendNotif.message,
      read: backendNotif.read,
      category: backendNotif.category || undefined,
      timestamp: new Date(backendNotif.created_at),
      metadata: backendNotif.metadata,
      ...(backendNotif.expires_at && { expires_at: new Date(backendNotif.expires_at) }),
    };
  }
}
