import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { SectionPasar } from './section.entity';

@Entity('indikators_pasar')
export class IndikatorPasar {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SectionPasar, (section) => section.indikators, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sectionId' })
  section: SectionPasar;

  @Column({ type: 'text' })
  nama_indikator: string;

  @Column('decimal', { precision: 5, scale: 2 })
  bobot_indikator: number;

  // PERBAIKAN: Tambah | null di type
  @Column({ type: 'text', nullable: true })
  pembilang_label: string | null;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  pembilang_value: number | null;

  @Column({ type: 'text', nullable: true })
  penyebut_label: string | null;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  penyebut_value: number | null;

  @Column({ type: 'text' })
  sumber_risiko: string;

  @Column({ type: 'text' })
  dampak: string;

  @Column({ type: 'text' })
  low: string;

  @Column({ type: 'text' })
  low_to_moderate: string;

  @Column({ type: 'text' })
  moderate: string;

  @Column({ type: 'text' })
  moderate_to_high: string;

  @Column({ type: 'text' })
  high: string;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  hasil: number | null;

  @Column('int')
  peringkat: number;

  @Column('decimal', { precision: 10, scale: 2 })
  weighted: number;

  // PERBAIKAN: Tambah | null
  @Column({ type: 'text', nullable: true })
  keterangan: string | null;

  @Column({
    type: 'enum',
    enum: ['RASIO', 'NILAI_TUNGGAL'],
    default: 'RASIO',
  })
  mode: string;

  // PERBAIKAN: Tambah | null
  @Column({ type: 'text', nullable: true })
  formula: string | null;

  @Column({ type: 'boolean', default: false })
  is_percent: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
