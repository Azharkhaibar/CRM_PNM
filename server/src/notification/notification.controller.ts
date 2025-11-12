import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserStatusDto } from './dto/user-status.dto';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  /** 🔹 Ambil semua notifikasi (admin / debugging) */
  @Get()
  async findAll() {
    this.logger.log('Fetching all notifications');
    return await this.notificationService.findAll();
  }

  /** 🔹 Ambil notifikasi berdasarkan user */
  @Get('user/:user_id')
  async findByUser(
    @Param('user_id') user_id: number,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    this.logger.log(`Fetching notifications for user ${user_id}`);
    return await this.notificationService.findByUser(Number(user_id), {
      unreadOnly: unreadOnly === 'true',
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
    });
  }

  /** 🔹 Ambil jumlah notifikasi belum dibaca */
  @Get('user/:user_id/unread-count')
  async getUnreadCount(@Param('user_id') user_id: number) {
    this.logger.log(`Fetching unread count for user ${user_id}`);
    const count = await this.notificationService.getUnreadCount(
      Number(user_id),
    );
    return { count };
  }

  /** 🔹 Ambil 1 notifikasi by ID */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    this.logger.log(`Fetching notification ${id}`);
    return await this.notificationService.findOne(Number(id));
  }

  /** 🔹 Buat notifikasi baru */
  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    this.logger.log('Creating new notification');
    return await this.notificationService.create(createNotificationDto);
  }

  /** 🔹 Buat banyak notifikasi sekaligus */
  @Post('bulk')
  async createMultiple(
    @Body() createNotificationDtos: CreateNotificationDto[],
  ) {
    this.logger.log('Creating multiple notifications');
    return await this.notificationService.createMultiple(
      createNotificationDtos,
    );
  }

  /** 🔹 Update notifikasi */
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    this.logger.log(`Updating notification ${id}`);
    return await this.notificationService.update(
      Number(id),
      updateNotificationDto,
    );
  }

  /** 🔹 Tandai 1 notifikasi sudah dibaca */
  @Patch(':id/read')
  async markAsRead(@Param('id') id: number) {
    this.logger.log(`Marking notification ${id} as read`);
    return await this.notificationService.markAsRead(Number(id));
  }

  @Post('user-status')
  async userStatusNotification(@Body() body: UserStatusDto) {
    return await this.notificationService.notifyUserStatusChange(
      body.userId,
      body.userName,
      body.status,
    );
  }

  /** 🔹 Tandai semua notifikasi user sudah dibaca */
  @Patch('user/:user_id/mark-all-read')
  async markAllAsRead(@Param('user_id') user_id: number) {
    this.logger.log(`Marking all notifications as read for user ${user_id}`);
    await this.notificationService.markAllAsRead(Number(user_id));
    return { message: 'All notifications marked as read' };
  }

  /** 🔹 Ambil notifikasi terbaru (misal 24 jam terakhir) */
  @Get('user/:user_id/recent')
  async getRecentUserNotifications(
    @Param('user_id') user_id: number,
    @Query('hours') hours?: string,
  ) {
    const range = hours ? Number(hours) : 24;
    this.logger.log(
      `Fetching notifications from last ${range}h for user ${user_id}`,
    );
    return await this.notificationService.getRecentUserNotifications(
      Number(user_id),
      range,
    );
  }

  /** 🔹 Hapus notifikasi */
  @Delete(':id')
  async remove(@Param('id') id: number) {
    this.logger.log(`Deleting notification ${id}`);
    await this.notificationService.remove(Number(id));
    return { message: 'Notification deleted successfully' };
  }

  /** 🔹 Hapus notifikasi kadaluwarsa */
  @Delete()
  async removeExpired() {
    this.logger.log('Removing expired notifications');
    await this.notificationService.removeExpired();
    return { message: 'Expired notifications removed successfully' };
  }
}
