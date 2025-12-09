import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Quarter } from '../entities/likuiditas.entity';

export class CreateSectionLikuiditasDto {
  @ApiProperty({ example: '3.1', description: 'Nomor section' })
  @IsString()
  no: string;

  @ApiProperty({ example: 100, description: 'Bobot section dalam persen' })
  @IsNumber()
  bobotSection: number;

  @ApiProperty({ example: 'Parameter Likuiditas', description: 'Nama section' })
  @IsString()
  parameter: string;

  @ApiPropertyOptional({ example: 'Deskripsi section', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 2024, description: 'Tahun' })
  @IsInt()
  year: number;

  @ApiProperty({ enum: Quarter, example: 'Q1', description: 'Triwulan' })
  @IsEnum(Quarter)
  quarter: Quarter;
}

export class CreateIndikatorLikuiditasDto {
  @ApiProperty({ example: 1, description: 'ID section' })
  @IsInt()
  sectionId: number;

  @ApiProperty({ example: '3.1.1', description: 'Sub nomor indikator' })
  @IsString()
  subNo: string;

  @ApiProperty({ example: 'Current Ratio', description: 'Nama indikator' })
  @IsString()
  namaIndikator: string;

  @ApiProperty({ example: 50, description: 'Bobot indikator dalam persen' })
  @IsNumber()
  bobotIndikator: number;

  @ApiPropertyOptional({
    example: 'Penurunan kualitas piutang',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  sumberRisiko?: string | null;

  @ApiPropertyOptional({ example: 'Gagal bayar kewajiban', nullable: true })
  @IsOptional()
  @IsString()
  dampak?: string | null;

  @ApiPropertyOptional({ example: 'x ≥ 1.5', nullable: true })
  @IsOptional()
  @IsString()
  low?: string | null;

  @ApiPropertyOptional({ example: '1.3 ≤ x < 1.5', nullable: true })
  @IsOptional()
  @IsString()
  lowToModerate?: string | null;

  @ApiPropertyOptional({ example: '1.1 ≤ x < 1.3', nullable: true })
  @IsOptional()
  @IsString()
  moderate?: string | null;

  @ApiPropertyOptional({ example: '1.0 ≤ x < 1.1', nullable: true })
  @IsOptional()
  @IsString()
  moderateToHigh?: string | null;

  @ApiPropertyOptional({ example: 'x < 1.0', nullable: true })
  @IsOptional()
  @IsString()
  high?: string | null;

  @ApiProperty({ enum: ['RASIO', 'NILAI_TUNGGAL', 'TEKS'], example: 'RASIO' })
  @IsEnum(['RASIO', 'NILAI_TUNGGAL', 'TEKS'])
  mode: 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';

  @ApiPropertyOptional({ example: 'Aktiva Lancar (Jutaan)', nullable: true })
  @IsOptional()
  @IsString()
  pembilangLabel?: string | null;

  @ApiPropertyOptional({ example: 5000, nullable: true })
  @IsOptional()
  @IsNumber()
  pembilangValue?: number | null;

  @ApiPropertyOptional({ example: 'Hutang Lancar (Jutaan)', nullable: true })
  @IsOptional()
  @IsString()
  penyebutLabel?: string | null;

  @ApiPropertyOptional({ example: 4000, nullable: true })
  @IsOptional()
  @IsNumber()
  penyebutValue?: number | null;

  @ApiPropertyOptional({ example: 'pemb / peny', nullable: true })
  @IsOptional()
  @IsString()
  formula?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPercent?: boolean;

  @ApiPropertyOptional({ example: '1.25', nullable: true })
  @IsOptional()
  @IsString()
  hasil?: string | null;

  @ApiPropertyOptional({ example: 'Hasil perhitungan', nullable: true })
  @IsOptional()
  @IsString()
  hasilText?: string | null;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  peringkat?: number;

  @ApiPropertyOptional({ example: 15.75 })
  @IsOptional()
  @IsNumber()
  weighted?: number;

  @ApiPropertyOptional({ example: 'Keterangan tambahan', nullable: true })
  @IsOptional()
  @IsString()
  keterangan?: string | null;

  @ApiProperty({ example: 2024 })
  @IsInt()
  year: number;

  @ApiProperty({ enum: Quarter, example: 'Q1' })
  @IsEnum(Quarter)
  quarter: Quarter;
}
