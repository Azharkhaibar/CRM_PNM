// notification.services.ts
import { Notification, useNotificationStore } from '../stores/notification.stores';

export interface BackendNotification {
  id: number;
  notification_id: number;
  user_id: number | null;
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
  userId?: number | null;
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

  private static debugLog(action: string, data?: any) {
    console.log(`🔔 [NotificationService] ${action}:`, data || '');
  }

  private static errorLog(action: string, error: any, context?: any) {
    console.error(`🔔 [NotificationService] ERROR in ${action}:`, error, context || '');
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      let errorData: any = null;

      try {
        errorData = errorText ? JSON.parse(errorText) : null;
      } catch {
        errorData = { message: errorText };
      }

      const message = errorData?.message || errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  private static isTemporaryId(id: string): boolean {
    return !id || id.startsWith('temp-') || isNaN(Number(id.replace('temp-', '')));
  }

  static async getUserNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      this.debugLog('getUserNotifications', { userId, options });

      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());

      const url = `${this.baseUrl}/user/${userId}?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      const data = await this.handleResponse<{ notifications: BackendNotification[]; total: number }>(response);

      const result = {
        notifications: data.notifications.map((notif) => this.convertFromBackend(notif)),
        total: data.total,
      };

      this.debugLog('getUserNotifications success', {
        userId,
        count: result.notifications.length,
        total: result.total,
      });

      return result;
    } catch (error) {
      this.errorLog('getUserNotifications', error, { userId, options });
      throw error;
    }
  }

  static async getBroadcastNotifications(options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      this.debugLog('getBroadcastNotifications', { options });

      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());

      const url = `${this.baseUrl}/broadcast?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      const data = await this.handleResponse<{ notifications: BackendNotification[]; total: number }>(response);

      const result = {
        notifications: data.notifications.map((notif) => this.convertFromBackend(notif)),
        total: data.total,
      };

      this.debugLog('getBroadcastNotifications success', {
        count: result.notifications.length,
        total: result.total,
      });

      return result;
    } catch (error) {
      this.errorLog('getBroadcastNotifications', error, { options });
      return { notifications: [], total: 0 };
    }
  }

  static async getAllNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      this.debugLog('getAllNotifications', { userId, options });
      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());

      const url = `${this.baseUrl}/user/${userId}/all${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      const data = await this.handleResponse<{ notifications: BackendNotification[]; total: number }>(response);

      const result = {
        notifications: data.notifications.map((notif) => this.convertFromBackend(notif)),
        total: data.total,
      };

      this.debugLog('getAllNotifications success (new endpoint)', {
        userId,
        count: result.notifications.length,
        total: result.total,
      });

      return result;
    } catch (error) {
      this.errorLog('getAllNotifications new endpoint failed', error, { userId, options });
      try {
        this.debugLog('Falling back to combined approach');

        const [userNotifications, broadcastNotifications] = await Promise.allSettled([this.getUserNotifications(userId, options), this.getBroadcastNotifications(options)]);

        let userNotifsResult = { notifications: [] as Notification[], total: 0 };
        let broadcastNotifsResult = { notifications: [] as Notification[], total: 0 };
        if (userNotifications.status === 'fulfilled') {
          userNotifsResult = userNotifications.value;
        } else {
          this.errorLog('getAllNotifications - user failed', userNotifications.reason);
        }

        if (broadcastNotifications.status === 'fulfilled') {
          broadcastNotifsResult = broadcastNotifications.value;
        } else {
          this.errorLog('getAllNotifications - broadcast failed', broadcastNotifications.reason);
        }

        const allNotifications = [...userNotifsResult.notifications, ...broadcastNotifsResult.notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const result = {
          notifications: allNotifications,
          total: userNotifsResult.total + broadcastNotifsResult.total,
        };

        this.debugLog('getAllNotifications fallback success', {
          userId,
          userCount: userNotifsResult.notifications.length,
          broadcastCount: broadcastNotifsResult.notifications.length,
          total: result.total,
        });

        return result;
      } catch (fallbackError) {
        this.errorLog('Complete failure in getAllNotifications', fallbackError);

        try {
          const userNotifications = await this.getUserNotifications(userId, options);
          return userNotifications;
        } catch (finalError) {
          this.errorLog('Final fallback failed', finalError);
          return {
            notifications: [],
            total: 0,
          };
        }
      }
    }
  }

  static async createNotification(notificationData: CreateNotificationDto): Promise<BackendNotification> {
    try {
      this.debugLog('createNotification', notificationData);

      // ✅ Payload sesuai dengan backend CreateNotificationDto
      const payload = {
        user_id: notificationData.userId ?? null,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        category: notificationData.category ?? null,
        metadata: notificationData.metadata ?? null,
        expires_at: notificationData.expiresAt ? notificationData.expiresAt.toISOString() : null,
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

      this.debugLog('createNotification success', {
        id: result.notification_id,
        userId: notificationData.userId,
      });

      return result;
    } catch (error) {
      this.errorLog('createNotification', error, notificationData);
      throw error;
    }
  }

  static async createLoginNotification(userId: number, username: string): Promise<BackendNotification> {
    try {
      this.debugLog('createLoginNotification', { userId, username });

      const notificationData: CreateNotificationDto = {
        userId: userId,
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${username}! You have successfully logged in.`,
        category: 'security',
        metadata: {
          login_time: new Date().toISOString(),
          activity_type: 'login',
          user_id: userId,
          ip_address: 'system',
          username: username,
        },
      };

      const result = await this.createNotification(notificationData);

      this.debugLog('createLoginNotification success', {
        id: result.notification_id,
        userId: userId,
      });

      return result;
    } catch (error) {
      this.errorLog('createLoginNotification', error, { userId, username });

      console.warn('Login notification failed to send to backend. Skipping local fallback.');

      throw error;
    }
  }

  static async createLogoutNotification(userId: number, username: string): Promise<BackendNotification> {
    try {
      this.debugLog('createLogoutNotification', { userId, username });

      const notificationData: CreateNotificationDto = {
        userId: userId,
        type: 'info',
        title: 'Logout Successful',
        message: `You have successfully logged out. See you soon, ${username}!`,
        category: 'security',
        metadata: {
          logout_time: new Date().toISOString(),
          activity_type: 'logout',
          user_id: userId,
          username: username,
        },
      };

      const result = await this.createNotification(notificationData);

      this.debugLog('createLogoutNotification success', {
        id: result.notification_id,
        userId: userId,
      });

      return result;
    } catch (error) {
      this.errorLog('createLogoutNotification', error, { userId, username });

      console.warn('Logout notification failed to send to backend. Skipping local fallback.');

      throw error;
    }
  }

  static async createUserStatusBroadcast(userId: number, username: string, status: string): Promise<BackendNotification> {
    try {
      this.debugLog('createUserStatusBroadcast', { userId, username, status });

      const payload = {
        userId,
        userName: username,
        status,
      };

      const response = await fetch(`/api/v1/notifications/user-status`, {
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

      this.debugLog('createUserStatusBroadcast success', {
        id: result.notification_id,
        status: status,
      });

      return result;
    } catch (error) {
      this.errorLog('createUserStatusBroadcast', error, { userId, username, status });

      const notificationData: CreateNotificationDto = {
        userId: null,
        type: 'info',
        title: 'User Status Update',
        message: `${username} is now ${status}`,
        category: 'user-status',
        metadata: {
          userId: userId,
          userName: username,
          status: status,
          timestamp: new Date().toISOString(),
        },
      };

      return await this.createNotification(notificationData);
    }
  }

  private static createLocalFallbackNotification(userId: number, username: string, action: 'login' | 'logout') {
    try {
      const store = useNotificationStore.getState();

      const fallbackNotification = {
        userId: String(userId),
        type: action === 'login' ? 'success' : ('info' as const),
        title: action === 'login' ? 'Login Successful' : 'Logout Successful',
        message: action === 'login' ? `Welcome back, ${username}! (Local Fallback)` : `You have successfully logged out. (Local Fallback)`,
        category: 'security',
        metadata: {
          timestamp: new Date().toISOString(),
          activity_type: action,
          user_id: userId,
          username: username,
          is_fallback: true,
        },
      };

      store.addNotification(fallbackNotification);

      this.debugLog('Local fallback notification created', {
        userId,
        username,
        action,
      });
    } catch (fallbackError) {
      this.errorLog('createLocalFallbackNotification', fallbackError, { userId, username, action });
    }
  }

  static async markAsRead(notificationId: string): Promise<BackendNotification> {
    try {
      this.debugLog('markAsRead', { notificationId });

      if (this.isTemporaryId(notificationId)) {
        this.debugLog('markAsRead - skipping backend for temporary ID', { notificationId });
        return {
          notification_id: 0,
          user_id: null,
          type: 'info',
          title: 'Local Notification',
          message: 'This is a local notification',
          read: true,
          metadata: null,
          category: null,
          created_at: new Date().toISOString(),
          expires_at: null,
        };
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

      const result = await this.handleResponse<BackendNotification>(response);

      this.debugLog('markAsRead success', { notificationId });
      return result;
    } catch (error) {
      this.errorLog('markAsRead', error, { notificationId });
      throw error;
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    try {
      this.debugLog('markAllAsRead', { userId });

      const response = await fetch(`${this.baseUrl}/user/${userId}/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await this.handleResponse(response);
      }

      this.debugLog('markAllAsRead success', { userId });
    } catch (error) {
      this.errorLog('markAllAsRead', error, { userId });
      throw error;
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      this.debugLog('deleteNotification', { notificationId });

      if (!notificationId || notificationId.startsWith('temp-') || isNaN(Number(notificationId))) {
        this.debugLog('deleteNotification - skipping backend for temporary ID', { notificationId });
        return;
      }

      if (!notificationId || isNaN(Number(notificationId))) {
        throw new Error(`Invalid notification ID: ${notificationId}`);
      }

      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await this.handleResponse(response);
      }

      this.debugLog('deleteNotification success', { notificationId });
    } catch (error) {
      this.errorLog('deleteNotification', error, { notificationId });
      throw error;
    }
  }

  static async syncWithBackend(userId: string): Promise<Notification[]> {
    try {
      this.debugLog('syncWithBackend', { userId });

      const { notifications: backendNotifications } = await this.getAllNotifications(userId);
      const store = useNotificationStore.getState();

      store.syncWithBackendData(backendNotifications);

      this.debugLog('syncWithBackend success', {
        userId,
        count: backendNotifications.length,
      });

      return backendNotifications;
    } catch (error) {
      this.errorLog('syncWithBackend', error, { userId });
      return [];
    }
  }

  static async syncBroadcastNotifications(): Promise<Notification[]> {
    try {
      this.debugLog('syncBroadcastNotifications');

      const { notifications: broadcastNotifications } = await this.getBroadcastNotifications();
      const store = useNotificationStore.getState();

      let addedCount = 0;
      broadcastNotifications.forEach((notif) => {
        if (!store.notifications.find((n) => n.id === notif.id)) {
          store.addNotification(notif);
          addedCount++;
        }
      });

      this.debugLog('syncBroadcastNotifications success', {
        broadcastCount: broadcastNotifications.length,
        addedCount: addedCount,
      });

      return broadcastNotifications;
    } catch (error) {
      this.errorLog('syncBroadcastNotifications', error);
      return [];
    }
  }

  static async deleteAllUserNotifications(userId: string): Promise<void> {
    try {
      this.debugLog('deleteAllUserNotifications', { userId });

      const response = await fetch(`${this.baseUrl}/user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await this.handleResponse(response);
      }

      this.debugLog('deleteAllUserNotifications success', { userId });
    } catch (error) {
      this.errorLog('deleteAllUserNotifications', error, { userId });
      throw error;
    }
  }

  static startPolling(userId: string, interval: number = 30000): number {
    this.debugLog('startPolling', { userId, interval });

    this.stopPolling(userId);

    const intervalId = window.setInterval(async () => {
      try {
        await this.syncWithBackend(userId);
        await this.getUnreadCount(userId); // Update unread count
      } catch (error) {
        this.errorLog('Polling error', error, { userId });
      }
    }, interval);

    this.pollingIntervals.set(userId, intervalId);
    return intervalId;
  }
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      this.debugLog('getUnreadCount', { userId });

      const response = await fetch(`${this.baseUrl}/user/${userId}/unread-count`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      const data = await this.handleResponse<{ count: number }>(response);

      this.debugLog('getUnreadCount success', { userId, count: data.count });
      return data.count;
    } catch (error) {
      this.errorLog('getUnreadCount', error, { userId });
      return 0;
    }
  }

  static stopPolling(userId: string): void {
    const intervalId = this.pollingIntervals.get(userId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(userId);
      this.debugLog('stopPolling', { userId });
    }
  }

  // async private readonl (userId: string): void {
  //   const intervalID = this.pollingIntervals.get(userId)
  //   if (interval)
  // }

  static stopAllPolling(): void {
    this.pollingIntervals.forEach((intervalId, userId) => {
      clearInterval(intervalId);
      this.debugLog('stopAllPolling - stopped', { userId, intervalId });
    });
    this.pollingIntervals.clear();
    this.debugLog('stopAllPolling - all stopped');
  }

  private static convertFromBackend(backendNotif: BackendNotification): Notification {
    return {
      id: backendNotif.notification_id.toString(),
      userId: backendNotif.user_id ? backendNotif.user_id.toString() : 'broadcast',
      type: backendNotif.type,
      title: backendNotif.title,
      message: backendNotif.message,
      read: backendNotif.read,
      category: backendNotif.category || undefined,
      timestamp: new Date(backendNotif.created_at),
      metadata: backendNotif.metadata || {},
      expires_at: backendNotif.expires_at ? new Date(backendNotif.expires_at) : undefined,
    };
  }

  static async cleanupExpiredNotifications(): Promise<void> {
    try {
      this.debugLog('cleanupExpiredNotifications');

      const response = await fetch(`${this.baseUrl}/cleanup/expired`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await this.handleResponse(response);
      }

      this.debugLog('cleanupExpiredNotifications success');
    } catch (error) {
      this.errorLog('cleanupExpiredNotifications', error);
    }
  }

  static debugCurrentState(userId?: string) {
    const store = useNotificationStore.getState();

    console.log('🔔 [NotificationService] Current State Debug:');
    console.log('Total notifications:', store.notifications.length);
    console.log('Unread count:', store.unreadCount);

    if (userId) {
      const userNotifications = store.getNotificationsByUser(userId);
      const broadcastNotifications = store.getBroadcastNotifications();

      console.log(`Notifications for user ${userId}:`, userNotifications.length);
      console.log(`Broadcast notifications:`, broadcastNotifications.length);
    }
  }

  static async testLogoutNotification(userId: number, username: string) {
    console.log('🧪 Testing logout notification...');

    try {
      const store = useNotificationStore.getState();
      store.clearAll();

      await this.createLogoutNotification(userId, username);

      setTimeout(() => {
        this.debugCurrentState(userId.toString());
        console.log('✅ Test completed - check console for results');
      }, 1000);
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
}
