// src/features/Dashboard/pages/RiskProfile/pages/Strategik/dto/create-strategik.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
  Max,
  Length,
  ValidateIf,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
// import {
//   CalculationMode,
//   Quarter,
// } from '../../../../entities/strategik/stratejik.entity';

import { CalculationMode, Quarter } from '../entities/reputasi.entity';
export class CreateReputasiDto {
  // ========== PERIODE ==========
  @ApiProperty({ example: 2024, description: 'Tahun data' })
  @IsNotEmpty({ message: 'Tahun tidak boleh kosong' })
  @IsInt({ message: 'Tahun harus berupa angka bulat' })
  @Min(2000, { message: 'Tahun minimal 2000' })
  @Max(2100, { message: 'Tahun maksimal 2100' })
  @Type(() => Number)
  year: number;

  @ApiProperty({ example: 'Q1', enum: Quarter, description: 'Triwulan' })
  @IsNotEmpty({ message: 'Quarter tidak boleh kosong' })
  @IsEnum(Quarter, { message: 'Quarter harus Q1, Q2, Q3, atau Q4' })
  quarter: Quarter;

  // ========== RELASI SECTION ==========
  @ApiProperty({ example: 1, description: 'ID section dari master' })
  @IsNotEmpty({ message: 'Section ID tidak boleh kosong' })
  @IsInt({ message: 'Section ID harus berupa angka bulat' })
  @Type(() => Number)
  sectionId: number;

  // ========== DATA SECTION (Copy dari master) ==========
  @ApiProperty({ example: '6.1', description: 'Nomor section' })
  @IsNotEmpty({ message: 'Nomor section tidak boleh kosong' })
  @IsString({ message: 'Nomor section harus berupa string' })
  @Length(1, 50, { message: 'Nomor section maksimal 50 karakter' })
  no: string;

  @ApiProperty({
    example: 'Pencapaian Rencana Bisnis Perusahaan',
    description: 'Label section',
  })
  @IsNotEmpty({ message: 'Section label tidak boleh kosong' })
  @IsString({ message: 'Section label harus berupa string' })
  @Length(1, 500, { message: 'Section label maksimal 500 karakter' })
  sectionLabel: string;

  @ApiProperty({ example: 10, description: 'Bobot section dalam persen' })
  @IsNotEmpty({ message: 'Bobot section tidak boleh kosong' })
  @IsNumber({}, { message: 'Bobot section harus berupa angka' })
  @Min(0, { message: 'Bobot section minimal 0' })
  @Max(100, { message: 'Bobot section maksimal 100' })
  @Type(() => Number)
  bobotSection: number;

  // ========== DATA INDIKATOR ==========
  @ApiProperty({
    example: '6.1.1',
    description: 'Nomor sub indikator (unik per periode+section)',
  })
  @IsNotEmpty({ message: 'Sub No tidak boleh kosong' })
  @IsString({ message: 'Sub No harus berupa string' })
  @Length(1, 50, { message: 'Sub No maksimal 50 karakter' })
  subNo: string;

  @ApiProperty({
    example: 'Pencapaian KPI Kuartal',
    description: 'Nama indikator',
  })
  @IsNotEmpty({ message: 'Indikator tidak boleh kosong' })
  @IsString({ message: 'Indikator harus berupa string' })
  @Length(1, 1000, { message: 'Indikator maksimal 1000 karakter' })
  indikator: string;

  @ApiProperty({ example: 25, description: 'Bobot indikator dalam persen' })
  @IsNotEmpty({ message: 'Bobot indikator tidak boleh kosong' })
  @IsNumber({}, { message: 'Bobot indikator harus berupa angka' })
  @Min(0, { message: 'Bobot indikator minimal 0' })
  @Max(100, { message: 'Bobot indikator maksimal 100' })
  @Type(() => Number)
  bobotIndikator: number;

  // ========== ANALISIS RISIKO ==========
  @ApiProperty({
    example: 'Target KPI yang terlalu ambisius atau tidak realistis',
    required: false,
    description: 'Sumber risiko',
  })
  @IsOptional()
  @IsString({ message: 'Sumber risiko harus berupa string' })
  sumberRisiko?: string;

  @ApiProperty({
    example: 'Tujuan tahunan organisasi bisa meleset',
    required: false,
    description: 'Dampak risiko',
  })
  @IsOptional()
  @IsString({ message: 'Dampak harus berupa string' })
  dampak?: string;

  // ========== LEVEL RISIKO ==========
  @ApiProperty({ example: 'x > 90%', required: false })
  @IsOptional()
  @IsString({ message: 'Low harus berupa string' })
  @Length(0, 200, { message: 'Low maksimal 200 karakter' })
  low?: string;

  @ApiProperty({ example: '90% ≥ x > 70%', required: false })
  @IsOptional()
  @IsString({ message: 'Low to moderate harus berupa string' })
  @Length(0, 200, { message: 'Low to moderate maksimal 200 karakter' })
  lowToModerate?: string;

  @ApiProperty({ example: '70% ≥ x > 50%', required: false })
  @IsOptional()
  @IsString({ message: 'Moderate harus berupa string' })
  @Length(0, 200, { message: 'Moderate maksimal 200 karakter' })
  moderate?: string;

  @ApiProperty({ example: '50% ≥ x > 30%', required: false })
  @IsOptional()
  @IsString({ message: 'Moderate to high harus berupa string' })
  @Length(0, 200, { message: 'Moderate to high maksimal 200 karakter' })
  moderateToHigh?: string;

  @ApiProperty({ example: 'x < 30%', required: false })
  @IsOptional()
  @IsString({ message: 'High harus berupa string' })
  @Length(0, 200, { message: 'High maksimal 200 karakter' })
  high?: string;

  // ========== METODE PERHITUNGAN ==========
  @ApiProperty({
    example: CalculationMode.RASIO,
    enum: CalculationMode,
    default: CalculationMode.RASIO,
  })
  @IsNotEmpty({ message: 'Mode tidak boleh kosong' })
  @IsEnum(CalculationMode, {
    message: 'Mode harus RASIO, NILAI_TUNGGAL, atau TEKS',
  })
  mode: CalculationMode = CalculationMode.RASIO;

  @ApiProperty({ example: 'pemb / peny', required: false })
  @IsOptional()
  @IsString({ message: 'Formula harus berupa string' })
  formula?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean({ message: 'Is percent harus berupa boolean' })
  isPercent?: boolean = false;

  // ========== FAKTOR PERHITUNGAN ==========
  @ApiProperty({
    example: 'Actual KPI',
    required: false,
    description: 'Hanya untuk mode RASIO',
  })
  @ValidateIf((o) => o.mode === CalculationMode.RASIO)
  @IsOptional()
  @IsString({ message: 'Pembilang label harus berupa string' })
  @Length(0, 255, { message: 'Pembilang label maksimal 255 karakter' })
  pembilangLabel?: string;

  @ApiProperty({
    example: 96.55,
    required: false,
    description: 'Hanya untuk mode RASIO',
  })
  @ValidateIf((o) => o.mode === CalculationMode.RASIO)
  @IsOptional()
  @IsNumber({}, { message: 'Pembilang value harus berupa angka' })
  @Type(() => Number)
  pembilangValue?: number;

  @ApiProperty({
    example: 'Target KPI',
    required: false,
    description: 'Tidak untuk mode TEKS',
  })
  @ValidateIf((o) => o.mode !== CalculationMode.TEKS)
  @IsOptional()
  @IsString({ message: 'Penyebut label harus berupa string' })
  @Length(0, 255, { message: 'Penyebut label maksimal 255 karakter' })
  penyebutLabel?: string;

  @ApiProperty({
    example: 100,
    required: false,
    description: 'Tidak untuk mode TEKS',
  })
  @ValidateIf((o) => o.mode !== CalculationMode.TEKS)
  @IsOptional()
  @IsNumber({}, { message: 'Penyebut value harus berupa angka' })
  @Type(() => Number)
  penyebutValue?: number;

  // ========== HASIL ==========
  @ApiProperty({ example: 0.9655, required: false })
  @ValidateIf((o) => o.mode !== CalculationMode.TEKS)
  @IsOptional()
  @IsNumber({}, { message: 'Hasil harus berupa angka' })
  @Type(() => Number)
  hasil?: number;

  @ApiProperty({
    example: '96.55%',
    required: false,
    description: 'Hanya untuk mode TEKS',
  })
  @ValidateIf((o) => o.mode === CalculationMode.TEKS)
  @IsOptional()
  @IsString({ message: 'Hasil text harus berupa string' })
  @Length(0, 1000, { message: 'Hasil text maksimal 1000 karakter' })
  hasilText?: string;

  // ========== SKOR DAN BOBOT ==========
  @ApiProperty({ example: 1, description: 'Peringkat 1-5' })
  @IsNotEmpty({ message: 'Peringkat tidak boleh kosong' })
  @IsInt({ message: 'Peringkat harus berupa angka bulat' })
  @Min(1, { message: 'Peringkat minimal 1' })
  @Max(5, { message: 'Peringkat maksimal 5' })
  @Type(() => Number)
  peringkat: number;

  @ApiProperty({ example: 0.5, description: 'Weighted value' })
  @IsNotEmpty({ message: 'Weighted tidak boleh kosong' })
  @IsNumber({}, { message: 'Weighted harus berupa angka' })
  @Min(0, { message: 'Weighted minimal 0' })
  @Type(() => Number)
  weighted: number;

  @ApiProperty({ example: 'Keterangan tambahan', required: false })
  @IsOptional()
  @IsString({ message: 'Keterangan harus berupa string' })
  keterangan?: string;

  // ========== AUDIT TRAIL (Opsional) ==========
  @ApiProperty({ example: 'user123', required: false })
  @IsOptional()
  @IsString({ message: 'Created by harus berupa string' })
  createdBy?: string;
}
