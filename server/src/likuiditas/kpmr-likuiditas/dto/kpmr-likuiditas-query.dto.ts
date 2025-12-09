// src/kpmr-likuiditas/dto/kpmr-likuiditas-query.dto.ts
import { IsOptional, IsString, IsInt, IsIn } from 'class-validator';

export class KpmrLikuiditasQueryDto {
  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Q1', 'Q2', 'Q3', 'Q4'])
  quarter?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  aspekNo?: string;

  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 50;
}
