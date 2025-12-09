export class CreateOperasionalDto {}
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Quarter } from '../entities/operasional.entity';
export class CreateSectionOperationalDto {
  @ApiProperty({ example: '4.1', description: 'Nomor section' })
  @IsString()
  no: string;

  @ApiProperty({ example: 100, description: 'Bobot section dalam persen' })
  @IsNumber()
  bobotSection: number;

  @ApiProperty({
    example: 'Kualitas Pengelolaan Risiko Operasional',
    description: 'Nama section/parameter',
  })
  @IsString()
  parameter: string;

  @ApiProperty({ example: 2024, description: 'Tahun' })
  @IsInt()
  year: number;

  @ApiProperty({ enum: Quarter, example: 'Q1', description: 'Triwulan' })
  @IsEnum(Quarter)
  quarter: Quarter;
}

export class CreateIndikatorOperationalDto {
  @ApiProperty({ example: 1, description: 'ID section' })
  @IsInt()
  sectionId: number;

  @ApiProperty({ example: '4.1.1', description: 'Sub nomor indikator' })
  @IsString()
  subNo: string;

  @ApiProperty({
    example: 'Jumlah kejadian fraud internal',
    description: 'Nama indikator',
  })
  @IsString()
  indikator: string;

  @ApiProperty({ example: 50, description: 'Bobot indikator dalam persen' })
  @IsNumber()
  bobotIndikator: number;

  @ApiPropertyOptional({
    example: 'Kelemahan pengendalian internal, kurangnya pemisahan fungsi.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  sumberRisiko?: string | null;

  @ApiPropertyOptional({
    example: 'Kerugian finansial dan reputasi perusahaan.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  dampak?: string | null;

  @ApiProperty({
    enum: ['RASIO', 'NILAI_TUNGGAL'],
    example: 'RASIO',
    description: 'Mode perhitungan',
  })
  @IsEnum(['RASIO', 'NILAI_TUNGGAL'])
  mode: 'RASIO' | 'NILAI_TUNGGAL';

  @ApiPropertyOptional({
    example: 'Kerugian operasional (juta rupiah)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  pembilangLabel?: string | null;

  @ApiPropertyOptional({ example: 250, nullable: true })
  @IsOptional()
  @IsNumber()
  pembilangValue?: number | null;

  @ApiPropertyOptional({
    example: 'Pendapatan operasional (juta rupiah)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  penyebutLabel?: string | null;

  @ApiPropertyOptional({ example: 10000, nullable: true })
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

  @ApiPropertyOptional({ example: 0.025, nullable: true })
  @IsOptional()
  @IsNumber()
  hasil?: number | null;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  peringkat?: number;

  @ApiPropertyOptional({ example: 10.0 })
  @IsOptional()
  @IsNumber()
  weighted?: number;

  @ApiPropertyOptional({
    example: 'Data per triwulan',
    nullable: true,
  })
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
