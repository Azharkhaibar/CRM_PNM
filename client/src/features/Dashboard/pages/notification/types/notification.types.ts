export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system',
}

export interface BaseNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  category?: string;
  metadata?: Record<string, any> | null;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationWithAction extends BaseNotification {
  action: NotificationAction;
}

export type Notification = BaseNotification | NotificationWithAction;

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<string, number>;
}

export interface NotificationFilters {
  type?: NotificationType;
  category?: string;
  read?: boolean;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}
