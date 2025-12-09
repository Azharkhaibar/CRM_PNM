// src/kpmr-pasar/dto/create-kpmr-pasar.dto.ts
import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateKpmrPasarDto {
  @IsInt()
  year: number;

  @IsEnum(['Q1', 'Q2', 'Q3', 'Q4'])
  quarter: string;

  @IsOptional()
  @IsString()
  aspekNo?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aspekBobot?: number;

  @IsOptional()
  @IsString()
  aspekTitle?: string;

  @IsOptional()
  @IsString()
  sectionNo?: string;

  @IsOptional()
  @IsString()
  indikator?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  sectionSkor?: number;

  @IsOptional()
  @IsString()
  strong?: string;

  @IsOptional()
  @IsString()
  satisfactory?: string;

  @IsOptional()
  @IsString()
  fair?: string;

  @IsOptional()
  @IsString()
  marginal?: string;

  @IsOptional()
  @IsString()
  unsatisfactory?: string;

  @IsOptional()
  @IsString()
  evidence?: string;
}
