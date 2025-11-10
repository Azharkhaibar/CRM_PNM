import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
export declare class NotificationService {
    private readonly notificationRepo;
    private readonly logger;
    constructor(notificationRepo: Repository<Notification>);
    findAll(): Promise<Notification[]>;
    findOne(notification_id: number): Promise<Notification>;
    create(crDto: CreateNotificationDto): Promise<Notification>;
    update(notification_id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    markAllAsRead(user_id: number): Promise<void>;
    createMultiple(crDto: CreateNotificationDto[]): Promise<Notification[]>;
    findByUser(user_id: number, options?: {
        unreadOnly?: boolean;
        limit?: number;
        page?: number;
    }): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    markAsRead(notification_id: number): Promise<Notification>;
    getUnreadCount(user_id: number): Promise<number>;
    remove(notification_id: number): Promise<void>;
    removeExpired(): Promise<void>;
    getRecentUserNotifications(user_id: number, hours?: number): Promise<Notification[]>;
}
