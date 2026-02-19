// src/entities/strategik/likuiditas-section.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Quarter } from 'src/likuiditas/likuiditas/entities/likuiditas.entity';
import { Likuiditas } from 'src/likuiditas/likuiditas/entities/likuiditas.entity';

@Entity('sections_likuiditas')
@Index(
  'IDX_LIKUIDITAS_SECTION_PERIOD_UNIQUE',
  ['year', 'quarter', 'no', 'parameter'],
  { unique: true },
)
export class LikuiditasSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: Quarter })
  quarter: Quarter;

  @Column({ type: 'varchar', length: 50 })
  no: string; 

  @Column({
    name: 'bobot_section',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 100,
  })
  bobotSection: number;

  @Column({ type: 'varchar', length: 500 })
  parameter: string; 

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

  @OneToMany(() => Likuiditas, (likuiditas) => likuiditas.section)
  likuiditasIndicators: Likuiditas[];
}
