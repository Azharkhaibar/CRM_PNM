import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLikuiditasDto {
  @IsNotEmpty()
  @IsNumber()
  bobot: number;

  @IsNotEmpty()
  @IsString()
  parameter: string;

  @IsNotEmpty()
  @IsNumber()
  no_indikator: number;

  @IsNotEmpty()
  @IsString()
  indikator: string;

  @IsNotEmpty()
  @IsNumber()
  bobot_indikator: number;

  @IsNotEmpty()
  @IsString()
  sumber_resiko: string;

  @IsNotEmpty()
  @IsString()
  dampak: string;

  @IsNotEmpty()
  @IsString()
  low: string;

  @IsNotEmpty()
  @IsString()
  low_to_moderate: string;

  @IsNotEmpty()
  @IsString()
  moderate: string;

  @IsNotEmpty()
  @IsString()
  moderate_to_high: string;

  @IsNotEmpty()
  @IsString()
  high: string;

  @IsNotEmpty()
  @IsNumber()
  hasil: number;

  @IsOptional()
  @IsNumber()
  peringkat?: number;

  @IsOptional()
  @IsString()
  nama_pembilang?: string;

  @IsOptional()
  @IsString()
  nama_penyebut?: string;

  @IsOptional()
  @IsNumber()
  nilai_pembilang?: number;

  @IsOptional()
  @IsNumber()
  nilai_penyebut?: number;

  @IsOptional()
  @IsNumber()
  weighted?: number;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsNumber()
  pereview_hasil?: number;
}
