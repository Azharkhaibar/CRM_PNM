import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserStatusDto } from './dto/user-status.dto';
export declare class NotificationController {
    private readonly notificationService;
    private readonly logger;
    constructor(notificationService: NotificationService);
    findAll(): Promise<import("./entities/notification.entity").Notification[]>;
    findByUser(user_id: number, unreadOnly?: string, limit?: string, page?: string): Promise<{
        notifications: import("./entities/notification.entity").Notification[];
        total: number;
    }>;
    getUnreadCount(user_id: number): Promise<{
        count: number;
    }>;
    findOne(id: number): Promise<import("./entities/notification.entity").Notification>;
    create(createNotificationDto: CreateNotificationDto): Promise<import("./entities/notification.entity").Notification>;
    createMultiple(createNotificationDtos: CreateNotificationDto[]): Promise<import("./entities/notification.entity").Notification[]>;
    update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<import("./entities/notification.entity").Notification>;
    markAsRead(id: number): Promise<import("./entities/notification.entity").Notification>;
    userStatusNotification(body: UserStatusDto): Promise<void>;
    markAllAsRead(user_id: number): Promise<{
        message: string;
    }>;
    getRecentUserNotifications(user_id: number, hours?: string): Promise<import("./entities/notification.entity").Notification[]>;
    remove(id: number): Promise<{
        message: string;
    }>;
    removeExpired(): Promise<{
        message: string;
    }>;
}
