// src/features/Dashboard/pages/RiskProfile/pages/Strategik/dto/create-strategik-section.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  Length,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Quarter } from '../entities/kepatuhan.entity';

export class CreateKepatuhanSectionDto {
  @ApiProperty({
    example: '6.1',
    description: 'Nomor section (unik dengan parameter + periode)',
  })
  @IsNotEmpty({ message: 'Nomor section tidak boleh kosong' })
  @IsString({ message: 'Nomor section harus berupa string' })
  @Length(1, 50, { message: 'Nomor section maksimal 50 karakter' })
  no: string;

  @ApiProperty({
    example: 'Pencapaian Rencana Bisnis Perusahaan',
    description: 'Nama section',
  })
  @IsNotEmpty({ message: 'Parameter tidak boleh kosong' })
  @IsString({ message: 'Parameter harus berupa string' })
  @Length(1, 500, { message: 'Parameter maksimal 500 karakter' })
  parameter: string;

  @ApiProperty({
    example: 10,
    description: 'Bobot section dalam persen',
    required: false,
    default: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Bobot section harus berupa angka' })
  @Min(0, { message: 'Bobot section minimal 0' })
  @Max(100, { message: 'Bobot section maksimal 100' })
  @Type(() => Number)
  bobotSection?: number = 100;

  @ApiProperty({ required: false, description: 'Deskripsi tambahan section' })
  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa string' })
  description?: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Urutan tampilan section',
  })
  @IsOptional()
  @IsNumber({}, { message: 'Sort order harus berupa angka' })
  @Type(() => Number)
  sortOrder?: number = 0;

  // TAMBAHKAN PERIODE untuk section
  @ApiProperty({ example: 2024, description: 'Tahun data section' })
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

  @ApiProperty({
    example: true,
    required: false,
    description: 'Status aktif section',
  })
  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  isActive?: boolean = true;
}
