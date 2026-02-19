// src/entities/operasional/operasional-section.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { Operasional } from './operasional.entity';

export enum Quarter {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

@Entity('sections_operasional')
@Unique('UQ_OPERASIONAL_SECTION_PERIOD', ['year', 'quarter', 'no', 'parameter'])
export class OperasionalSection {
  @PrimaryGeneratedColumn()
  id: number;

  // Section HARUS punya periode
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: ['Q1', 'Q2', 'Q3', 'Q4'] })
  quarter: Quarter;

  @Column({ type: 'varchar', length: 50 })
  no: string; // Contoh: "7.1"

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

  @Column({
    name: 'created_by',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  createdBy: string | null;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  updatedBy: string | null;

  @OneToMany(() => Operasional, (operasional) => operasional.section)
  operasionalIndicators: Operasional[];
}
