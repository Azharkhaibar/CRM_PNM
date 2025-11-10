import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
export declare class NotificationService {
    private readonly notificationRepo;
    constructor(notificationRepo: Repository<Notification>);
    private readonly logger;
    findAll(): Promise<Notification[]>;
    findOne(notification_id: number): Promise<Notification>;
    update(notification_id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    create(crDto: CreateNotificationDto): Promise<Notification>;
    createMultiple(crDto: CreateNotificationDto[]): Promise<Notification[]>;
    findByUser(userId: string, options?: {
        unreadOnly?: boolean;
        limit?: number;
        page?: number;
    }): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    markAsRead(notification_id: number): Promise<Notification>;
    getUnreadCount(userId: string): Promise<number>;
    remove(notification_id: number): Promise<void>;
    removeExpired(): Promise<void>;
    getRecentUserNotifications(userId: string, hours?: number): Promise<Notification[]>;
}
