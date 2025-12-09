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
import { InvestasiSection } from './new-investasi-section.entity';

export enum CalculationMode {
  RASIO = 'RASIO',
  NILAI_TUNGGAL = 'NILAI_TUNGGAL',
}

export enum Quarter {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

@Entity('investasi')
@Index('IDX_INVESTASI_PERIOD', ['year', 'quarter'])
@Index('IDX_INVESTASI_SECTION', ['sectionId'])
export class Investasi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: Quarter })
  quarter: Quarter;

  @Column()
  sectionId: number;

  // PERBAIKAN: Sesuaikan dengan property yang ada di InvestasiSection
  @ManyToOne(() => InvestasiSection, (section) => section.investasi, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sectionId' })
  section: InvestasiSection;

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
  sumberRisiko: string;

  @Column({ type: 'text', nullable: true })
  dampak: string;

  @Column({ type: 'varchar', length: 100, default: 'x ≤ 1%' })
  low: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: '1% < x ≤ 2%',
    name: 'low_to_moderate',
  })
  lowToModerate: string;

  @Column({ type: 'varchar', length: 100, default: '2% < x ≤ 3%' })
  moderate: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: '3% < x ≤ 4%',
    name: 'moderate_to_high',
  })
  moderateToHigh: string;

  @Column({ type: 'varchar', length: 100, default: 'x > 4%' })
  high: string;

  @Column({
    type: 'enum',
    enum: CalculationMode,
    default: CalculationMode.RASIO,
  })
  mode: CalculationMode;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'nama_pembilang',
  })
  numeratorLabel: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'total_pembilang',
  })
  numeratorValue: number;

  @Column({ type: 'varchar', length: 255, name: 'nama_penyebut' })
  denominatorLabel: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'total_penyebut' })
  denominatorValue: number;

  @Column({ type: 'text', nullable: true })
  formula: string;

  @Column({ type: 'boolean', default: false })
  isPercent: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
  hasil: number;

  @Column({ type: 'int' })
  peringkat: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  weighted: number;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updatedBy: string;
}
