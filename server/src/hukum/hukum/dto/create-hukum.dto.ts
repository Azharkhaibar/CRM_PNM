// src/hukum/dto/create-hukum.dto.ts
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { CalculationMode, Quarter } from '../entities/hukum.entity';

export class CreateHukumDto {
  @IsInt()
  year: number;

  @IsEnum(Quarter)
  quarter: Quarter;

  @IsInt()
  sectionId: number;

  @IsString()
  subNo: string;

  @IsString()
  indikator: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  bobotIndikator: number;

  @IsOptional()
  @IsString()
  sumberRisiko?: string;

  @IsOptional()
  @IsString()
  dampak?: string;

  @IsOptional()
  @IsString()
  low?: string;

  @IsOptional()
  @IsString()
  lowToModerate?: string;

  @IsOptional()
  @IsString()
  moderate?: string;

  @IsOptional()
  @IsString()
  moderateToHigh?: string;

  @IsOptional()
  @IsString()
  high?: string;

  @IsEnum(CalculationMode)
  mode: CalculationMode;

  @IsOptional()
  @IsString()
  formula?: string;

  @IsOptional()
  @IsBoolean()
  isPercent?: boolean;

  @IsOptional()
  @IsString()
  pembilangLabel?: string;

  @IsOptional()
  @IsNumber()
  pembilangValue?: number;

  @IsOptional()
  @IsString()
  penyebutLabel?: string;

  @IsOptional()
  @IsNumber()
  penyebutValue?: number;

  @IsOptional()
  @IsString()
  hasil?: string;

  @IsOptional()
  @IsString()
  hasilText?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  peringkat: number;

  @IsOptional()
  @IsNumber()
  weighted?: number;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
