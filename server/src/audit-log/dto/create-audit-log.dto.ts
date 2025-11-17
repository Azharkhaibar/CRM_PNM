import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ActionType, ModuleType } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @IsNumber()
  @IsOptional()
  userId: number | null;

  @IsEnum(ActionType)
  action: ActionType;

  @IsEnum(ModuleType)
  module: ModuleType;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  endpoint?: string;

  @IsString()
  @IsOptional()
  ip_address: string;

  @IsBoolean()
  @IsOptional()
  isSuccess?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
