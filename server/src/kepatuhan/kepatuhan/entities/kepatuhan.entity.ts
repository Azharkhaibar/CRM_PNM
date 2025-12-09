// src/entities/kepatuhan/kepatuhan.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { KepatuhanSection } from './kepatuhan-section.entity';

export enum CalculationMode {
  RASIO = 'RASIO',
  NILAI_TUNGGAL = 'NILAI_TUNGGAL',
  TEKS = 'TEKS',
}

export enum Quarter {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

@Entity('indikators_kepatuhan')
@Index('IDX_KEPATUHAN_PERIOD', ['year', 'quarter'])
@Index('IDX_KEPATUHAN_SECTION', ['sectionId'])
@Index('IDX_KEPATUHAN_SUBNO', ['subNo'])
export class Kepatuhan {
  @PrimaryGeneratedColumn()
  id: number;

  // ========== PERIODE ==========
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: Quarter })
  quarter: Quarter;

  // ========== RELASI SECTION ==========
  @Column({ name: 'section_id' })
  sectionId: number;

  @ManyToOne(() => KepatuhanSection, (section) => section.kepatuhan, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'section_id' })
  section: KepatuhanSection;

  // ========== DATA SECTION ==========
  @Column({ type: 'varchar', length: 50 })
  no: string; // No section, contoh: "7.1"

  @Column({ type: 'varchar', length: 500, name: 'section_label' })
  sectionLabel: string; // Parameter section

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'bobot_section' })
  bobotSection: number;

  // ========== DATA INDIKATOR ==========
  @Column({ type: 'varchar', length: 50, name: 'sub_no' })
  subNo: string; // Contoh: "7.1.1"

  @Column({ type: 'varchar', length: 1000 })
  indikator: string; // Deskripsi indikator

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'bobot_indikator' })
  bobotIndikator: number;

  // ========== ANALISIS RISIKO ==========
  @Column({ type: 'text', nullable: true, name: 'sumber_risiko' })
  sumberRisiko: string | null;

  @Column({ type: 'text', nullable: true })
  dampak: string | null;

  // ========== LEVEL RISIKO ==========
  @Column({ type: 'varchar', length: 200, nullable: true })
  low: string | null; // Contoh: "x ≤ 0.1%"

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'low_to_moderate',
  })
  lowToModerate: string | null; // Contoh: "0.1% < x ≤ 0.5%"

  @Column({ type: 'varchar', length: 200, nullable: true })
  moderate: string | null; // Contoh: "0.5% < x ≤ 1%"

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'moderate_to_high',
  })
  moderateToHigh: string | null; // Contoh: "1% < x ≤ 2%"

  @Column({ type: 'varchar', length: 200, nullable: true })
  high: string | null; // Contoh: "x > 2%"

  // ========== METODE PERHITUNGAN ==========
  @Column({
    type: 'enum',
    enum: CalculationMode,
    default: CalculationMode.RASIO,
  })
  mode: CalculationMode;

  @Column({ type: 'text', nullable: true })
  formula: string | null; // Rumus custom jika ada

  @Column({ type: 'boolean', default: false, name: 'is_percent' })
  isPercent: boolean;

  // ========== FAKTOR PERHITUNGAN ==========
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'pembilang_label',
  })
  pembilangLabel: string | null; // Label pembilang

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'pembilang_value',
  })
  pembilangValue: number | null; // Nilai pembilang

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'penyebut_label',
  })
  penyebutLabel: string | null; // Label penyebut

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'penyebut_value',
  })
  penyebutValue: number | null; // Nilai penyebut

  // ========== HASIL (Dihitung di frontend, disimpan di sini) ==========
  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  hasil: string | null; // Hasil numerik yang sudah dihitung

  @Column({ type: 'varchar', length: 1000, nullable: true, name: 'hasil_text' })
  hasilText: string | null; // Hasil teks untuk mode TEKS

  // ========== SKOR DAN BOBOT ==========
  @Column({ type: 'int' })
  peringkat: number; // 1-5

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  weighted: number; // Bobot tertimbang yang sudah dihitung

  @Column({ type: 'text', nullable: true })
  keterangan: string | null; // Keterangan tambahan

  // ========== AUDIT TRAIL ==========
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'created_by' })
  createdBy: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'updated_by' })
  updatedBy: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'deleted_by' })
  deletedBy: string | null;
}
