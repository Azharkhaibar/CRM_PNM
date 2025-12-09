import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IndikatorPasar } from './indikator.entity';

@Entity('sections_pasar')
export class SectionPasar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  no_sec: string;

  @Column({ type: 'text' })
  nama_section: string;

  @Column('decimal', { precision: 5, scale: 2 })
  bobot_par: number;

  @Column()
  tahun: number;

  @Column({ type: 'enum', enum: ['Q1', 'Q2', 'Q3', 'Q4'] })
  triwulan: string;

  @OneToMany(() => IndikatorPasar, (indikator) => indikator.section, {
    cascade: true,
  })
  indikators: IndikatorPasar[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_weighted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
