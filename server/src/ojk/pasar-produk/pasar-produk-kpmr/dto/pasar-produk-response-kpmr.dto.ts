import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class KpmrPertanyaanPasarResponseDto {
  @ApiProperty({ description: 'ID Pertanyaan' })
  id: number;

  @ApiPropertyOptional({ description: 'Nomor pertanyaan' })
  nomor?: string;

  @ApiProperty({ description: 'Teks pertanyaan' })
  pertanyaan: string;

  @ApiPropertyOptional({ description: 'Skor per quarter' })
  skor?: {
    Q1?: number | null;
    Q2?: number | null;
    Q3?: number | null;
    Q4?: number | null;
  };

  @ApiPropertyOptional({ description: 'Indicator/description level' })
  indicator?: {
    strong?: string;
    satisfactory?: string;
    fair?: string;
    marginal?: string;
    unsatisfactory?: string;
  };

  @ApiPropertyOptional({ description: 'Evidence/bukti' })
  evidence?: string;

  @ApiPropertyOptional({ description: 'Catatan' })
  catatan?: string;

  @ApiProperty({ description: 'ID Aspek' })
  aspekId: number;

  @ApiProperty({ description: 'Index urutan' })
  orderIndex: number;

  @ApiProperty({ description: 'Dibuat pada' })
  createdAt: Date;

  @ApiProperty({ description: 'Diupdate pada' })
  updatedAt: Date;
}

export class KpmrAspekPasarResponseDto {
  @ApiProperty({ description: 'ID Aspek' })
  id: number;

  @ApiPropertyOptional({ description: 'Nomor aspek' })
  nomor?: string;

  @ApiProperty({ description: 'Judul aspek' })
  judul: string;

  @ApiProperty({ description: 'Bobot aspek' })
  bobot: number;

  @ApiPropertyOptional({ description: 'Deskripsi aspek' })
  deskripsi?: string;

  @ApiProperty({ description: 'ID KPMR OJK' })
  kpmrOjkId: number;

  @ApiProperty({ description: 'Index urutan' })
  orderIndex: number;

  @ApiPropertyOptional({ description: 'Skor rata-rata' })
  averageScore?: number;

  @ApiPropertyOptional({ description: 'Rating' })
  rating?: string;

  @ApiPropertyOptional({ description: 'Diupdate oleh' })
  updatedBy?: string;

  @ApiPropertyOptional({ description: 'Catatan' })
  notes?: string;

  @ApiProperty({ description: 'Dibuat pada' })
  createdAt: Date;

  @ApiProperty({ description: 'Diupdate pada' })
  updatedAt: Date;

  @ApiPropertyOptional({
    type: () => [KpmrPertanyaanPasarResponseDto],
    description: 'Daftar pertanyaan',
  })
  pertanyaanList?: KpmrPertanyaanPasarResponseDto[];
}

export class KpmrPasarOjkResponseDto {
  @ApiProperty({ description: 'ID KPMR' })
  id: number;

  @ApiProperty({ description: 'Tahun' })
  year: number;

  @ApiProperty({ description: 'Quarter' })
  quarter: number;

  @ApiProperty({ description: 'Status aktif' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Summary data' })
  summary?: {
    totalScore?: number;
    averageScore?: number;
    rating?: string;
    computedAt?: Date;
  };

  @ApiProperty({ description: 'Dibuat pada' })
  createdAt: Date;

  @ApiProperty({ description: 'Diupdate pada' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Dibuat oleh' })
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Diupdate oleh' })
  updatedBy?: string;

  @ApiProperty({ description: 'Versi' })
  version: string;

  @ApiProperty({ description: 'Status terkunci' })
  isLocked: boolean;

  @ApiPropertyOptional({ description: 'Tanggal terkunci' })
  lockedAt?: Date;

  @ApiPropertyOptional({ description: 'Dikunci oleh' })
  lockedBy?: string;

  @ApiPropertyOptional({ description: 'Catatan' })
  notes?: string;

  @ApiPropertyOptional({
    type: () => [KpmrAspekPasarResponseDto],
    description: 'Daftar aspek',
  })
  aspekList?: KpmrAspekPasarResponseDto[];
}
