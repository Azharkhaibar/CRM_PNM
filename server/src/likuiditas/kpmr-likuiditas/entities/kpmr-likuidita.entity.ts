// src/kpmr-likuiditas/entities/kpmr-likuiditas.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('kpmr_likuiditas')
export class KpmrLikuiditas {
  @PrimaryGeneratedColumn()
  id_kpmr_likuiditas: number;

  // Periode - konsisten dengan pasar
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 10 })
  quarter: string;

  // Aspek Information - konsisten dengan pasar
  @Column({ type: 'varchar', length: 20, nullable: true, name: 'aspek_no' })
  aspekNo?: string;

  @Column({ type: 'float', nullable: true, name: 'aspek_bobot' })
  aspekBobot?: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'aspek_title' })
  aspekTitle?: string;

  // Section Information - konsisten dengan pasar
  @Column({ type: 'varchar', length: 20, nullable: true, name: 'section_no' })
  sectionNo?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
    name: 'indikator',
  })
  indikator: string;

  @Column({ type: 'float', nullable: true, name: 'section_skor' })
  sectionSkor?: number;

  // Level Descriptions - menggunakan nama yang sama dengan pasar
  @Column({ type: 'text', nullable: true })
  strong?: string;

  @Column({ type: 'text', nullable: true })
  satisfactory?: string;

  @Column({ type: 'text', nullable: true })
  fair?: string;

  @Column({ type: 'text', nullable: true })
  marginal?: string;

  @Column({ type: 'text', nullable: true })
  unsatisfactory?: string;

  // Evidence - konsisten dengan pasar
  @Column({ type: 'text', nullable: true })
  evidence?: string;

  // Metadata - konsisten
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
