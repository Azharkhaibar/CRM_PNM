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
import { StratejikSection } from './stratejik-section.entity';

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

@Entity('stratejik')
@Index('IDX_STRATEJIK_PERIOD', ['year', 'quarter'])
@Index('IDX_STRATEJIK_SECTION', ['sectionId'])
export class Stratejik {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: Quarter })
  quarter: Quarter;

  @Column()
  sectionId: number;

  @ManyToOne(() => StratejikSection, (section) => section.stratejik, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sectionId' })
  section: StratejikSection;

  @Column({ type: 'varchar', length: 50 })
  no: string;

  @Column({ type: 'varchar', length: 255 })
  sectionLabel: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  bobotSection: number;

  @Column({ type: 'varchar', length: 50, name: 'no_indikator' })
  subNo: string;

  @Column({ type: 'varchar', length: 500 })
  indikator: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'bobot_indikator' })
  bobotIndikator: number;

  @Column({ type: 'text', nullable: true, name: 'sumber_resiko' })
  sumberRisiko: string | null;

  @Column({ type: 'text', nullable: true })
  dampak: string | null;

  // Risk categories
  @Column({ type: 'varchar', length: 100, nullable: true })
  low: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'low_to_moderate',
  })
  lowToModerate: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  moderate: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'moderate_to_high',
  })
  moderateToHigh: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  high: string | null;

  @Column({
    type: 'enum',
    enum: CalculationMode,
    default: CalculationMode.RASIO,
  })
  mode: CalculationMode;

  // Untuk mode RASIO dan NILAI_TUNGGAL
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'nama_pembilang',
  })
  pembilangLabel: string | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'total_pembilang',
  })
  pembilangValue: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'nama_penyebut',
  })
  penyebutLabel: string | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'total_penyebut',
  })
  penyebutValue: number | null;

  @Column({ type: 'text', nullable: true })
  formula: string | null;

  @Column({ type: 'boolean', default: false })
  isPercent: boolean;

  @Column({ type: 'text', nullable: true })
  hasil: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'hasil_text' })
  hasilText: string | null;

  @Column({ type: 'int' })
  peringkat: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  weighted: number;

  @Column({ type: 'text', nullable: true })
  keterangan: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updatedBy: string | null;
}
