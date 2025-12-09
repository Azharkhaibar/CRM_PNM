import { IsString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestasiDto {
  @IsInt()
  @Type(() => Number)
  sectionId: number;

  @IsInt()
  @Type(() => Number)
  year: number;

  @IsString()
  quarter: string;

  @IsString()
  no: string;

  @IsString()
  subNo: string;

  @IsString()
  sectionLabel: string;

  @Type(() => Number)
  @IsNumber()
  bobotSection: number;

  @Type(() => Number)
  @IsNumber()
  bobotIndikator: number;

  @IsString()
  mode: string;

  @IsString()
  numeratorLabel: string;

  @Type(() => Number)
  @IsNumber()
  numeratorValue: number;

  @IsString()
  denominatorLabel: string;

  @Type(() => Number)
  @IsNumber()
  denominatorValue: number;

  @Type(() => Number)
  @IsNumber()
  hasil: number;

  @Type(() => Number)
  @IsNumber()
  weighted: number;

  @IsString()
  peringkat: string;
}
