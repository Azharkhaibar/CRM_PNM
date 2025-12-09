// src/hukum/dto/create-hukum-section.dto.ts
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateHukumSectionDto {
  @IsString()
  no: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  bobotSection: number;

  @IsString()
  parameter: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
