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
  private readonly userSockets = new Map<number, Socket[]>();

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.registerUserSocket(userId, client);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      const index = sockets.indexOf(client);
      if (index !== -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          this.userSockets.delete(userId);
          void this.triggerUserOfflineNotification(userId);
        }
        break;
      }
    }
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  private async getUsername(userId: number): Promise<string> {
    const user = await this.notificationService.findByUserId(userId);
    return user?.userID ?? `User-${userId}`;
  }
  private async triggerUserOfflineNotification(userId: number) {
    try {
      await this.notificationService.notifyUserStatusChange(
        userId,
        await this.getUsername(userId),
        'offline',
      );
      this.logger.log(`Offline notification triggered for user ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to trigger offline notification for user ${userId}`,
        error,
      );
    }
  }

  registerUserSocket(userId: number, client: Socket): void {
    const sockets = this.userSockets.get(userId) ?? [];
    sockets.push(client);
    this.userSockets.set(userId, sockets);
    // if (!this.userSockets.has(userId)) {
    //   this.userSockets.set(userId, []);
    // }
    // const userSockets = this.userSockets.get(userId);
    // if (userSockets) {
    //   userSockets.push(client);
    // }
    // this.logger.log(`User ${userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('getUserNotifications')
  async handleGetUserNotifications(
    client: Socket,
    data: { user_id: number; options?: any },
  ) {
    try {
      const { notifications, total } =
        await this.notificationService.findAllForUser(
          data.user_id,
          data.options,
        );
      client.emit('userNotifications', { notifications, total });
    } catch (error) {
      this.logger.error('Failed to get user notifications', error);
      client.emit('error', { message: 'Failed to get notifications' });
    }
  }

  sendNotificationToUser(userId: number, notification: Notification): void {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;
    sockets.forEach((s) => s.emit('notification', notification));
  }

  sendNotificationToAll(notification: Notification) {
    this.server.emit('notification:broadcast', notification);
  }

  // Tambahkan event untuk user authentication
  @SubscribeMessage('authenticate')
  async handleAuthenticate(client: Socket, userId: number) {
    this.registerUserSocket(userId, client);

    // ✅ TRIGGER ONLINE NOTIFICATION
    try {
      await this.notificationService.notifyUserStatusChange(
        userId,
        await this.getUsername(userId),
        'online',
      );
    } catch (error) {
      this.logger.error('Failed to send online notification', error);
    }

    client.emit('authenticated', { success: true });
    this.logger.log(`User ${userId} authenticated with socket ${client.id}`);
  }

  @SubscribeMessage('createNotification')
  async handleCreateNotification(client: Socket, data: CreateNotificationDto) {
    try {
      const notification = await this.notificationService.create(data);
      client.emit('notificationCreated', notification);
    } catch (error) {
      this.logger.error('Failed to create notification', error);
      client.emit('error', { message: 'Failed to create notification' });
    }
  }

  // event logout

  @SubscribeMessage('userLogout')
  async handleUserLogout(client: Socket, userId: number) {
    try {
      await this.notificationService.notifyUserStatusChange(
        userId,
        await this.getUsername(userId),
        'offline',
      );
      client.emit('logoutSuccess', { success: true });
      this.logger.log(`Manual logout notification for user ${userId}`);
    } catch (error) {
      this.logger.error('Failed to send logout notification', error);
      client.emit('error', { message: 'Failed to process logout' });
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
      client.emit('notificationUpdated', updated);
    } catch (error) {
      this.logger.error('Failed to update notification', error);
      client.emit('error', { message: 'Failed to update notification' });
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(client: Socket, notification_id: number) {
    try {
      const updated =
        await this.notificationService.markAsRead(notification_id);
      client.emit('notificationMarkedRead', updated);
    } catch (error) {
      this.logger.error('Failed to mark notification as read', error);
      client.emit('error', { message: 'Failed to mark as read' });
    }
  }

  @SubscribeMessage('markAllAsRead')
  async handleMarkAllAsRead(client: Socket, user_id: number) {
    try {
      await this.notificationService.markAllAsRead(user_id);
      client.emit('allNotificationsMarkedRead', { success: true });
    } catch (error) {
      this.logger.error('Failed to mark all as read', error);
      client.emit('error', { message: 'Failed to mark all as read' });
    }
  }
}
