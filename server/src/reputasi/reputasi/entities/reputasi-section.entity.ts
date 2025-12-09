import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reputasi } from './reputasi.entity';

@Entity('reputasi_sections')
export class ReputasiSection {
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
  parameter: string; // Contoh: "Perjanjian pengelolaan produk"

  @Column({ type: 'text', nullable: true })
  description: string | null; // Deskripsi tambahan

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null; // Kategori reputasi

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

  @OneToMany(() => Reputasi, (reputasi) => reputasi.section)
  reputasi: Reputasi[];
}
