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
import { Quarter, Pasar } from './indikator.entity';
@Entity('sections_pasar')
@Index(
  'IDX_PASAR_SECTION_PERIOD_UNIQUE',
  ['year', 'quarter', 'no', 'parameter'],
  { unique: true },
)
export class PasarSection {
  @PrimaryGeneratedColumn()
  id: number;

  // TAMBAHKAN INI - Section HARUS punya periode
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: Quarter })
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => Pasar, (pasar) => pasar.section)
  pasarIndicators: Pasar[];
}
