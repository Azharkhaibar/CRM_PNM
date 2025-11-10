// src/notification/notification.controller.ts
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
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUser } from './decorator/get-user.decorator';
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 🔹 Get notifications for logged-in user
  @Get('my')
  async getMyNotifications(
    @GetUser('userID') userID: string,
    @Query('unreadOnly', new DefaultValuePipe(false), ParseBoolPipe)
    unreadOnly?: boolean,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    const user_id = Number(userID);
    return await this.notificationService.findByUser(user_id, {
      unreadOnly,
      limit,
      page,
    });
  }

  @Get('my/unread-count')
  async getMyUnreadCount(@GetUser('userID') userID: string) {
    const user_id = Number(userID);
    const count = await this.notificationService.getUnreadCount(user_id);
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return await this.notificationService.markAsRead(id);
  }

  @Put('mark-all-read')
  async markAllAsRead(@GetUser('userID') userID: string) {
    const user_id = Number(userID);
    await this.notificationService.markAllAsRead(user_id);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.notificationService.remove(id);
    return { message: 'Notification deleted' };
  }

  async create(@Body() dto: CreateNotificationDto) {
    return await this.notificationService.create(dto);
  }
}
