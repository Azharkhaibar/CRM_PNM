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
  ParseIntPipe,
  DefaultValuePipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserStatusDto } from './dto/user-status.dto';
import { NotificationGateway } from './notification.gateway';

@Controller('notifications')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Get()
  async findAll() {
    this.logger.log('Fetching all notifications');
    return await this.notificationService.findAll();
  }

  @Get('user/:user_id')
  async findByUser(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    this.logger.log(`Fetching personal notifications for user ${user_id}`);
    return await this.notificationService.findByUser(user_id, {
      unreadOnly: unreadOnly === 'true',
      limit,
      page,
    });
  }

  @Get('user/:user_id/all')
  async getAllForUser(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    this.logger.log(`Fetching all notifications for user ${user_id}`);
    return await this.notificationService.findAllForUser(user_id, {
      unreadOnly: unreadOnly === 'true',
      limit,
      page,
    });
  }

  @Get('user/:user_id/unread-count')
  async getUnreadCount(@Param('user_id', ParseIntPipe) user_id: number) {
    this.logger.log(`Fetching unread count for user ${user_id}`);
    const count = await this.notificationService.getUnreadCount(user_id);
    return { count };
  }

  @Get('broadcast')
  async getBroadcastNotifications(
    @Query('unreadOnly') unreadOnly?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    this.logger.log('Fetching broadcast notifications');
    return await this.notificationService.findBroadcastNotifications({
      unreadOnly: unreadOnly === 'true',
      limit,
      page,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Fetching notification ${id}`);
    return await this.notificationService.findOne(id);
  }

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    this.logger.log('Creating new notification');
    return await this.notificationService.create(createNotificationDto);
  }

  @Post('bulk')
  async createMultiple(
    @Body() createNotificationDtos: CreateNotificationDto[],
  ) {
    this.logger.log(`Creating ${createNotificationDtos.length} notifications`);
    return await this.notificationService.createMultiple(
      createNotificationDtos,
    );
  }

  // broadcast

  @Post('broadcast')
  async broadcast(@Body() dto: CreateNotificationDto) {
    const saved = await this.notificationService.create(dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.notificationGateway.sendNotificationToAll(saved);
    return saved;
  }

  @Post('user-status')
  async userStatusNotification(@Body() userStatusDto: UserStatusDto) {
    this.logger.log(
      `User status change: ${userStatusDto.userName} is ${userStatusDto.status}`,
    );
    return await this.notificationService.notifyUserStatusChange(
      userStatusDto.userId,
      userStatusDto.userName,
      userStatusDto.status,
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    this.logger.log(`Updating notification ${id}`);
    return await this.notificationService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Marking notification ${id} as read`);
    return await this.notificationService.markAsRead(id);
  }

  @Patch('user/:user_id/mark-all-read')
  async markAllAsRead(@Param('user_id', ParseIntPipe) user_id: number) {
    this.logger.log(`Marking all notifications as read for user ${user_id}`);
    await this.notificationService.markAllAsRead(user_id);
    return {
      success: true,
      message: 'All notifications marked as read',
      user_id,
    };
  }

  @Get('user/:user_id/recent')
  async getRecentUserNotifications(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Query('hours', new DefaultValuePipe(24), ParseIntPipe) hours?: number,
  ) {
    this.logger.log(
      `Fetching recent notifications for user ${user_id} (last ${hours}h)`,
    );
    return await this.notificationService.getRecentUserNotifications(
      user_id,
      hours,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Deleting notification ${id}`);
    await this.notificationService.remove(id);
    return {
      success: true,
      message: 'Notification deleted successfully',
      notification_id: id,
    };
  }

  @Delete('cleanup/expired')
  async removeExpired() {
    this.logger.log('Removing expired notifications');
    await this.notificationService.removeExpired();
    return {
      success: true,
      message: 'Expired notifications removed successfully',
    };
  }
}
