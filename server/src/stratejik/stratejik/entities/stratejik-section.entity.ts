import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Stratejik } from './stratejik.entity';

@Entity('stratejik_sections')
export class StratejikSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  no: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  bobotSection: number;

  @Column({ type: 'varchar', length: 255 })
  parameter: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => Stratejik, (stratejik) => stratejik.section)
  stratejik: Stratejik[];
}
