/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(notification_id: number): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { notification_id },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification with ID ${notification_id} not found`,
      );
    }

    return notification;
  }

  async create(crDto: CreateNotificationDto): Promise<Notification> {
    try {
      const notificationData: Partial<Notification> = {
        ...crDto,
        user_id: Number(crDto.userId),
        expires_at: crDto.expiresAt ?? null,
      };

      delete (notificationData as any).userId;
      delete (notificationData as any).expiresAt;

      const notif = this.notificationRepo.create(notificationData);
      const saved = await this.notificationRepo.save(notif);

      this.logger.log(`✅ Notification created for user ${crDto.userId}`);
      return saved;
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('❌ Failed to create notification', err.message);
      } else {
        this.logger.error('❌ Unknown error creating notification');
      }
      throw new InternalServerErrorException('Gagal membuat notifikasi');
    }
  }

  async update(
    notification_id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.findOne(notification_id);
    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepo.save(notification);
  }

  async markAllAsRead(user_id: number): Promise<void> {
    await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where('user_id = :user_id', { user_id })
      .andWhere('read = false')
      .execute();

    this.logger.log(`✅ All notifications marked as read for user ${user_id}`);
  }

  // 🔹 Create multiple notifications
  async createMultiple(
    crDto: CreateNotificationDto[],
  ): Promise<Notification[]> {
    try {
      const notificationsData: Partial<Notification>[] = crDto.map((dto) => {
        const item: Partial<Notification> = {
          ...dto,
          user_id: Number(dto.userId),
          expires_at: dto.expiresAt ?? null,
        };
        delete (item as any).userId;
        delete (item as any).expiresAt;
        return item;
      });

      const notifEntities = this.notificationRepo.create(notificationsData);
      const saved = await this.notificationRepo.save(notifEntities);

      this.logger.log(`✅ Created ${saved.length} notifications`);
      return saved;
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('❌ Failed to create notifications', err.message);
      } else {
        this.logger.error('❌ Unknown error creating multiple notifications');
      }
      throw new InternalServerErrorException('Gagal membuat notifikasi');
    }
  }

  async findByUser(
    user_id: number,
    options?: {
      unreadOnly?: boolean;
      limit?: number;
      page?: number;
    },
  ): Promise<{ notifications: Notification[]; total: number }> {
    const { unreadOnly = false, limit = 50, page = 1 } = options || {};

    const query = this.notificationRepo
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
  }

  async markAsRead(notification_id: number): Promise<Notification> {
    const notification = await this.findOne(notification_id);
    notification.read = true;
    return await this.notificationRepo.save(notification);
  }

  // 🔹 Count unread notifications
  async getUnreadCount(user_id: number): Promise<number> {
    return await this.notificationRepo.count({
      where: { user_id, read: false },
    });
  }

  // 🔹 Delete notification
  async remove(notification_id: number): Promise<void> {
    const result = await this.notificationRepo.delete(notification_id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Notification with ID ${notification_id} not found`,
      );
    }
  }

  // 🔹 Remove expired notifications
  async removeExpired(): Promise<void> {
    const result = await this.notificationRepo
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();

    this.logger.log(`🗑️ Removed ${result.affected ?? 0} expired notifications`);
  }

  // 🔹 Get recent notifications (for realtime usage)
  async getRecentUserNotifications(
    user_id: number,
    hours = 24,
  ): Promise<Notification[]> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    return await this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.user_id = :user_id', { user_id })
      .andWhere('notification.created_at > :since', { since })
      .orderBy('notification.created_at', 'DESC')
      .getMany();
  }
}
