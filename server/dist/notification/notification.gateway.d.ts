import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationGateway } from './interface/notification-gateway.interface';
import { Notification } from './entities/notification.entity';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect, INotificationGateway {
    private readonly notificationService;
    server: Server;
    private readonly userSockets;
    private readonly logger;
    constructor(notificationService: NotificationService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private getUsername;
    private triggerUserOfflineNotification;
    registerUserSocket(userId: number, client: Socket): void;
    handleGetUserNotifications(client: Socket, data: {
        user_id: number;
        options?: any;
    }): Promise<void>;
    sendNotificationToUser(userId: number, notification: Notification): void;
    sendNotificationToAll(notification: Notification): void;
    handleAuthenticate(client: Socket, userId: number): Promise<void>;
    handleCreateNotification(client: Socket, data: CreateNotificationDto): Promise<void>;
    handleUserLogout(client: Socket, userId: number): Promise<void>;
    handleUpdateNotification(client: Socket, data: {
        notification_id: number;
        updates: UpdateNotificationDto;
    }): Promise<void>;
    handleMarkAsRead(client: Socket, notification_id: number): Promise<void>;
    handleMarkAllAsRead(client: Socket, user_id: number): Promise<void>;
}
