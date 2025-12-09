// src/entities/kepatuhan/kepatuhan-section.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Kepatuhan } from './kepatuhan.entity';

@Entity('kepatuhan_sections')
export class KepatuhanSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  no: string; // Contoh: "7.1"

  @Column({
    name: 'bobot_section', // ✅ TAMBAHKAN INI
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  bobotSection: number;

  @Column({ type: 'varchar', length: 500 })
  parameter: string; // Deskripsi section

  @Column({ type: 'text', nullable: true })
  description: string | null; // Deskripsi tambahan

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null; // Kategori risiko

  @Column({
    name: 'sort_order', // ✅ TAMBAHKAN INI
    type: 'int',
    default: 0,
  })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' }) // ✅ TAMBAHKAN INI
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // ✅ TAMBAHKAN INI
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean; // Tetap gunakan camelCase di TypeScript

  @OneToMany(() => Kepatuhan, (kepatuhan) => kepatuhan.section)
  kepatuhan: Kepatuhan[];
}
