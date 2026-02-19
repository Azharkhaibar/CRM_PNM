import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private readonly clients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    sendNotificationToUser(userId: number, payload: any): boolean;
    sendNotificationToAll(payload: any): void;
    broadcastUserStatus(userId: number, status: 'online' | 'offline'): void;
    sendToUser(userId: number, payload: any): void;
    sendToAll(payload: any): void;
    emitLoginEvent(userId: number, meta: any): void;
    emitLogoutEvent(userId: number, meta: any): void;
    private verifyToken;
}
