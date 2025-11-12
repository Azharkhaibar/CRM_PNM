import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationGateway } from './interface/notification-gateway.interface';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, INotificationGateway
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendNotificationToUser(userId: number, notification: Notification) {
    this.server.emit('notification', notification); 
    this.logger.log(`📩 Sent notification to user ${userId}`);
  }

  sendNotificationToAll(notification: Notification) {
    this.server.emit('notification', notification);
    this.logger.log('📢 Broadcast notification to all connected clients');
  }

  @SubscribeMessage('createNotification')
  async handleCreateNotification(client: Socket, data: CreateNotificationDto) {
    try {
      const notification = await this.notificationService.create(data);
      this.sendNotificationToUser(notification.user_id, notification);
      this.sendNotificationToAll(notification);
      client.emit('notificationCreated', notification);
    } catch (error) {
      this.logger.error('Failed to create notification', error);
      client.emit('error', { message: 'Failed to create notification' });
    }
  }

  @SubscribeMessage('updateNotification')
  async handleUpdateNotification(
    client: Socket,
    data: { notification_id: number; updates: UpdateNotificationDto },
  ) {
    try {
      const updated = await this.notificationService.update(
        data.notification_id,
        data.updates,
      );
      this.sendNotificationToUser(updated.user_id, updated);
      this.sendNotificationToAll(updated);
    } catch (error) {
      this.logger.error('Failed to update notification', error);
      client.emit('error', { message: 'Failed to update notification' });
    }
  }
}
