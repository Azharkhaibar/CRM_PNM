import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  user_id?: number | null;

  @IsEnum(NotificationType)
  type: NotificationType = NotificationType.SYSTEM;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any> | null; 

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date | null;
}
