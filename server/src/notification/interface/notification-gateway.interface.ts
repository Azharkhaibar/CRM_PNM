import { Notification } from '../entities/notification.entity';
import { Server } from 'socket.io';
export interface INotificationGateway {
  sendNotificationToUser(userId: number | null, notification: Notification);
  sendNotificationToAll(notification: Notification); // ⬅️ tambahkan ini
}
