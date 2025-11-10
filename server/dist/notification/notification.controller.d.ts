import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getMyNotifications(userID: string, unreadOnly?: boolean, limit?: number, page?: number): Promise<{
        notifications: import("./entities/notification.entity").Notification[];
        total: number;
    }>;
    getMyUnreadCount(userID: string): Promise<{
        count: number;
    }>;
    markAsRead(id: number): Promise<import("./entities/notification.entity").Notification>;
    markAllAsRead(userID: string): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    create(dto: CreateNotificationDto): Promise<import("./entities/notification.entity").Notification>;
}
