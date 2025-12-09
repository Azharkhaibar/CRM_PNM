// src/entities/hukum/hukum-section.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Hukum } from './hukum.entity';

@Entity('sections_hukum')
export class HukumSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  no: string; // Contoh: "5.1"

  @Column({
    name: 'bobot_section',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  bobotSection: number;

  @Column({ type: 'varchar', length: 500 })
  parameter: string; // Deskripsi section hukum

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @Column({
    name: 'sort_order',
    type: 'int',
    default: 0,
  })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => Hukum, (hukum) => hukum.section)
  hukum: Hukum[];
}
