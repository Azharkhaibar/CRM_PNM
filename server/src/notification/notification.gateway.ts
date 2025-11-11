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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
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

  async sendNotificationToUser(userId: number, notification: any) {
    this.server.to(`user-${userId}`).emit('notification', notification);
  }

  @SubscribeMessage('joinUser')
  handleJoinUser(client: Socket, userId: number) {
    client.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  }

  @SubscribeMessage('getAllNotifications')
  async handleGetAllNotifications(client: Socket) {
    try {
      const notifications = await this.notificationService.findAll();
      client.emit('allNotifications', notifications);
    } catch (error) {
      this.logger.error('Failed to fetch all notifications', error);
      client.emit('error', { message: 'Failed to fetch notifications' });
    }
  }

  @SubscribeMessage('getNotification')
  async handleGetNotification(
    client: Socket,
    data: { notification_id: number },
  ) {
    try {
      const notification = await this.notificationService.findOne(
        data.notification_id,
      );
      client.emit('notification', notification);
    } catch (error) {
      this.logger.error(
        `Failed to fetch notification ${data.notification_id}`,
        error,
      );
      client.emit('error', { message: 'Failed to fetch notification' });
    }
  }

  @SubscribeMessage('updateNotification')
  async handleUpdateNotification(
    client: Socket,
    data: { notification_id: number; updates: UpdateNotificationDto },
  ) {
    try {
      const notification = await this.notificationService.update(
        data.notification_id,
        data.updates,
      );
      client.emit('notificationUpdated', notification);
      this.server.emit('notificationChanged', notification);
    } catch (error) {
      this.logger.error(
        `Failed to update notification ${data.notification_id}`,
        error,
      );
      client.emit('error', { message: 'Failed to update notification' });
    }
  }

  @SubscribeMessage('deleteNotification')
  async handleDeleteNotification(
    client: Socket,
    data: { notification_id: number },
  ) {
    try {
      await this.notificationService.remove(Number(data.notification_id));
      client.emit('notificationDeleted', {
        notification_id: data.notification_id,
      });
      this.server.emit('notificationChanged', {
        notification_id: data.notification_id,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete notification ${data.notification_id}`,
        error,
      );
      client.emit('error', { message: 'Failed to delete notification' });
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(client: Socket, data: { notification_id: number }) {
    try {
      const notification = await this.notificationService.markAsRead(
        data.notification_id,
      );
      client.emit('notificationRead', notification);
      this.server.emit('notificationChanged', notification);
    } catch (error) {
      this.logger.error(
        `Failed to mark notification ${data.notification_id} as read`,
        error,
      );
      client.emit('error', { message: 'Failed to mark notification as read' });
    }
  }

  @SubscribeMessage('createNotification')
  async handleCreateNotification(client: Socket, data: CreateNotificationDto) {
    try {
      const notification = await this.notificationService.create(data);
      client.emit('notificationCreated', notification);
      this.server.emit('notificationChanged', notification);
    } catch (error) {
      this.logger.error('Failed to create notification', error);
      client.emit('error', { message: 'Failed to create notification' });
    }
  }

  @SubscribeMessage('getUserNotifications')
  async handleGetUserNotifications(
    client: Socket,
    data: {
      user_id: number;
      unreadOnly?: boolean;
      limit?: number;
      page?: number;
    },
  ) {
    try {
      const result = await this.notificationService.findByUser(data.user_id, {
        unreadOnly: data.unreadOnly,
        limit: data.limit,
        page: data.page,
      });
      client.emit('userNotifications', result);
    } catch (error) {
      this.logger.error(
        `Failed to fetch notifications for user ${data.user_id}`,
        error,
      );
      client.emit('error', { message: 'Failed to fetch user notifications' });
    }
  }

  @SubscribeMessage('getUnreadCount')
  async handleGetUnreadCount(client: Socket, data: { user_id: number }) {
    try {
      const count = await this.notificationService.getUnreadCount(data.user_id);
      client.emit('unreadCount', { count });
    } catch (error) {
      this.logger.error(
        `Failed to get unread count for user ${data.user_id}`,
        error,
      );
      client.emit('error', { message: 'Failed to get unread count' });
    }
  }

  // Helper method to broadcast notifications to specific user
  async broadcastToUser(user_id: number, event: string, data: any) {
    this.server.to(`user_${user_id}`).emit(event, data);
  }

  // Helper method for user to join their room
  @SubscribeMessage('joinUserRoom')
  handleJoinUserRoom(client: Socket, data: { user_id: number }) {
    client.join(`user_${data.user_id}`);
    this.logger.log(`Client ${client.id} joined user room ${data.user_id}`);
  }

  // Helper method for user to leave their room
  @SubscribeMessage('leaveUserRoom')
  handleLeaveUserRoom(client: Socket, data: { user_id: number }) {
    client.leave(`user_${data.user_id}`);
    this.logger.log(`Client ${client.id} left user room ${data.user_id}`);
  }
}
