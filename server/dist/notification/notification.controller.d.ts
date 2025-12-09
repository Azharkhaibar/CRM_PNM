import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserStatusDto } from './dto/user-status.dto';
import { NotificationGateway } from './notification.gateway';
export declare class NotificationController {
    private readonly notificationService;
    private readonly notificationGateway;
    private readonly logger;
    constructor(notificationService: NotificationService, notificationGateway: NotificationGateway);
    findAll(): Promise<import("./entities/notification.entity").Notification[]>;
    findByUser(user_id: number, unreadOnly?: string, limit?: number, page?: number): Promise<{
        notifications: import("./entities/notification.entity").Notification[];
        total: number;
    }>;
    getAllForUser(user_id: number, unreadOnly?: string, limit?: number, page?: number): Promise<{
        notifications: import("./entities/notification.entity").Notification[];
        total: number;
    }>;
    getUnreadCount(user_id: number): Promise<{
        count: number;
    }>;
    getBroadcastNotifications(unreadOnly?: string, limit?: number, page?: number): Promise<{
        notifications: import("./entities/notification.entity").Notification[];
        total: number;
    }>;
    findOne(id: number): Promise<import("./entities/notification.entity").Notification>;
    create(createNotificationDto: CreateNotificationDto): Promise<import("./entities/notification.entity").Notification>;
    createMultiple(createNotificationDtos: CreateNotificationDto[]): Promise<import("./entities/notification.entity").Notification[]>;
    broadcast(dto: CreateNotificationDto): Promise<import("./entities/notification.entity").Notification>;
    userStatusNotification(userStatusDto: UserStatusDto): Promise<import("./entities/notification.entity").Notification>;
    update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<import("./entities/notification.entity").Notification>;
    markAsRead(id: number): Promise<import("./entities/notification.entity").Notification>;
    markAllAsRead(user_id: number): Promise<{
        success: boolean;
        message: string;
        user_id: number;
    }>;
    getRecentUserNotifications(user_id: number, hours?: number): Promise<import("./entities/notification.entity").Notification[]>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
        notification_id: number;
    }>;
    removeExpired(): Promise<{
        success: boolean;
        message: string;
    }>;
}
