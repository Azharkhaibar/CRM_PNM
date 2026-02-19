// src/ojk/likuiditas-produk/likuiditas-produk-ojk/dto/likuiditas-produk-inherent.dto.ts
import {
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
  IsNotEmpty,
  IsEnum,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

// === ENUMS ===
export enum LikuiditasKategoriModel {
  TANPA_MODEL = 'tanpa_model',
  STANDAR = 'standar',
  KOMPREHENSIF = 'komprehensif',
}

export enum LikuiditasKategoriUnderlying {
  KEWAJIBAN = 'kewajiban',
  ASET_LANCAR = 'aset_lancar',
  ARUS_KAS = 'arus_kas',
  RASIO = 'rasio',
}

export enum LikuiditasKategoriPrinsip {
  SYARIAH = 'syariah',
  KONVENSIONAL = 'konvensional',
}

export enum LikuiditasKategoriJenis {
  JANGKA_PENDEK = 'jangka_pendek',
  JANGKA_MENENGAH = 'jangka_menengah',
  JANGKA_PANJANG = 'jangka_panjang',
}

export enum LikuiditasJudulType {
  TANPA_FAKTOR = 'Tanpa Faktor',
  SATU_FAKTOR = 'Satu Faktor',
  DUA_FAKTOR = 'Dua Faktor',
}

// === SUBCLASSES ===

export class LikuiditasKategoriDto {
  @IsOptional()
  @IsString()
  @IsIn(['tanpa_model', 'standar', 'komprehensif'], {
    message: 'Model harus salah satu dari: tanpa_model, standar, komprehensif',
  })
  model?: string;

  @IsOptional()
  @IsString()
  @IsIn(['syariah', 'konvensional'], {
    message: 'Prinsip harus salah satu dari: syariah, konvensional',
  })
  prinsip?: string;

  @IsOptional()
  @IsString()
  @IsIn(['jangka_pendek', 'jangka_menengah', 'jangka_panjang'], {
    message:
      'Jenis harus salah satu dari: jangka_pendek, jangka_menengah, jangka_panjang',
  })
  jenis?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['kewajiban', 'aset_lancar', 'arus_kas', 'rasio'], { each: true })
  underlying?: string[];
}

export class LikuiditasJudulDto {
  @IsOptional()
  @IsEnum(LikuiditasJudulType)
  type?: LikuiditasJudulType;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  value?: string | number | null;

  @IsOptional()
  @IsString()
  pembilang?: string;

  @IsOptional()
  valuePembilang?: string | number | null;

  @IsOptional()
  @IsString()
  penyebut?: string;

  @IsOptional()
  valuePenyebut?: string | number | null;

  @IsOptional()
  @IsString()
  formula?: string;

  @IsOptional()
  @IsBoolean()
  percent?: boolean;
}

export class LikuiditasRiskindikatorDto {
  @IsOptional()
  @IsString()
  low?: string;

  @IsOptional()
  @IsString()
  lowToModerate?: string;

  @IsOptional()
  @IsString()
  moderate?: string;

  @IsOptional()
  @IsString()
  moderateToHigh?: string;

  @IsOptional()
  @IsString()
  high?: string;
}

// === MAIN DTOs ===

// DTO untuk membuat LikuiditasProdukOjk (header)
export class CreateLikuiditasProdukInherentDto {
  @IsInt()
  @Min(2000)
  year: number;

  @IsInt()
  @Min(1)
  @Max(4)
  quarter: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  version?: string;
}

// DTO untuk update LikuiditasProdukOjk
export class UpdateLikuiditasProdukInherentDto {
  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  quarter?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  summary?: {
    totalWeighted?: number;
    summaryBg?: string;
    computedAt?: Date;
  };

  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @IsOptional()
  @IsString()
  lockedBy?: string;

  @IsOptional()
  lockedAt?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}

// DTO untuk Parameter (Create)
export class CreateLikuiditasParameterDto {
  @IsOptional()
  @IsString()
  nomor?: string;

  @IsString()
  @IsNotEmpty()
  judul: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  bobot: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LikuiditasKategoriDto)
  kategori?: LikuiditasKategoriDto;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

// DTO untuk Parameter (Update)
export class UpdateLikuiditasParameterDto {
  @IsOptional()
  @IsString()
  nomor?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  judul?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bobot?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LikuiditasKategoriDto)
  kategori?: LikuiditasKategoriDto;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

// DTO untuk Nilai (Create)
export class CreateLikuiditasNilaiDto {
  @IsOptional()
  @IsString()
  nomor?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LikuiditasJudulDto)
  judul: LikuiditasJudulDto;

  @IsNumber()
  @Min(0)
  @Max(100)
  bobot: number;

  @IsOptional()
  @IsString()
  portofolio?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LikuiditasRiskindikatorDto)
  riskindikator?: LikuiditasRiskindikatorDto;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

// DTO untuk Nilai (Update)
export class UpdateLikuiditasNilaiDto {
  @IsOptional()
  @IsString()
  nomor?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LikuiditasJudulDto)
  judul?: LikuiditasJudulDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bobot?: number;

  @IsOptional()
  @IsString()
  portofolio?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LikuiditasRiskindikatorDto)
  riskindikator?: LikuiditasRiskindikatorDto;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

// DTO untuk Reorder Parameters
export class ReorderLikuiditasParametersDto {
  @IsArray()
  @IsInt({ each: true })
  parameterIds: number[];
}

// DTO untuk Reorder Nilai
export class ReorderLikuiditasNilaiDto {
  @IsArray()
  @IsInt({ each: true })
  nilaiIds: number[];
}

// DTO untuk Summary
export class UpdateLikuiditasSummaryDto {
  @IsOptional()
  @IsNumber()
  totalWeighted?: number;

  @IsOptional()
  @IsString()
  summaryBg?: string;

  @IsOptional()
  computedAt?: Date;
}

// DTO untuk Import/Export
export class LikuiditasExportImportMetadataDto {
  @IsInt()
  @Min(2000)
  year: number;

  @IsInt()
  @Min(1)
  @Max(4)
  quarter: number;

  @IsOptional()
  @IsString()
  exportedAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalParameters?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalNilai?: number;
}

export class LikuiditasExportParameterDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  nomor?: string;

  @IsString()
  judul: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  bobot: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LikuiditasKategoriDto)
  kategori?: LikuiditasKategoriDto;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LikuiditasExportNilaiDto)
  nilaiList?: LikuiditasExportNilaiDto[];
}

export class LikuiditasExportNilaiDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  nomor?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LikuiditasJudulDto)
  judul: LikuiditasJudulDto;

  @IsNumber()
  @Min(0)
  @Max(100)
  bobot: number;

  @IsOptional()
  @IsString()
  portofolio?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LikuiditasRiskindikatorDto)
  riskindikator?: LikuiditasRiskindikatorDto;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class LikuiditasImportExportDto {
  @ValidateNested()
  @Type(() => LikuiditasExportImportMetadataDto)
  metadata: LikuiditasExportImportMetadataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LikuiditasExportParameterDto)
  parameters: LikuiditasExportParameterDto[];
}
