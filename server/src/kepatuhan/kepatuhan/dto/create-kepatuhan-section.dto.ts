// src/kepatuhan/dto/create-kepatuhan-section.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateKepatuhanSectionDto {
  @IsString()
  @IsNotEmpty()
  no: string; // Contoh: "7.1"

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  bobotSection: number;

  @IsString()
  @IsNotEmpty()
  parameter: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
