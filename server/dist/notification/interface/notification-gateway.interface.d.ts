import { Notification } from '../entities/notification.entity';
export interface INotificationGateway {
    sendNotificationToUser(userId: number, notification: Notification): void;
    sendNotificationToAll(notification: Notification): void;
}
