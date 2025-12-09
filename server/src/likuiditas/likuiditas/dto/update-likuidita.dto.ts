import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Quarter } from '../entities/likuiditas.entity';

export class UpdateSectionLikuiditasDto {
  @ApiPropertyOptional({ example: '3.1' })
  @IsOptional()
  @IsString()
  no?: string;

  @ApiPropertyOptional({ example: 'Parameter Likuiditas Updated' })
  @IsOptional()
  @IsString()
  parameter?: string;

  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @IsNumber()
  bobotSection?: number;

  @ApiPropertyOptional({ example: 'Deskripsi updated' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ enum: Quarter, example: 'Q2' })
  @IsOptional()
  @IsEnum(Quarter)
  quarter?: Quarter;
}

export class UpdateIndikatorLikuiditasDto {
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

  @ApiPropertyOptional({ example: '3.1.2' })
  @IsOptional()
  @IsString()
  subNo?: string;

  @ApiPropertyOptional({ example: 'Current Ratio Updated' })
  @IsOptional()
  @IsString()
  namaIndikator?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  bobotIndikator?: number;

  @ApiPropertyOptional({ example: 'Risiko updated' })
  @IsOptional()
  @IsString()
  sumberRisiko?: string;

  @ApiPropertyOptional({ example: 'Dampak updated' })
  @IsOptional()
  @IsString()
  dampak?: string;

  @ApiPropertyOptional({ example: 'x ≥ 1.6' })
  @IsOptional()
  @IsString()
  low?: string;

  @ApiPropertyOptional({ example: '1.4 ≤ x < 1.6' })
  @IsOptional()
  @IsString()
  lowToModerate?: string;

  @ApiPropertyOptional({ example: '1.2 ≤ x < 1.4' })
  @IsOptional()
  @IsString()
  moderate?: string;

  @ApiPropertyOptional({ example: '1.05 ≤ x < 1.2' })
  @IsOptional()
  @IsString()
  moderateToHigh?: string;

  @ApiPropertyOptional({ example: 'x < 1.05' })
  @IsOptional()
  @IsString()
  high?: string;

  @ApiPropertyOptional({
    enum: ['RASIO', 'NILAI_TUNGGAL', 'TEKS'],
    example: 'RASIO',
  })
  @IsOptional()
  @IsEnum(['RASIO', 'NILAI_TUNGGAL', 'TEKS'])
  mode?: 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';

  @ApiPropertyOptional({ example: 'Aktiva Updated' })
  @IsOptional()
  @IsString()
  pembilangLabel?: string;

  @ApiPropertyOptional({ example: 5500 })
  @IsOptional()
  @IsNumber()
  pembilangValue?: number;

  @ApiPropertyOptional({ example: 'Hutang Updated' })
  @IsOptional()
  @IsString()
  penyebutLabel?: string;

  @ApiPropertyOptional({ example: 4200 })
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

  @ApiPropertyOptional({ example: '1.31' })
  @IsOptional()
  @IsString()
  hasil?: string;

  @ApiPropertyOptional({ example: 'Hasil updated' })
  @IsOptional()
  @IsString()
  hasilText?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  peringkat?: number;

  @ApiPropertyOptional({ example: 18.5 })
  @IsOptional()
  @IsNumber()
  weighted?: number;

  @ApiPropertyOptional({ example: 'Keterangan updated' })
  @IsOptional()
  @IsString()
  keterangan?: string;
}
