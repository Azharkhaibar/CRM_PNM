import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationGateway } from './notification.gateway';
export interface FindByUserOptions {
    unreadOnly?: boolean;
    limit?: number;
    page?: number;
}
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly gateway;
    private readonly logger;
    constructor(notificationRepository: Repository<Notification>, gateway: NotificationGateway);
    findAll(): Promise<Notification[]>;
    findOne(notification_id: number): Promise<Notification>;
    create(createDto: CreateNotificationDto): Promise<Notification>;
    update(notification_id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    markAllAsRead(user_id: number): Promise<void>;
    createMultiple(createDtos: CreateNotificationDto[]): Promise<Notification[]>;
    findByUser(user_id: number, options?: FindByUserOptions): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    markAsRead(notification_id: number): Promise<Notification>;
    getUnreadCount(user_id: number): Promise<number>;
    remove(notification_id: number): Promise<void>;
    removeExpired(): Promise<void>;
    getRecentUserNotifications(user_id: number, hours?: number): Promise<Notification[]>;
}
