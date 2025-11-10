import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}
  private readonly logger = new Logger(NotificationService.name);

  // Fixed methods using notification_id:
  async findAll(): Promise<Notification[]> {
    return await this.notificationRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(notification_id: number): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { notification_id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async update(
    notification_id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.notificationRepo.update(notification_id, updateNotificationDto);
    return await this.findOne(notification_id);
  }

  async create(crDto: CreateNotificationDto): Promise<Notification> {
    try {
      const notificationData = {
        ...crDto,
        expires_at: crDto.expiresAt,
      };

      const notif = this.notificationRepo.create(notificationData);
      const sv = await this.notificationRepo.save(notif);

      this.logger.log(`Notification created for user ${crDto.userId}`);
      return sv;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.stack);
      } else {
        console.error(err);
      }

      throw new Error('gagal buat notif');
    }
  }

  async createMultiple(
    crDto: CreateNotificationDto[],
  ): Promise<Notification[]> {
    const notificationsData = crDto.map((dto) => ({
      ...dto,
      expires_at: dto.expiresAt,
    }));

    const notif = this.notificationRepo.create(notificationsData);
    return await this.notificationRepo.save(notif);
  }

  async findByUser(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      limit?: number;
      page?: number;
    },
  ): Promise<{ notifications: Notification[]; total: number }> {
    const { unreadOnly = false, limit = 50, page = 1 } = options || {};

    const query = this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (unreadOnly) {
      query.andWhere('notification.read = :read', { read: false });
    }

    const [notifications, total] = await query.getManyAndCount();

    return { notifications, total };
  }

  async markAsRead(notification_id: number): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { notification_id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    return await this.notificationRepo.save(notification);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepo.count({
      where: { userId, read: false },
    });
  }

  async remove(notification_id: number): Promise<void> {
    await this.notificationRepo.delete(notification_id);
  }

  async removeExpired(): Promise<void> {
    await this.notificationRepo
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
  }

  // notifikasi realtime
  async getRecentUserNotifications(
    userId: string,
    hours: number = 24,
  ): Promise<Notification[]> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    return await this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.created_at > :since', { since })
      .orderBy('notification.created_at', 'DESC')
      .getMany();
  }
}
