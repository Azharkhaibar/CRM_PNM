import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateKpmrInvestasiDto {
  @IsString()
  @IsNotEmpty()
  tata_kelola_resiko: string;

  @IsString()
  @IsNotEmpty()
  strong: string;

  @IsString()
  @IsNotEmpty()
  satisfactory: string;

  @IsString()
  @IsNotEmpty()
  fair: string;

  @IsString()
  @IsNotEmpty()
  marginal: string;

  @IsString()
  @IsNotEmpty()
  unsatisfactory: string;

  @IsString()
  @IsNotEmpty()
  evidence: string;

  // TAMBAHKAN FIELD BARU
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  quarter: string;

  @IsString()
  @IsNotEmpty()
  aspek_no: string;

  @IsString()
  @IsNotEmpty()
  aspek_title: string;

  @IsNumber()
  @IsNotEmpty()
  aspek_bobot: number;

  @IsString()
  @IsNotEmpty()
  section_no: string;

  @IsString()
  @IsNotEmpty()
  section_title: string;

  @IsNumber()
  @IsOptional()
  section_skor?: number;
}
