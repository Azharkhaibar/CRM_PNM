import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FindByUserOptions, FindBroadcastOptions } from './interface/find-options.interface';
import { NotificationGateway } from './notification.gateway';
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly notificationGateway;
    private readonly logger;
    constructor(notificationRepository: Repository<Notification>, notificationGateway: NotificationGateway);
    private buildRealtimePayload;
    private trySendRealtime;
    findAll(): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    findOne(notification_id: number): Promise<Notification>;
    create(dto: CreateNotificationDto): Promise<Notification>;
    update(notification_id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    markAsRead(notification_id: number): Promise<Notification>;
    markAllAsRead(user_id: number): Promise<void>;
    getUnreadCount(user_id: number): Promise<number>;
    findByUser(user_id: number, options?: FindByUserOptions): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    findBroadcastNotifications(options?: FindBroadcastOptions): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    getAllForUser(user_id: number, options?: FindByUserOptions): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    createMultiple(createDtos: CreateNotificationDto[]): Promise<Notification[]>;
    getRecentUserNotifications(user_id: number, hours?: number): Promise<Notification[]>;
    findAllForUser(user_id: number, options?: FindByUserOptions): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    remove(notification_id: number): Promise<void>;
    removeExpired(): Promise<void>;
    cleanupOldNotifications(days?: number): Promise<void>;
}
