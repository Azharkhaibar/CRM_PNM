// entities/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('notifications')
export class Notification {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
@Index()
userId: string;

@Column({
type: 'enum',
enum: ['info', 'success', 'warning', 'error', 'system']
})
type: string;

@Column()
title: string;

@Column('text')
message: string;

@Column({ default: false })
read: boolean;

@Column({ type: 'json', nullable: true })
metadata: any; // Untuk data tambahan seperti link, action, dll

@Column({ nullable: true })
category: string; // 'order', 'payment', 'system', dll

@CreateDateColumn()
@Index()
createdAt: Date;

@Column({ type: 'timestamp', nullable: true })
expiresAt: Date;
}

## --------------------------------------------------------------

// dto/create-notification.dto.ts
export class CreateNotificationDto {
userId: string;
type: 'info' | 'success' | 'warning' | 'error' | 'system';
title: string;
message: string;
metadata?: any;
category?: string;
expiresAt?: Date;
}

// dto/update-notification.dto.ts
export class UpdateNotificationDto {
read?: boolean;
}

## --------------------------------------------------------------

// services/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationService {
private readonly logger = new Logger(NotificationService.name);

constructor(
@InjectRepository(Notification)
private notificationRepo: Repository<Notification>,
) {}

async create(createDto: CreateNotificationDto): Promise<Notification> {
try {
const notification = this.notificationRepo.create(createDto);
const saved = await this.notificationRepo.save(notification);

      this.logger.log(`Notification created for user ${createDto.userId}`);
      return saved;
    } catch (error) {
      this.logger.error('Failed to create notification', error.stack);
      throw error;
    }

}

async createMultiple(createDtos: CreateNotificationDto[]): Promise<Notification[]> {
const notifications = this.notificationRepo.create(createDtos);
return await this.notificationRepo.save(notifications);
}

async findByUser(userId: string, options?: {
unreadOnly?: boolean;
limit?: number;
page?: number;
}): Promise<{ notifications: Notification[]; total: number }> {
const { unreadOnly = false, limit = 50, page = 1 } = options || {};

    const query = this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (unreadOnly) {
      query.andWhere('notification.read = :read', { read: false });
    }

    const [notifications, total] = await query.getManyAndCount();

    return { notifications, total };

}

async markAsRead(id: string): Promise<Notification> {
const notification = await this.notificationRepo.findOne({ where: { id } });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    return await this.notificationRepo.save(notification);

}

async markAllAsRead(userId: string): Promise<void> {
await this.notificationRepo
.createQueryBuilder()
.update(Notification)
.set({ read: true })
.where('userId = :userId AND read = :read', { userId, read: false })
.execute();
}

async getUnreadCount(userId: string): Promise<number> {
return await this.notificationRepo.count({
where: { userId, read: false }
});
}

async remove(id: string): Promise<void> {
await this.notificationRepo.delete(id);
}

async removeExpired(): Promise<void> {
await this.notificationRepo
.createQueryBuilder()
.delete()
.where('expiresAt < :now', { now: new Date() })
.execute();
}

// Untuk real-time notifications
async getRecentUserNotifications(userId: string, hours: number = 24): Promise<Notification[]> {
const since = new Date();
since.setHours(since.getHours() - hours);

    return await this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.createdAt > :since', { since })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();

}
}

## --------------------------------------------------------------

// controllers/notification.controller.ts
import {
Controller,
Get,
Post,
Put,
Delete,
Body,
Param,
Query,
UseGuards,
ParseUUIDPipe
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
constructor(private readonly notificationService: NotificationService) {}

@Post()
async create(@Body() createDto: CreateNotificationDto) {
return await this.notificationService.create(createDto);
}

@Get('my')
async getMyNotifications(
@GetUser() user: any,
@Query('unreadOnly') unreadOnly?: boolean,
@Query('limit') limit?: number,
@Query('page') page?: number
) {
return await this.notificationService.findByUser(user.id, {
unreadOnly: unreadOnly === 'true',
limit: limit ? parseInt(limit.toString()) : 50,
page: page ? parseInt(page.toString()) : 1
});
}

@Get('my/unread-count')
async getMyUnreadCount(@GetUser() user: any) {
const count = await this.notificationService.getUnreadCount(user.id);
return { count };
}

@Put(':id/read')
async markAsRead(@Param('id', ParseUUIDPipe) id: string) {
return await this.notificationService.markAsRead(id);
}

@Put('mark-all-read')
async markAllAsRead(@GetUser() user: any) {
await this.notificationService.markAllAsRead(user.id);
return { message: 'All notifications marked as read' };
}

@Delete(':id')
async remove(@Param('id', ParseUUIDPipe) id: string) {
await this.notificationService.remove(id);
return { message: 'Notification deleted' };
}
}

## --------------------------------------------------------------

// notification.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { Notification } from './entities/notification.entity';
import { NotificationGateway } from './gateways/notification.gateway';

@Module({
imports: [TypeOrmModule.forFeature([Notification])],
controllers: [NotificationController],
providers: [NotificationService, NotificationGateway],
exports: [NotificationService]
})
export class NotificationModule {}

(SUDAH OK SEMUA TINGGAL BUAT ANTARMUKA UI NOTIF DAN INTEGRASI, LOGIN, LAST_LOGOUT, ACTION)