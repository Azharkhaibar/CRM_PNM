import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CloneMonthlyValuesDto {
  @IsNotEmpty({ message: 'Tahun wajib diisi' })
  @IsNumber()
  @Type(() => Number)
  year: number;

  @IsNotEmpty({ message: 'Bulan asal wajib diisi' })
  @IsNumber()
  @Type(() => Number)
  sourceMonth: number;

  @IsNotEmpty({ message: 'Bulan tujuan wajib diisi' })
  @IsNumber()
  @Type(() => Number)
  targetMonth: number;

  @IsOptional()
  @IsBoolean()
  overrideExisting?: boolean;

  @IsOptional()
  @IsArray()
  parameterIds?: number[];
}

export class CloneYearlyParametersDto {
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
  copyMonthlyValues?: boolean;

  @IsOptional()
  @IsBoolean()
  overrideExisting?: boolean;
}

export class UndoCloneMonthlyDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  targetMonth: number;

  @IsOptional()
  @IsArray()
  parameterIds?: number[];
}

export class UndoCloneYearlyDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  sourceYear: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  targetYear: number;
}
