import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
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
  metadata?: Record<string, any>;
  

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date | null;
}
