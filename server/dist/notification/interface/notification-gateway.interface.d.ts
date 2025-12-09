import { Notification } from '../entities/notification.entity';
export interface INotificationGateway {
    sendNotificationToUser(userId: number | null, notification: Notification): any;
    sendNotificationToAll(notification: Notification): any;
}
