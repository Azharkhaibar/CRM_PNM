import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CloneHoldingKpmrDto {
  @IsNotEmpty({ message: 'Tahun asal wajib diisi' })
  @IsNumber()
  @Type(() => Number)
  sourceYear: number;

  @IsNotEmpty({ message: 'Tahun tujuan wajib diisi' })
  @IsNumber()
  @Type(() => Number)
  targetYear: number;

  @IsOptional()
  @IsBoolean()
  overrideExisting?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsString()
  sourceCategory?: string;
}
