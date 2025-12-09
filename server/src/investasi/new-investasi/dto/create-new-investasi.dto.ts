import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsBoolean,
  IsDecimal,
} from 'class-validator';
import { CalculationMode, Quarter } from '../entities/new-investasi.entity';

export class CreateInvestasiDto {
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

  @IsString()
  @IsOptional()
  low?: string = 'x ≤ 1%';

  @IsString()
  @IsOptional()
  lowToModerate?: string = '1% < x ≤ 2%';

  @IsString()
  @IsOptional()
  moderate?: string = '2% < x ≤ 3%';

  @IsString()
  @IsOptional()
  moderateToHigh?: string = '3% < x ≤ 4%';

  @IsString()
  @IsOptional()
  high?: string = 'x > 4%';

  @IsEnum(CalculationMode)
  @IsOptional()
  mode?: CalculationMode = CalculationMode.RASIO;

  @IsString()
  @IsOptional()
  numeratorLabel?: string;

  @IsNumber()
  @IsOptional()
  numeratorValue?: number;

  @IsString()
  @IsNotEmpty()
  denominatorLabel: string;

  @IsNumber()
  @IsNotEmpty()
  denominatorValue: number;

  @IsString()
  @IsOptional()
  formula?: string;

  @IsBoolean()
  @IsOptional()
  isPercent?: boolean = false;

  @IsNumber()
  @IsOptional()
  hasil?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  peringkat: number;

  @IsNumber()
  @IsNotEmpty()
  weighted: number;

  @IsString()
  @IsOptional()
  keterangan?: string;
}
