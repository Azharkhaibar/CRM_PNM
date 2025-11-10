import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(private readonly notificationService: NotificationService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('findAllNotification')
  async findAll() {
    try {
      const notifications = await this.notificationService.findAll();
      return { event: 'findAllNotification', data: notifications };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch notifications';
      this.logger.error(`Error in findAllNotification: ${message}`);
      return { event: 'error', data: message };
    }
  }

  @SubscribeMessage('findOneNotification')
  async findOne(@MessageBody() data: { notification_id: number }) {
    try {
      const notification = await this.notificationService.findOne(
        Number(data.notification_id),
      );
      return { event: 'findOneNotification', data: notification };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Notification not found';
      this.logger.error(`Error in findOneNotification: ${message}`);
      return { event: 'error', data: message };
    }
  }

  @SubscribeMessage('updateNotification')
  async update(
    @MessageBody()
    updateData: {
      notification_id: number;
      data: UpdateNotificationDto;
    },
  ) {
    try {
      const notification = await this.notificationService.update(
        Number(updateData.notification_id),
        updateData.data,
      );
      return { event: 'updateNotification', data: notification };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update notification';
      this.logger.error(`Error in updateNotification: ${message}`);
      return { event: 'error', data: message };
    }
  }

  @SubscribeMessage('removeNotification')
  async remove(@MessageBody() data: { notification_id: number }) {
    try {
      await this.notificationService.remove(Number(data.notification_id));
      return { event: 'removeNotification', data: { success: true } };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to remove notification';
      this.logger.error(`Error in removeNotification: ${message}`);
      return { event: 'error', data: message };
    }
  }

  @SubscribeMessage('markAsRead')
  async markAsRead(@MessageBody() data: { notification_id: number }) {
    try {
      const notification = await this.notificationService.markAsRead(
        Number(data.notification_id),
      );
      return { event: 'markAsRead', data: notification };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to mark notification as read';
      this.logger.error(`Error in markAsRead: ${message}`);
      return { event: 'error', data: message };
    }
  }

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await this.notificationService.create(
        createNotificationDto,
      );

      const userId = Number(createNotificationDto.userId);

      this.server.emit(`user-${userId}`, {
        event: 'newNotification',
        data: notification,
      });

      return { event: 'createNotification', data: notification };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create notification';
      this.logger.error(`Error in createNotification: ${message}`);
      return { event: 'error', data: message };
    }
  }

  @SubscribeMessage('getUserNotifications')
  async getUserNotifications(
    @MessageBody() data: { userId: string; unreadOnly?: boolean },
  ) {
    try {
      const user_id = Number(data.userId);
      const result = await this.notificationService.findByUser(user_id, {
        unreadOnly: data.unreadOnly,
      });
      return { event: 'getUserNotifications', data: result };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch user notifications';
      this.logger.error(`Error in getUserNotifications: ${message}`);
      return { event: 'error', data: message };
    }
  }

  @SubscribeMessage('getUnreadCount')
  async getUnreadCount(@MessageBody() data: { userId: string }) {
    try {
      const user_id = Number(data.userId);
      const count = await this.notificationService.getUnreadCount(user_id);
      return { event: 'getUnreadCount', data: { count } };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to get unread count';
      this.logger.error(`Error in getUnreadCount: ${message}`);
      return { event: 'error', data: message };
    }
  }
}
