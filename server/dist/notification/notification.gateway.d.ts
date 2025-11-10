import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly notificationService;
    server: Server;
    private readonly logger;
    constructor(notificationService: NotificationService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    findAll(): Promise<{
        event: string;
        data: import("./entities/notification.entity").Notification[];
    } | {
        event: string;
        data: string;
    }>;
    findOne(data: {
        notification_id: number;
    }): Promise<{
        event: string;
        data: import("./entities/notification.entity").Notification;
    } | {
        event: string;
        data: string;
    }>;
    update(updateData: {
        notification_id: number;
        data: UpdateNotificationDto;
    }): Promise<{
        event: string;
        data: import("./entities/notification.entity").Notification;
    } | {
        event: string;
        data: string;
    }>;
    remove(data: {
        notification_id: number;
    }): Promise<{
        event: string;
        data: {
            success: boolean;
        };
    } | {
        event: string;
        data: string;
    }>;
    markAsRead(data: {
        notification_id: number;
    }): Promise<{
        event: string;
        data: import("./entities/notification.entity").Notification;
    } | {
        event: string;
        data: string;
    }>;
    create(createNotificationDto: CreateNotificationDto): Promise<{
        event: string;
        data: import("./entities/notification.entity").Notification;
    } | {
        event: string;
        data: string;
    }>;
    getUserNotifications(data: {
        userId: string;
        unreadOnly?: boolean;
    }): Promise<{
        event: string;
        data: {
            notifications: import("./entities/notification.entity").Notification[];
            total: number;
        };
    } | {
        event: string;
        data: string;
    }>;
    getUnreadCount(data: {
        userId: string;
    }): Promise<{
        event: string;
        data: {
            count: number;
        };
    } | {
        event: string;
        data: string;
    }>;
}
