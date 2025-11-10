import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
