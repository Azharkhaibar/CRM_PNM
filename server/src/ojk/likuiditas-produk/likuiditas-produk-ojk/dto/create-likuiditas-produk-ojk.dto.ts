// src/ojk/likuiditas-produk/likuiditas-produk-ojk/dto/create-likuiditas-produk-ojk.dto.ts
import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';

export class CreateLikuiditasProdukOjkDto {
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
