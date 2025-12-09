// src/kpmr-likuiditas/dto/create-kpmr-likuiditas.dto.ts
import {
  IsString,
  IsNumber,
  IsIn,
  IsOptional,
  Min,
  Max,
  IsInt,
} from 'class-validator';

export class CreateKpmrLikuiditasDto {
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsString()
  @IsIn(['Q1', 'Q2', 'Q3', 'Q4'])
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
