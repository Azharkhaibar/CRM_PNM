import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { CalculationMode, Quarter } from '../entities/reputasi.entity';

export class CreateReputasiDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsEnum(Quarter)
  @IsNotEmpty()
  quarter: Quarter;

  @IsNumber()
  @IsNotEmpty()
  sectionId: number;

  @IsString()
  @IsNotEmpty()
  no: string;

  @IsString()
  @IsNotEmpty()
  sectionLabel: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  bobotSection: number;

  @IsString()
  @IsNotEmpty()
  subNo: string;

  @IsString()
  @IsNotEmpty()
  indikator: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  bobotIndikator: number;

  @IsString()
  @IsOptional()
  sumberRisiko?: string;

  @IsString()
  @IsOptional()
  dampak?: string;

  // Level risiko (untuk reputasi biasanya berupa deskripsi teks)
  @IsString()
  @IsOptional()
  low?: string;

  @IsString()
  @IsOptional()
  lowToModerate?: string;

  @IsString()
  @IsOptional()
  moderate?: string;

  @IsString()
  @IsOptional()
  moderateToHigh?: string;

  @IsString()
  @IsOptional()
  high?: string;

  @IsEnum(CalculationMode)
  @IsOptional()
  mode?: CalculationMode = CalculationMode.RASIO;

  @IsString()
  @IsOptional()
  pembilangLabel?: string;

  @IsNumber()
  @IsOptional()
  pembilangValue?: number;

  @IsString()
  @IsOptional()
  penyebutLabel?: string;

  @IsNumber()
  @IsOptional()
  penyebutValue?: number;

  @IsString()
  @IsOptional()
  formula?: string;

  @IsBoolean()
  @IsOptional()
  isPercent?: boolean = false;

  @IsString()
  @IsOptional()
  hasil?: string;

  @IsString()
  @IsOptional()
  hasilText?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  peringkat: number;

  @IsNumber()
  @IsOptional()
  weighted?: number;

  @IsString()
  @IsOptional()
  keterangan?: string;
}
