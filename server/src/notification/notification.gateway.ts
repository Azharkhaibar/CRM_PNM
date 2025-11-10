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
    } catch (error) {
      this.logger.error('Error in findAllNotification', error);
      return { event: 'error', data: 'Failed to fetch notifications' };
    }
  }

  @SubscribeMessage('findOneNotification')
  async findOne(@MessageBody() data: { notification_id: number }) {
    try {
      const notification = await this.notificationService.findOne(
        data.notification_id,
      );
      return { event: 'findOneNotification', data: notification };
    } catch (error) {
      this.logger.error('Error in findOneNotification', error);
      return { event: 'error', data: 'Notification not found' };
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
        updateData.notification_id,
        updateData.data,
      );
      return { event: 'updateNotification', data: notification };
    } catch (error) {
      this.logger.error('Error in updateNotification', error);
      return { event: 'error', data: 'Failed to update notification' };
    }
  }

  @SubscribeMessage('removeNotification')
  async remove(@MessageBody() data: { notification_id: number }) {
    try {
      await this.notificationService.remove(data.notification_id);
      return { event: 'removeNotification', data: { success: true } };
    } catch (error) {
      this.logger.error('Error in removeNotification', error);
      return { event: 'error', data: 'Failed to remove notification' };
    }
  }

  @SubscribeMessage('markAsRead')
  async markAsRead(@MessageBody() data: { notification_id: number }) {
    try {
      const notification = await this.notificationService.markAsRead(
        data.notification_id,
      );
      return { event: 'markAsRead', data: notification };
    } catch (error) {
      this.logger.error('Error in markAsRead', error);
      return { event: 'error', data: 'Failed to mark notification as read' };
    }
  }

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await this.notificationService.create(
        createNotificationDto,
      );

      this.server.emit(`user-${createNotificationDto.userId}`, {
        event: 'newNotification',
        data: notification,
      });

      return { event: 'createNotification', data: notification };
    } catch (error) {
      this.logger.error('Error in createNotification', error);
      return { event: 'error', data: 'Failed to create notification' };
    }
  }

  @SubscribeMessage('getUserNotifications')
  async getUserNotifications(
    @MessageBody() data: { userId: string; unreadOnly?: boolean },
  ) {
    try {
      const result = await this.notificationService.findByUser(data.userId, {
        unreadOnly: data.unreadOnly,
      });
      return { event: 'getUserNotifications', data: result };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch user notifications';
      this.logger.error('Error in getUserNotifications', errorMessage);
      return { event: 'error', data: errorMessage };
    }
  }

  @SubscribeMessage('getUnreadCount')
  async getUnreadCount(@MessageBody() data: { userId: string }) {
    try {
      const count = await this.notificationService.getUnreadCount(data.userId);
      return { event: 'getUnreadCount', data: { count } };
    } catch (error) {
      this.logger.error('Error in getUnreadCount', error);
      return { event: 'error', data: 'Failed to get unread count' };
    }
  }
}
