// src/entities/strategik/strategik-section.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Quarter, Strategik } from './stratejik.entity';

@Entity('sections_strategik')
@Index(
  'IDX_STRATEGIK_SECTION_PERIOD_UNIQUE',
  ['year', 'quarter', 'no', 'parameter'],
  { unique: true },
)
export class StrategikSection {
  @PrimaryGeneratedColumn()
  id: number;

  // TAMBAHKAN INI - Section HARUS punya periode
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: ['Q1', 'Q2', 'Q3', 'Q4'] })
  quarter: Quarter;

  @Column({ type: 'varchar', length: 50 })
  no: string; // Contoh: "6.1"

  @Column({
    name: 'bobot_section',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 100,
  })
  bobotSection: number;

  @Column({ type: 'varchar', length: 500 })
  parameter: string; // Nama section

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'sort_order',
    type: 'int',
    default: 0,
  })
  sortOrder: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => Strategik, (strategik) => strategik.section)
  strategikIndicators: Strategik[];
}
