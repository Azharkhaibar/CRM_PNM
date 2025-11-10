export class CreateNotificationDto {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  metadata?: any;
  category?: string;
  expiresAt?: Date;
}
