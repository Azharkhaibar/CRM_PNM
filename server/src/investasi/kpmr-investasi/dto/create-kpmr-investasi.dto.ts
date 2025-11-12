import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateKpmrInvestasiDto {
  // 📅 Periode
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  quarter: string;

  // 🧩 Aspek
  @IsString()
  @IsOptional()
  aspekNo?: string;

  @IsString()
  @IsOptional()
  aspekTitle?: string;

  @IsNumber()
  @IsOptional()
  aspekBobot?: number;

  // 📘 Section
  @IsString()
  @IsOptional()
  sectionNo?: string;

  @IsNumber()
  @IsOptional()
  sectionSkor?: number;

  // ❓ Indikator / Pertanyaan section
  @IsString()
  @IsOptional()
  indikator?: string;

  // 📎 Evidence / bukti
  @IsString()
  @IsOptional()
  evidence?: string;

  // 🧠 Penilaian / Level
  @IsString()
  @IsOptional()
  level1?: string;

  @IsString()
  @IsOptional()
  level2?: string;

  @IsString()
  @IsOptional()
  level3?: string;

  @IsString()
  @IsOptional()
  level4?: string;

  @IsString()
  @IsOptional()
  level5?: string;

  @IsString()
  @IsOptional()
  tata_kelola_resiko?: string;

  @IsString()
  @IsOptional()
  strong?: string;

  @IsString()
  @IsOptional()
  satisfactory?: string;

  @IsString()
  @IsOptional()
  fair?: string;

  @IsString()
  @IsOptional()
  marginal?: string;

  @IsString()
  @IsOptional()
  unsatisfactory?: string;
}
