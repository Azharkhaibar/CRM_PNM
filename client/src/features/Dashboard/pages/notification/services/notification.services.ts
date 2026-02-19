// notification.services.ts - FIXED VERSION
import { Notification, useNotificationStore, BackendNotification as StoreBackendNotification } from '../stores/notification.stores';

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

export interface CreateNotificationDto {
  user_id?: number | null;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  category?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

export interface FindNotificationsOptions {
  unreadOnly?: boolean;
  limit?: number;
  page?: number;
}

export class NotificationService {
  // ✅ BACKEND PORT 5530 - Sesuai dengan backend
  private static baseUrl = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5530'}/notifications`;
  private static wsUrl = import.meta.env.VITE_WS_URL ?? 'ws://localhost:5530';
  private static socket: any = null;
  private static isConnecting = false;

  // Instance-specific properties
  private instanceId: string;
  private instanceListeners = new Map<string, Function[]>();
  private pollingIntervalId: number | null = null;

  constructor(instanceId?: string) {
    this.instanceId = instanceId || `instance-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  // ==================== STATIC METHODS ====================
  private static debugLog(action: string, data?: any) {
    if (import.meta.env.DEV) {
      console.log(`🔔 [NotificationService] ${action}:`, data || '');
    }
  }

  private static errorLog(action: string, error: any, context?: any) {
    console.error(`🔔 [NotificationService] ERROR in ${action}:`, error, context || '');
  }

  // ==================== JWT HANDLING ====================
  private static decodeJWT(token: string): { userId?: number; sub?: string } | null {
    try {
      // Base64 URL decode
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      return JSON.parse(decoded);
    } catch (error) {
      this.errorLog('decodeJWT', error);
      return null;
    }
  }

  private static getUserIdFromToken(token: string): number | null {
    try {
      const payload = this.decodeJWT(token);
      if (!payload) return null;

      // Support both 'sub' and 'userId' claims
      const userId = payload.userId || payload.sub;
      if (!userId) return null;

      const numId = Number(userId);
      return isNaN(numId) ? null : numId;
    } catch {
      return null;
    }
  }

  // ==================== CONVERSION ====================
  private static convertFromBackend(backendNotif: BackendNotification): Notification {
    const isBroadcast = backendNotif.user_id === null;

    return {
      id: backendNotif.notification_id.toString(),
      userId: isBroadcast ? 'broadcast' : backendNotif.user_id!.toString(),
      type: backendNotif.type,
      title: backendNotif.title,
      message: backendNotif.message,
      // Mode A: Broadcast selalu read = true
      read: isBroadcast ? true : backendNotif.read,
      category: backendNotif.category || undefined,
      timestamp: new Date(backendNotif.created_at),
      metadata: backendNotif.metadata || {},
      expires_at: backendNotif.expires_at ? new Date(backendNotif.expires_at) : undefined,
    };
  }

  private static ensureNotificationArray(backendNotifications: BackendNotification[]): Notification[] {
    return backendNotifications.map((notif) => this.convertFromBackend(notif));
  }

  // ==================== STATIC HELPER METHODS ====================
  static async createLoginNotification(userId: number, username: string): Promise<Notification> {
    try {
      const service = new NotificationService(`login-${userId}`);
      return await service.create({
        user_id: userId,
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${username}!`,
        category: 'security',
        metadata: {
          activity_type: 'login',
          action: 'login',
          user_id: userId,
          username: username,
          login_time: new Date().toISOString(),
        },
      });
    } catch (error) {
      this.errorLog('createLoginNotification', error, { userId, username });
      throw error;
    }
  }

  static async createLogoutNotification(userId: number, username: string): Promise<Notification> {
    try {
      const service = new NotificationService(`logout-${userId}`);
      return await service.create({
        user_id: userId,
        type: 'info',
        title: 'Logout Successful',
        message: `You have successfully logged out.`,
        category: 'security',
        metadata: {
          activity_type: 'logout',
          action: 'logout',
          user_id: userId,
          username: username,
          logout_time: new Date().toISOString(),
        },
      });
    } catch (error) {
      this.errorLog('createLogoutNotification', error, { userId, username });
      throw error;
    }
  }

  static async createUserStatusBroadcast(userId: number, username: string, action: 'login' | 'logout'): Promise<Notification> {
    try {
      const service = new NotificationService(`broadcast-${action}-${userId}`);
      return await service.create({
        user_id: null, // Broadcast
        type: action === 'login' ? 'success' : 'info',
        title: action === 'login' ? 'User Logged In' : 'User Logged Out',
        message: action === 'login' ? `${username} has logged into the system.` : `${username} has logged out of the system.`,
        category: 'system',
        metadata: {
          activity_type: 'user_status',
          action: action,
          user_id: userId,
          username: username,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      this.errorLog('createUserStatusBroadcast', error, { userId, username, action });
      throw error;
    }
  }

  // ==================== INSTANCE METHODS ====================
  async connectSocket(token: string): Promise<void> {
    if (NotificationService.isConnecting || NotificationService.socket?.connected) {
      NotificationService.debugLog('Socket already connecting/connected');
      return;
    }

    if (typeof window === 'undefined') {
      NotificationService.debugLog('Skipping WebSocket on server side');
      return;
    }

    NotificationService.isConnecting = true;

    try {
      const io = await this.getSocketIO();
      if (!io) {
        throw new Error('Socket.io client not available');
      }

      NotificationService.socket = io(`${NotificationService.wsUrl}`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        path: '/socket.io',
        query: { token },
      });

      // Set up global socket listeners
      this.setupSocketListeners();

      NotificationService.debugLog('WebSocket connection initiated', { instanceId: this.instanceId });
    } catch (error) {
      NotificationService.isConnecting = false;
      NotificationService.errorLog('connectSocket', error, { instanceId: this.instanceId });

      // Fallback ke polling
      const userId = NotificationService.getUserIdFromToken(token);
      if (userId) {
        this.startPolling(userId);
      }

      throw error;
    }
  }

  private async getSocketIO() {
    if (typeof window === 'undefined') return null;

    try {
      const socketModule = await import('socket.io-client');
      return socketModule.default || socketModule.io;
    } catch (error) {
      NotificationService.errorLog('getSocketIO', error);
      return null;
    }
  }

  private setupSocketListeners() {
    if (!NotificationService.socket) return;

    NotificationService.socket.on('connect', () => {
      NotificationService.isConnecting = false;
      NotificationService.debugLog('WebSocket connected', {
        socketId: NotificationService.socket?.id,
        instanceId: this.instanceId,
      });
      this.emitEvent('connected');
    });

    NotificationService.socket.on('notification', (data: any) => {
      const converted = NotificationService.convertFromBackend(data);
      useNotificationStore.getState().addNotification(converted);
      this.emitEvent('notification', converted);
    });

    NotificationService.socket.on('notification:broadcast', (data: any) => {
      const converted = NotificationService.convertFromBackend(data);
      useNotificationStore.getState().addNotification(converted);
      this.emitEvent('broadcast', converted);
    });

    NotificationService.socket.on('disconnect', (reason: string) => {
      NotificationService.debugLog('WebSocket disconnected', {
        reason,
        instanceId: this.instanceId,
      });
      this.emitEvent('disconnected', { reason });
    });

    NotificationService.socket.on('connect_error', (error: Error) => {
      NotificationService.isConnecting = false;
      NotificationService.errorLog('WebSocket connection error', error, { instanceId: this.instanceId });
      this.emitEvent('connection-error', error);
    });
  }

  disconnectSocket(): void {
    if (NotificationService.socket) {
      NotificationService.socket.disconnect();
      NotificationService.socket = null;
      NotificationService.debugLog('WebSocket disconnected', { instanceId: this.instanceId });
    }
    NotificationService.isConnecting = false;
  }

  // ==================== EVENT SYSTEM ====================
  on(event: string, callback: Function) {
    if (!this.instanceListeners.has(event)) {
      this.instanceListeners.set(event, []);
    }
    this.instanceListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.instanceListeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emitEvent(event: string, data?: any) {
    const eventListeners = this.instanceListeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          NotificationService.errorLog(`Event listener for ${event}`, error, { instanceId: this.instanceId });
        }
      });
    }
  }

  // ==================== REST API METHODS ====================
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('access_token');
    const url = `${NotificationService.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      NotificationService.errorLog('makeRequest', error, { endpoint, instanceId: this.instanceId });
      throw error;
    }
  }

  async getAll(options?: FindNotificationsOptions): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());

      const endpoint = params.toString() ? `?${params.toString()}` : '';
      const data = await this.makeRequest<{ notifications: BackendNotification[] }>(endpoint);

      return NotificationService.ensureNotificationArray(data.notifications);
    } catch (error) {
      NotificationService.errorLog('getAll', error, { options, instanceId: this.instanceId });
      throw error;
    }
  }

  async getUserNotifications(userId: number, options?: FindNotificationsOptions): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());

      const endpoint = `/user/${userId}${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await this.makeRequest<{ notifications: BackendNotification[] }>(endpoint);

      return NotificationService.ensureNotificationArray(data.notifications);
    } catch (error) {
      NotificationService.errorLog('getUserNotifications', error, { userId, options, instanceId: this.instanceId });

      // Fallback ke store lokal
      if (import.meta.env.DEV) {
        const store = useNotificationStore.getState();
        const notifications = store.getUserSpecificNotifications(userId.toString());
        return options?.unreadOnly ? notifications.filter((n) => !n.read && n.userId !== 'broadcast') : notifications;
      }

      throw error;
    }
  }

  async getBroadcastNotifications(options?: FindNotificationsOptions): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());

      const endpoint = `/broadcast${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await this.makeRequest<{ notifications: BackendNotification[] }>(endpoint);

      return NotificationService.ensureNotificationArray(data.notifications);
    } catch (error) {
      NotificationService.errorLog('getBroadcastNotifications', error, { options, instanceId: this.instanceId });
      throw error;
    }
  }

  async getOne(notificationId: number): Promise<Notification> {
    try {
      const data = await this.makeRequest<BackendNotification>(`/${notificationId}`);
      return NotificationService.convertFromBackend(data);
    } catch (error) {
      NotificationService.errorLog('getOne', error, { notificationId, instanceId: this.instanceId });
      throw error;
    }
  }

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    try {
      // Format payload sesuai dengan backend
      const payload: any = {
        ...createDto,
        expires_at: createDto.expiresAt,
      };

      // Remove expiresAt as it's already mapped to expires_at
      delete payload.expiresAt;

      const data = await this.makeRequest<BackendNotification>('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const converted = NotificationService.convertFromBackend(data);
      useNotificationStore.getState().addNotification(converted);
      return converted;
    } catch (error) {
      NotificationService.errorLog('create', error, { createDto, instanceId: this.instanceId });
      throw error;
    }
  }

  async update(notificationId: number, updateDto: Partial<CreateNotificationDto>): Promise<Notification> {
    try {
      // Pastikan tidak mengoverwrite ID
      const safeUpdateDto = { ...updateDto };
      delete (safeUpdateDto as any).notification_id;
      delete (safeUpdateDto as any).id;

      const data = await this.makeRequest<BackendNotification>(`/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(safeUpdateDto),
      });

      const converted = NotificationService.convertFromBackend(data);
      useNotificationStore.getState().updateNotification(notificationId.toString(), converted);
      return converted;
    } catch (error) {
      NotificationService.errorLog('update', error, { notificationId, updateDto, instanceId: this.instanceId });
      throw error;
    }
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const data = await this.makeRequest<BackendNotification>(`/${notificationId}/read`, {
        method: 'PATCH',
      });

      const converted = NotificationService.convertFromBackend(data);

      // Mode A: Broadcast tidak bisa di-mark as read
      if (converted.userId !== 'broadcast') {
        useNotificationStore.getState().markAsRead(notificationId.toString());
      }

      return converted;
    } catch (error) {
      NotificationService.errorLog('markAsRead', error, { notificationId, instanceId: this.instanceId });
      throw error;
    }
  }

  async markAllAsRead(userId: number): Promise<void> {
    try {
      await this.makeRequest<void>(`/user/${userId}/mark-all-read`, {
        method: 'PATCH',
      });

      // Sync dengan backend - cukup panggil syncWithBackendData
      const notifications = await this.getUserNotifications(userId);
      const backendNotifications: StoreBackendNotification[] = notifications.map((notif) => ({
        notification_id: parseInt(notif.id),
        user_id: notif.userId === 'broadcast' ? null : parseInt(notif.userId),
        type: notif.type,
        title: notif.title,
        message: notif.message,
        read: true, // Semua sudah dibaca
        metadata: notif.metadata || null,
        category: notif.category || null,
        created_at: notif.timestamp.toISOString(),
        expires_at: notif.expires_at?.toISOString() || null,
      }));

      useNotificationStore.getState().syncWithBackendData(backendNotifications, false);
    } catch (error) {
      NotificationService.errorLog('markAllAsRead', error, { userId, instanceId: this.instanceId });
      throw error;
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    try {
      const data = await this.makeRequest<{ count: number }>(`/user/${userId}/unread-count`);
      return data.count;
    } catch (error) {
      NotificationService.errorLog('getUnreadCount', error, { userId, instanceId: this.instanceId });
      const store = useNotificationStore.getState();
      return store.getUnreadByUser(userId.toString());
    }
  }

  async getAllForUser(userId: number, options?: FindNotificationsOptions): Promise<Notification[]> {
    try {
      const [userNotifications, broadcastNotifications] = await Promise.allSettled([this.getUserNotifications(userId, options), this.getBroadcastNotifications(options)]);

      const user = userNotifications.status === 'fulfilled' ? userNotifications.value : [];
      const broadcast = broadcastNotifications.status === 'fulfilled' ? broadcastNotifications.value : [];

      return [...user, ...broadcast].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      NotificationService.errorLog('getAllForUser', error, { userId, options, instanceId: this.instanceId });
      throw error;
    }
  }

  async delete(notificationId: number): Promise<void> {
    try {
      await this.makeRequest<void>(`/${notificationId}`, {
        method: 'DELETE',
      });

      useNotificationStore.getState().removeNotification(notificationId.toString());
    } catch (error) {
      NotificationService.errorLog('delete', error, { notificationId, instanceId: this.instanceId });
      throw error;
    }
  }

  // ==================== POLLING ====================
  startPolling(userId: number, interval: number = 30000, options?: FindNotificationsOptions): void {
    if (typeof window === 'undefined') return;

    // Hentikan polling sebelumnya
    this.stopPolling();

    const poll = async () => {
      try {
        const result = await this.getUserNotifications(userId, options);
        NotificationService.debugLog('Polling completed', {
          userId,
          count: result.length,
          instanceId: this.instanceId,
        });

        const store = useNotificationStore.getState();
        result.forEach((notif) => {
          if (!store.findNotificationById(notif.id)) {
            store.addNotification(notif);
          }
        });
      } catch (error) {
        NotificationService.errorLog('Polling error', error, { userId, instanceId: this.instanceId });
      }
    };

    // Poll pertama kali
    poll();

    // Set interval
    this.pollingIntervalId = window.setInterval(poll, interval);
    NotificationService.debugLog('Polling started', {
      userId,
      interval,
      instanceId: this.instanceId,
    });
  }

  stopPolling(): void {
    if (this.pollingIntervalId !== null) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
      NotificationService.debugLog('Polling stopped', { instanceId: this.instanceId });
    }
  }

  // ==================== CLEANUP ====================
  cleanup(): void {
    this.stopPolling();
    this.instanceListeners.clear();
    NotificationService.debugLog('Instance cleaned up', { instanceId: this.instanceId });

    // Don't disconnect socket here - let auth hook handle global socket
  }

  // ==================== STATIC CLEANUP ====================
  static cleanupAll(): void {
    if (NotificationService.socket) {
      NotificationService.socket.disconnect();
      NotificationService.socket = null;
    }
    NotificationService.isConnecting = false;
    NotificationService.debugLog('All instances cleaned up');
  }
}
