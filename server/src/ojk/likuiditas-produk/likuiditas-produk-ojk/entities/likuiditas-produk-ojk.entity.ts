// src/ojk/likuiditas-produk/likuiditas-produk-ojk/entities/likuiditas-produk-ojk.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { LikuiditasParameter } from './likuiditas-parameter.entity';

@Entity('likuiditas_produk_ojk')
@Index(['year', 'quarter'], { unique: true })
export class LikuiditasProdukOjk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  year: number;

  @Column({ nullable: false })
  quarter: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // Relasi ke parameter
  @OneToMany(
    () => LikuiditasParameter,
    (parameter) => parameter.likuiditasProdukOjk,
    {
      cascade: true,
      eager: false,
    },
  )
  parameters?: LikuiditasParameter[];

  @Column({ type: 'json', nullable: true })
  summary?: {
    totalWeighted?: number;
    summaryBg?: string;
    computedAt?: Date;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'created_by' })
  createdBy?: string;

  @Column({ nullable: true, name: 'updated_by' })
  updatedBy?: string;

  @Column({ default: '1.0.0', name: 'version' })
  version?: string;

  @Column({ default: false, name: 'is_locked' })
  isLocked?: boolean;

  @Column({ nullable: true, name: 'locked_at' })
  lockedAt?: Date;

  @Column({ nullable: true, name: 'locked_by' })
  lockedBy?: string;

  @Column({ nullable: true, type: 'text', name: 'notes' })
  notes?: string;
}
