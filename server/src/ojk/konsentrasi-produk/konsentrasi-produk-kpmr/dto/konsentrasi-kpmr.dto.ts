// src/ojk/konsentrasi/konsentrasi-kpmr/dto/konsentrasi-kpmr.dto.ts

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
export enum KategoriModel {
  TANPA_MODEL = 'tanpa_model',
  OPEN_END = 'open_end',
  TERSTRUKTUR = 'terstruktur',
}

export enum KategoriUnderlying {
  INDEKS = 'indeks',
  EBA = 'eba',
  DINFRA = 'dinfra',
  OBLIGASI = 'obligasi',
}

export enum KategoriPrinsip {
  SYARIAH = 'syariah',
  KONVENSIONAL = 'konvensional',
}

export enum KategoriJenis {
  PASAR_UANG = 'pasar_uang',
  PENDAPATAN_TETAP = 'pendapatan_tetap',
  CAMPURAN = 'campuran',
  SAHAM = 'saham',
  INDEKS = 'indeks',
  TERPROTEKSI = 'terproteksi',
}

export enum JudulType {
  TANPA_FAKTOR = 'Tanpa Faktor',
  SATU_FAKTOR = 'Satu Faktor',
  DUA_FAKTOR = 'Dua Faktor',
}

// === KPMR ENUMS ===
export enum KpmrQuarterEnum {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

// === SKOR DTO ===
export class KpmrSkorDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  Q1?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  Q2?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  Q3?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  Q4?: number;
}

// === INDICATOR DTO ===
export class KpmrIndicatorDto {
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
}

// === CREATE DTOs ===
export class CreateKpmrKonsentrasiOjkDto {
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

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsObject()
  summary?: any;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKpmrAspekKonsentrasiDto)
  aspekList?: CreateKpmrAspekKonsentrasiDto[];
}

export class CreateKpmrAspekKonsentrasiDto {
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
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsInt()
  kpmrOjkId?: number;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKpmrPertanyaanKonsentrasiDto)
  pertanyaanList?: CreateKpmrPertanyaanKonsentrasiDto[];
}

export class CreateKpmrPertanyaanKonsentrasiDto {
  @IsOptional()
  @IsString()
  nomor?: string;

  @IsString()
  @IsNotEmpty()
  pertanyaan: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => KpmrSkorDto)
  skor?: KpmrSkorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => KpmrIndicatorDto)
  indicator?: KpmrIndicatorDto;

  @IsOptional()
  @IsString()
  evidence?: string;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsInt()
  aspekId?: number;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

// === UPDATE DTOs ===
export class UpdateKpmrKonsentrasiOjkDto {
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
  @IsObject()
  summary?: any;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}

export class UpdateKpmrAspekKonsentrasiDto {
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
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateKpmrPertanyaanKonsentrasiDto {
  @IsOptional()
  @IsString()
  nomor?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pertanyaan?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => KpmrSkorDto)
  skor?: KpmrSkorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => KpmrIndicatorDto)
  indicator?: KpmrIndicatorDto;

  @IsOptional()
  @IsString()
  evidence?: string;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

// === SKOR DTO ===
export class UpdateSkorDto {
  @IsEnum(['Q1', 'Q2', 'Q3', 'Q4'], {
    message: 'Quarter harus Q1, Q2, Q3, atau Q4',
  })
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';

  @IsInt()
  @Min(1)
  @Max(5)
  skor: number;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}

// === BULK UPDATE SKOR DTO ===
export class BulkUpdateItemDto {
  @IsInt()
  pertanyaanId: number;

  @IsEnum(['Q1', 'Q2', 'Q3', 'Q4'], {
    message: 'Quarter harus Q1, Q2, Q3, atau Q4',
  })
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';

  @IsInt()
  @Min(1)
  @Max(5)
  skor: number;
}

export class BulkUpdateSkorDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateItemDto)
  updates: BulkUpdateItemDto[];
}

// === REORDER DTOs ===
export class ReorderAspekDto {
  @IsArray()
  @IsInt({ each: true })
  aspekIds: number[];
}

export class ReorderPertanyaanDto {
  @IsArray()
  @IsInt({ each: true })
  pertanyaanIds: number[];
}

// === SUMMARY DTO ===
export class UpdateSummaryDto {
  @IsOptional()
  @IsNumber()
  totalScore?: number;

  @IsOptional()
  @IsNumber()
  averageScore?: number;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  computedAt?: Date;
}

// === RESPONSE DTOs ===
export class FrontendPertanyaanResponseDto {
  id: string;
  nomor?: string;
  pertanyaan: string;
  skor?: {
    Q1?: number;
    Q2?: number;
    Q3?: number;
    Q4?: number;
  };
  indicator?: {
    strong: string;
    satisfactory: string;
    fair: string;
    marginal: string;
    unsatisfactory: string;
  };
  evidence?: string;
  catatan?: string;
  orderIndex?: number;
}

export class FrontendAspekResponseDto {
  id: string;
  nomor?: string;
  judul: string;
  bobot: string;
  deskripsi?: string;
  orderIndex?: number;
  averageScore?: number;
  rating?: string;
  updatedBy?: string;
  notes?: string;
  pertanyaanList?: FrontendPertanyaanResponseDto[];
}

export class FrontendKpmrResponseDto {
  id: string;
  year: number;
  quarter: number;
  isActive?: boolean;
  isLocked?: boolean;
  version?: string;
  notes?: string;
  summary?: any;
  aspekList?: FrontendAspekResponseDto[];
  createdAt?: Date;
  updatedAt?: Date;
}

// === INHERENT ENUMS (untuk referensi) ===
export class KategoriDto {
  @IsOptional()
  @IsString()
  @IsIn(['tanpa_model', 'open_end', 'terstruktur'], {
    message: 'Model harus salah satu dari: tanpa_model, open_end, terstruktur',
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
  @IsIn(
    [
      'pasar_uang',
      'pendapatan_tetap',
      'campuran',
      'saham',
      'indeks',
      'terproteksi',
    ],
    {
      message:
        'Jenis harus salah satu dari: pasar_uang, pendapatan_tetap, campuran, saham, indeks, terproteksi',
    },
  )
  jenis?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['indeks', 'eba', 'dinfra', 'obligasi'], { each: true })
  underlying?: string[];
}

export class JudulDto {
  @IsOptional()
  @IsEnum(JudulType)
  type?: JudulType;

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

export class RiskindikatorDto {
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
