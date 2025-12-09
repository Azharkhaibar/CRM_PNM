import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReputasiSectionDto {
  @IsString()
  @IsNotEmpty()
  no: string; // Contoh: "5.1"

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  bobotSection: number;

  @IsString()
  @IsNotEmpty()
  parameter: string; // Contoh: "Perjanjian pengelolaan produk"

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
