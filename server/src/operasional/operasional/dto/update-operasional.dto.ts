import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Quarter } from '../entities/operasional.entity';
export class UpdateSectionOperationalDto {
  @ApiPropertyOptional({ example: '4.1' })
  @IsOptional()
  @IsString()
  no?: string;

  @ApiPropertyOptional({ example: 'Parameter Updated' })
  @IsOptional()
  @IsString()
  parameter?: string;

  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @IsNumber()
  bobotSection?: number;

  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ enum: Quarter, example: 'Q2' })
  @IsOptional()
  @IsEnum(Quarter)
  quarter?: Quarter;
}

export class UpdateIndikatorOperationalDto {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  sectionId?: number;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ enum: Quarter, example: 'Q1' })
  @IsOptional()
  @IsEnum(Quarter)
  quarter?: Quarter;

  @ApiPropertyOptional({ example: '4.1.2' })
  @IsOptional()
  @IsString()
  subNo?: string;

  @ApiPropertyOptional({ example: 'Indikator Updated' })
  @IsOptional()
  @IsString()
  indikator?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  bobotIndikator?: number;

  @ApiPropertyOptional({ example: 'Sumber risiko updated' })
  @IsOptional()
  @IsString()
  sumberRisiko?: string;

  @ApiPropertyOptional({ example: 'Dampak updated' })
  @IsOptional()
  @IsString()
  dampak?: string;

  @ApiPropertyOptional({
    enum: ['RASIO', 'NILAI_TUNGGAL'],
    example: 'RASIO',
  })
  @IsOptional()
  @IsEnum(['RASIO', 'NILAI_TUNGGAL'])
  mode?: 'RASIO' | 'NILAI_TUNGGAL';

  @ApiPropertyOptional({ example: 'Pembilang Updated' })
  @IsOptional()
  @IsString()
  pembilangLabel?: string;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsNumber()
  pembilangValue?: number;

  @ApiPropertyOptional({ example: 'Penyebut Updated' })
  @IsOptional()
  @IsString()
  penyebutLabel?: string;

  @ApiPropertyOptional({ example: 12000 })
  @IsOptional()
  @IsNumber()
  penyebutValue?: number;

  @ApiPropertyOptional({ example: 'pemb * 100 / peny' })
  @IsOptional()
  @IsString()
  formula?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPercent?: boolean;

  @ApiPropertyOptional({ example: 0.035 })
  @IsOptional()
  @IsNumber()
  hasil?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  peringkat?: number;

  @ApiPropertyOptional({ example: 12.5 })
  @IsOptional()
  @IsNumber()
  weighted?: number;

  @ApiPropertyOptional({ example: 'Keterangan updated' })
  @IsOptional()
  @IsString()
  keterangan?: string;
}
