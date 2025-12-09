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
import { SectionLikuiditas } from './section-likuiditas.entity';

// Export Quarter sebagai ENUM (bukan type alias)
export enum Quarter {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

export enum CalculationMode {
  RASIO = 'RASIO',
  NILAI_TUNGGAL = 'NILAI_TUNGGAL',
  TEKS = 'TEKS',
}

@Entity('indikators_likuiditas')
@Index('IDX_LIKUIDITAS_PERIOD', ['year', 'quarter'])
@Index('IDX_LIKUIDITAS_SECTION', ['sectionId'])
export class Likuiditas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  // PERBAIKAN: Gunakan enum dengan type string
  @Column({
    type: 'varchar',
    length: 2,
  })
  quarter: Quarter;

  @Column({ name: 'section_id' })
  sectionId: number;

  @ManyToOne(() => SectionLikuiditas, (section) => section.indikators, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  section: SectionLikuiditas;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'sub_no',
  })
  subNo: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'nama_indikator',
  })
  namaIndikator: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'bobot_indikator',
  })
  bobotIndikator: number;

  @Column({
    type: 'text',
    nullable: true,
    name: 'sumber_risiko',
  })
  sumberRisiko: string | null;

  @Column({
    type: 'text',
    nullable: true,
    name: 'dampak',
  })
  dampak: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'low',
  })
  low: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'low_to_moderate',
  })
  lowToModerate: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'moderate',
  })
  moderate: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'moderate_to_high',
  })
  moderateToHigh: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'high',
  })
  high: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'RASIO',
    name: 'mode',
  })
  mode: CalculationMode;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'pembilang_label',
  })
  pembilangLabel: string | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'pembilang_value',
  })
  pembilangValue: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'penyebut_label',
  })
  penyebutLabel: string | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'penyebut_value',
  })
  penyebutValue: number | null;

  @Column({
    type: 'text',
    nullable: true,
    name: 'formula',
  })
  formula: string | null;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_percent',
  })
  isPercent: boolean;

  @Column({
    type: 'text',
    nullable: true,
    name: 'hasil',
  })
  hasil: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'hasil_text',
  })
  hasilText: string | null;

  @Column({
    type: 'int',
    default: 1,
    name: 'peringkat',
  })
  peringkat: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    name: 'weighted',
  })
  weighted: number;

  @Column({
    type: 'text',
    nullable: true,
    name: 'keterangan',
  })
  keterangan: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_deleted',
  })
  isDeleted: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date | null;
}
