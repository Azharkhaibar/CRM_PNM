// dto/query-pasar.dto.ts
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class PeriodFilterDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  tahun?: number;

  @IsOptional()
  @IsString()
  @IsEnum(['Q1', 'Q2', 'Q3', 'Q4'])
  triwulan?: string;
}

export class SearchIndikatorsDto {
  @IsOptional()
  @IsString()
  query?: string;
}

export class IndikatorBySectionDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  sectionId?: number;
}
