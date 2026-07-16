import { IsNotEmpty, IsNumber, IsEnum, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { Quarter, RiskSource } from './rekap-data.dto';

export class CloneRekapDataDto {
  @IsNotEmpty({ message: 'Tahun asal wajib diisi' })
  @IsNumber()
  @Type(() => Number)
  sourceYear: number;

  @IsNotEmpty({ message: 'Triwulan asal wajib diisi' })
  @IsEnum(Quarter)
  sourceQuarter: Quarter;

  @IsNotEmpty({ message: 'Tahun tujuan wajib diisi' })
  @IsNumber()
  @Type(() => Number)
  targetYear: number;

  @IsNotEmpty({ message: 'Triwulan tujuan wajib diisi' })
  @IsEnum(Quarter)
  targetQuarter: Quarter;

  @IsOptional()
  @IsBoolean()
  overrideExisting?: boolean;

  @IsOptional()
  @IsEnum(RiskSource)
  source?: RiskSource;

  @IsOptional()
  @IsArray()
  @IsEnum(RiskSource, { each: true })
  sources?: RiskSource[];
}
