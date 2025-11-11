/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationGateway } from './notification.gateway';
export interface FindByUserOptions {
  unreadOnly?: boolean;
  limit?: number;
  page?: number;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    // 🔥 gunakan forwardRef di sini
    @Inject(forwardRef(() => NotificationGateway))
    private readonly gateway: NotificationGateway,
  ) {}

  /**
   * Find all notifications
   */
  async findAll(): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      this.logger.error('Failed to find all notifications', error);
      throw new InternalServerErrorException(
        'Failed to retrieve notifications',
      );
    }
  }

  /**
   * Find one notification by ID
   */
  async findOne(notification_id: number): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { notification_id },
      });

      if (!notification) {
        throw new NotFoundException(
          `Notification with ID ${notification_id} not found`,
        );
      }

      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find notification ${notification_id}`,
        error,
      );
      throw new InternalServerErrorException('Failed to retrieve notification');
    }
  }

  /**
   * Create a new notification
   */
  async create(createDto: CreateNotificationDto): Promise<Notification> {
    try {
      // ✅ Buat notifikasi baru langsung dari DTO
      const notification = this.notificationRepository.create({
        ...createDto,
        user_id: Number(createDto.userId),
        expires_at: createDto.expiresAt ?? null,
      });

      const savedNotification =
        await this.notificationRepository.save(notification);

      // ✅ Kirim notifikasi ke user real-time
      this.gateway.sendNotificationToUser(
        Number(createDto.userId),
        savedNotification,
      );

      this.logger.log(
        `Notification created & emitted to user ${createDto.userId}`,
      );
      return savedNotification;
    } catch (error) {
      this.logger.error('Failed to create notification', error);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  /**
   * Update a notification
   */
  async update(
    notification_id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    try {
      const notification = await this.findOne(notification_id);
      Object.assign(notification, updateNotificationDto);
      return await this.notificationRepository.save(notification);
    } catch (error) {
      this.logger.error(
        `Failed to update notification ${notification_id}`,
        error,
      );
      throw new InternalServerErrorException('Failed to update notification');
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(user_id: number): Promise<void> {
    try {
      await this.notificationRepository
        .createQueryBuilder()
        .update(Notification)
        .set({ read: true })
        .where('user_id = :user_id', { user_id })
        .andWhere('read = false')
        .execute();

      this.logger.log(`All notifications marked as read for user ${user_id}`);
    } catch (error) {
      this.logger.error(
        `Failed to mark all as read for user ${user_id}`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to mark notifications as read',
      );
    }
  }

  /**
   * Create multiple notifications
   */
  async createMultiple(
    createDtos: CreateNotificationDto[],
  ): Promise<Notification[]> {
    try {
      const notificationsData: Partial<Notification>[] = createDtos.map(
        (dto) => {
          const item: Partial<Notification> = {
            ...dto,
            user_id: Number(dto.userId),
            expires_at: dto.expiresAt ?? null,
          };
          delete (item as any).userId;
          delete (item as any).expiresAt;
          return item;
        },
      );

      const notifications =
        this.notificationRepository.create(notificationsData);
      const savedNotifications =
        await this.notificationRepository.save(notifications);

      this.logger.log(`Created ${savedNotifications.length} notifications`);
      return savedNotifications;
    } catch (error) {
      this.logger.error('Failed to create multiple notifications', error);
      throw new InternalServerErrorException('Failed to create notifications');
    }
  }

  /**
   * Find notifications by user with pagination and filtering
   */
  async findByUser(
    user_id: number,
    options: FindByUserOptions = {},
  ): Promise<{ notifications: Notification[]; total: number }> {
    try {
      const { unreadOnly = false, limit = 50, page = 1 } = options;

      const query = this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user_id = :user_id', { user_id })
        .orderBy('notification.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (unreadOnly) {
        query.andWhere('notification.read = false');
      }

      const [notifications, total] = await query.getManyAndCount();
      return { notifications, total };
    } catch (error) {
      this.logger.error(
        `Failed to find notifications for user ${user_id}`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve user notifications',
      );
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notification_id: number): Promise<Notification> {
    try {
      const notification = await this.findOne(notification_id);
      notification.read = true;
      return await this.notificationRepository.save(notification);
    } catch (error) {
      this.logger.error(
        `Failed to mark notification ${notification_id} as read`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to mark notification as read',
      );
    }
  }

  /**
   * Count unread notifications for a user
   */
  async getUnreadCount(user_id: number): Promise<number> {
    try {
      return await this.notificationRepository.count({
        where: { user_id, read: false },
      });
    } catch (error) {
      this.logger.error(
        `Failed to get unread count for user ${user_id}`,
        error,
      );
      throw new InternalServerErrorException('Failed to get unread count');
    }
  }

  /**
   * Delete a notification
   */
  async remove(notification_id: number): Promise<void> {
    try {
      const result = await this.notificationRepository.delete(notification_id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Notification with ID ${notification_id} not found`,
        );
      }
      this.logger.log(`Notification ${notification_id} deleted`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete notification ${notification_id}`,
        error,
      );
      throw new InternalServerErrorException('Failed to delete notification');
    }
  }

  /**
   * Remove expired notifications
   */
  async removeExpired(): Promise<void> {
    try {
      const result = await this.notificationRepository
        .createQueryBuilder()
        .delete()
        .where('expires_at < :now', { now: new Date() })
        .execute();

      this.logger.log(`Removed ${result.affected ?? 0} expired notifications`);
    } catch (error) {
      this.logger.error('Failed to remove expired notifications', error);
      throw new InternalServerErrorException(
        'Failed to remove expired notifications',
      );
    }
  }

  /**
   * Get recent notifications for a user
   */
  async getRecentUserNotifications(
    user_id: number,
    hours = 24,
  ): Promise<Notification[]> {
    try {
      const since = new Date();
      since.setHours(since.getHours() - hours);

      return await this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user_id = :user_id', { user_id })
        .andWhere('notification.created_at > :since', { since })
        .orderBy('notification.created_at', 'DESC')
        .getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get recent notifications for user ${user_id}`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve recent notifications',
      );
    }
  }
}
