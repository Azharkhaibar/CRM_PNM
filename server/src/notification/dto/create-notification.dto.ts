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
  @Type(() => Number)
  userId: number; // ✅ tipe number agar cocok dengan entity.user_id

  @IsEnum(NotificationType)
  type: NotificationType;

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
