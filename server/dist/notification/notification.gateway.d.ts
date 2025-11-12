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
    private readonly logger;
    constructor(notificationService: NotificationService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    sendNotificationToUser(userId: number, notification: Notification): void;
    sendNotificationToAll(notification: Notification): void;
    handleCreateNotification(client: Socket, data: CreateNotificationDto): Promise<void>;
    handleUpdateNotification(client: Socket, data: {
        notification_id: number;
        updates: UpdateNotificationDto;
    }): Promise<void>;
}
