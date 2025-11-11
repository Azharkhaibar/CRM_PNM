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
    sendNotificationToUser(userId: number, notification: any): Promise<void>;
    handleJoinUser(client: Socket, userId: number): void;
    handleGetAllNotifications(client: Socket): Promise<void>;
    handleGetNotification(client: Socket, data: {
        notification_id: number;
    }): Promise<void>;
    handleUpdateNotification(client: Socket, data: {
        notification_id: number;
        updates: UpdateNotificationDto;
    }): Promise<void>;
    handleDeleteNotification(client: Socket, data: {
        notification_id: number;
    }): Promise<void>;
    handleMarkAsRead(client: Socket, data: {
        notification_id: number;
    }): Promise<void>;
    handleCreateNotification(client: Socket, data: CreateNotificationDto): Promise<void>;
    handleGetUserNotifications(client: Socket, data: {
        user_id: number;
        unreadOnly?: boolean;
        limit?: number;
        page?: number;
    }): Promise<void>;
    handleGetUnreadCount(client: Socket, data: {
        user_id: number;
    }): Promise<void>;
    broadcastToUser(user_id: number, event: string, data: any): Promise<void>;
    handleJoinUserRoom(client: Socket, data: {
        user_id: number;
    }): void;
    handleLeaveUserRoom(client: Socket, data: {
        user_id: number;
    }): void;
}
