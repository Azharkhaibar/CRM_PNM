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

  // ✅ FIX: Tambahkan debug logging methods
  private static debugLog(action: string, data?: any) {
    console.log(`🔔 [NotificationService] ${action}:`, data || '');
  }

  private static errorLog(action: string, error: any, context?: any) {
    console.error(`🔔 [NotificationService] ERROR in ${action}:`, error, context || '');
  }

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

  // ✅ FIX: Improved getUserNotifications dengan better error handling
  static async getUserNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      this.debugLog('getUserNotifications', { userId, options });

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

  // ✅ FIX: Improved getBroadcastNotifications
  static async getBroadcastNotifications(options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      this.debugLog('getBroadcastNotifications', { options });

      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());

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

      // ✅ FIX: Fallback yang lebih baik - ambil semua dan filter
      try {
        this.debugLog('Trying fallback for broadcast notifications');

        const allResponse = await fetch(`${this.baseUrl}?limit=${options?.limit || 100}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        });

        const allData = await this.handleResponse<{ notifications: BackendNotification[]; total: number }>(allResponse);

        // ✅ FIX: Pastikan allData.notifications ada sebelum filter
        const broadcastNotifications = (allData.notifications || []).filter((notif) => notif.user_id === null || notif.user_id === undefined);

        const result = {
          notifications: broadcastNotifications.map((notif) => this.convertFromBackend(notif)),
          total: broadcastNotifications.length,
        };

        this.debugLog('Broadcast fallback success', {
          count: result.notifications.length,
        });

        return result;
      } catch (fallbackError) {
        this.errorLog('Broadcast fallback failed', fallbackError);

        // ✅ FIX: Last resort - return dari store local
        try {
          const store = useNotificationStore.getState();
          const broadcastNotifications = store.getBroadcastNotifications();

          this.debugLog('Using local store fallback', {
            count: broadcastNotifications.length,
          });

          return {
            notifications: broadcastNotifications,
            total: broadcastNotifications.length,
          };
        } catch (storeError) {
          this.errorLog('Local store fallback also failed', storeError);
          return {
            notifications: [],
            total: 0,
          };
        }
      }
    }
  }

  // ✅ FIX: Improved getAllNotifications
  static async getAllNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number; page?: number }): Promise<{ notifications: Notification[]; total: number }> {
    try {
      this.debugLog('getAllNotifications', { userId, options });

      // Coba endpoint baru yang sudah include broadcast
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

      // ✅ FALLBACK: Gunakan approach lama jika endpoint baru tidak ada
      try {
        this.debugLog('Falling back to combined approach');

        const [userNotifications, broadcastNotifications] = await Promise.allSettled([this.getUserNotifications(userId, options), this.getBroadcastNotifications(options)]);

        let userNotifsResult = { notifications: [] as Notification[], total: 0 };
        let broadcastNotifsResult = { notifications: [] as Notification[], total: 0 };

        // Handle user notifications result
        if (userNotifications.status === 'fulfilled') {
          userNotifsResult = userNotifications.value;
        } else {
          this.errorLog('getAllNotifications - user failed', userNotifications.reason);
        }

        // Handle broadcast notifications result
        if (broadcastNotifications.status === 'fulfilled') {
          broadcastNotifsResult = broadcastNotifications.value;
        } else {
          this.errorLog('getAllNotifications - broadcast failed', broadcastNotifications.reason);
        }

        // Gabungkan dan sort by timestamp
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

        // Last resort: cuma user notifications
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

  // ✅ FIX: Improved createNotification dengan better payload handling
  static async createNotification(notificationData: CreateNotificationDto): Promise<BackendNotification> {
    try {
      this.debugLog('createNotification', notificationData);

      // Bersihkan payload dari undefined values
      const cleanPayload: any = {
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        category: notificationData.category || null,
        metadata: notificationData.metadata || null,
        expires_at: notificationData.expiresAt?.toISOString() || null,
      };

      // Remove undefined values
      Object.keys(cleanPayload).forEach((key) => {
        if (cleanPayload[key] === undefined) {
          delete cleanPayload[key];
        }
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(cleanPayload),
      });

      const result = await this.handleResponse<BackendNotification>(response);

      this.debugLog('createNotification success', {
        id: result.notification_id,
        userId: notificationData.userId,
      });

      // Auto-sync untuk user yang terkait
      if (notificationData.userId) {
        setTimeout(() => {
          this.syncWithBackend(notificationData.userId!.toString())
            .then(() => this.debugLog('Auto-sync completed', { userId: notificationData.userId }))
            .catch((err) => this.errorLog('Auto-sync failed', err));
        }, 500);
      } else {
        // Untuk broadcast, sync broadcast notifications
        setTimeout(() => {
          this.syncBroadcastNotifications()
            .then(() => this.debugLog('Broadcast sync completed'))
            .catch((err) => this.errorLog('Broadcast sync failed', err));
        }, 500);
      }

      return result;
    } catch (error) {
      this.errorLog('createNotification', error, notificationData);
      throw error;
    }
  }

  // ✅ FIX: Improved createLoginNotification
  static async createLoginNotification(userId: number, username: string): Promise<BackendNotification> {
    try {
      this.debugLog('createLoginNotification', { userId, username });

      const notificationData: CreateNotificationDto = {
        userId: userId,
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${username}! You have successfully logged into RIMS.`,
        category: 'security',
        metadata: {
          login_time: new Date().toISOString(),
          user_agent: navigator.userAgent,
          activity_type: 'login',
          ip_address: 'system',
          user_id: userId,
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

      // ✅ FALLBACK: Create local notification
      this.createLocalFallbackNotification(userId, username, 'login');
      throw error;
    }
  }

  // ✅ FIX: Improved createLogoutNotification
  static async createLogoutNotification(userId: number, username: string): Promise<BackendNotification> {
    try {
      this.debugLog('createLogoutNotification', { userId, username });

      const notificationData: CreateNotificationDto = {
        userId: userId,
        type: 'info',
        title: 'Logout Successful',
        message: `You have successfully logged out from RIMS. See you soon, ${username}!`,
        category: 'security',
        metadata: {
          logout_time: new Date().toISOString(),
          activity_type: 'logout',
          user_id: userId,
          username: username,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
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

      // ✅ FALLBACK: Create local notification
      this.createLocalFallbackNotification(userId, username, 'logout');
      throw error;
    }
  }

  // ✅ FIX: Improved createUserStatusBroadcast
  static async createUserStatusBroadcast(userId: number, username: string, action: 'login' | 'logout'): Promise<BackendNotification> {
    try {
      this.debugLog('createUserStatusBroadcast', { userId, username, action });

      const notificationData: CreateNotificationDto = {
        userId: null, // null berarti broadcast ke semua user
        type: 'info',
        title: action === 'login' ? 'User Logged In' : 'User Logged Out',
        message: action === 'login' ? `User ${username} has logged into the system.` : `User ${username} has logged out from the system.`,
        category: 'system',
        metadata: {
          timestamp: new Date().toISOString(),
          activity_type: 'user_status',
          user_id: userId,
          user_name: username,
          action: action,
        },
      };

      const result = await this.createNotification(notificationData);

      this.debugLog('createUserStatusBroadcast success', {
        id: result.notification_id,
        action: action,
      });

      return result;
    } catch (error) {
      this.errorLog('createUserStatusBroadcast', error, { userId, username, action });
      throw error;
    }
  }

  // ✅ NEW: Local fallback notification method
  private static createLocalFallbackNotification(userId: number, username: string, action: 'login' | 'logout') {
    try {
      const store = useNotificationStore.getState();

      const fallbackNotification = {
        userId: userId.toString(),
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

  // ✅ FIX: Improved markAsRead dengan validasi yang lebih baik
  static async markAsRead(notificationId: string): Promise<BackendNotification> {
    try {
      this.debugLog('markAsRead', { notificationId });

      // Validasi notificationId
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

      const result = await this.handleResponse<BackendNotification>(response);

      this.debugLog('markAsRead success', { notificationId });
      return result;
    } catch (error) {
      this.errorLog('markAsRead', error, { notificationId });
      throw error;
    }
  }

  // ✅ FIX: Improved markAllAsRead
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

  // ✅ FIX: Improved deleteNotification
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      this.debugLog('deleteNotification', { notificationId });

      // Validasi notificationId
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

      if (!response.ok) {
        await this.handleResponse(response);
      }

      this.debugLog('deleteNotification success', { notificationId });
    } catch (error) {
      this.errorLog('deleteNotification', error, { notificationId });
      throw error;
    }
  }

  // ✅ FIX: Improved syncWithBackend
  static async syncWithBackend(userId: string): Promise<Notification[]> {
    try {
      this.debugLog('syncWithBackend', { userId });

      const { notifications: backendNotifications } = await this.getAllNotifications(userId);
      const store = useNotificationStore.getState();

      // Filter valid notifications
      const validNotifications = backendNotifications.filter((notif) => notif.id && notif.id !== 'NaN' && !isNaN(Number(notif.id.replace('temp-', ''))));

      store.syncWithBackendData(validNotifications);

      this.debugLog('syncWithBackend success', {
        userId,
        backendCount: backendNotifications.length,
        validCount: validNotifications.length,
        storeCount: store.notifications.length,
      });

      return validNotifications;
    } catch (error) {
      this.errorLog('syncWithBackend', error, { userId });

      // Return local notifications sebagai fallback
      const store = useNotificationStore.getState();
      const localNotifications = store.getNotificationsByUser(userId);

      this.debugLog('Using local notifications as fallback', {
        userId,
        localCount: localNotifications.length,
      });

      return localNotifications;
    }
  }

  // ✅ FIX: Improved syncBroadcastNotifications
  static async syncBroadcastNotifications(): Promise<Notification[]> {
    try {
      this.debugLog('syncBroadcastNotifications');

      const { notifications: broadcastNotifications } = await this.getBroadcastNotifications();
      const store = useNotificationStore.getState();

      // Tambahkan broadcast notifications ke store
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

  // ✅ FIX: Improved deleteAllUserNotifications
  static async deleteAllUserNotifications(userId: string): Promise<void> {
    try {
      this.debugLog('deleteAllUserNotifications', { userId });

      const response = await fetch(`${this.baseUrl}/user/${userId}/delete-all`, {
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

  // ✅ FIX: Polling untuk real-time updates
  static startPolling(userId: string, interval: number = 15000): number {
    this.debugLog('startPolling', { userId, interval });

    this.stopPolling(userId);

    const intervalId = window.setInterval(async () => {
      try {
        await this.syncWithBackend(userId);
      } catch (error) {
        this.errorLog('Polling error', error, { userId });
      }
    }, interval);

    this.pollingIntervals.set(userId, intervalId);

    this.debugLog('Polling started', { userId, intervalId });
    return intervalId;
  }

  static stopPolling(userId: string): void {
    const intervalId = this.pollingIntervals.get(userId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(userId);
      this.debugLog('stopPolling', { userId, intervalId });
    }
  }

  static stopAllPolling(): void {
    this.pollingIntervals.forEach((intervalId, userId) => {
      clearInterval(intervalId);
      this.debugLog('stopAllPolling - stopped', { userId, intervalId });
    });
    this.pollingIntervals.clear();
    this.debugLog('stopAllPolling - all stopped');
  }

  // ✅ FIX: Improved convertFromBackend
  private static convertFromBackend(backendNotif: BackendNotification): Notification {
    // Validasi ID sebelum konversi
    const validId = backendNotif.notification_id && !isNaN(backendNotif.notification_id) && backendNotif.notification_id > 0 ? backendNotif.notification_id.toString() : `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: validId,
      userId: backendNotif.user_id ? backendNotif.user_id.toString() : 'broadcast',
      type: backendNotif.type,
      title: backendNotif.title || 'No Title',
      message: backendNotif.message || 'No Message',
      read: Boolean(backendNotif.read),
      category: backendNotif.category || undefined,
      timestamp: new Date(backendNotif.created_at),
      metadata: backendNotif.metadata || {},
      expires_at: backendNotif.expires_at ? new Date(backendNotif.expires_at) : undefined,
    };
  }

  static async cleanupExpiredNotifications(): Promise<void> {
    try {
      this.debugLog('cleanupExpiredNotifications');

      const response = await fetch(`${this.baseUrl}/cleanup-expired`, {
        method: 'POST',
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
    console.log('Last updated:', store.lastUpdated);

    if (userId) {
      const userNotifications = store.getNotificationsByUser(userId);
      const broadcastNotifications = store.getBroadcastNotifications();
      const allForUser = store.getAllNotificationsForUser(userId);

      console.log(`Notifications for user ${userId}:`, userNotifications.length);
      console.log(`Broadcast notifications:`, broadcastNotifications.length);
      console.log(`All notifications for user:`, allForUser.length);

      const logoutNotifications = allForUser.filter((n) => n.metadata?.activity_type === 'logout' || n.title.toLowerCase().includes('logout'));
      console.log('Logout notifications found:', logoutNotifications);
    }

    console.log('All notifications:', store.notifications);
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
