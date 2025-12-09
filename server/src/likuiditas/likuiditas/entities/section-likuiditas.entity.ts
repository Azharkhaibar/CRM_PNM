import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Likuiditas, Quarter } from './likuiditas.entity';

@Entity('sections_likuiditas')
@Index('IDX_SECTION_PERIOD', ['year', 'quarter'])
export class SectionLikuiditas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({
    type: 'varchar',
    length: 2,
  })
  quarter: Quarter;

  @Column({ type: 'varchar', length: 50 })
  no: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'bobot_section',
  })
  bobotSection: number;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'parameter',
  })
  parameter: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'description',
  })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_deleted',
  })
  isDeleted: boolean;

  @DeleteDateColumn({
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @OneToMany(() => Likuiditas, (likuiditas) => likuiditas.section, {
    cascade: true,
    eager: false,
  })
  indikators: Likuiditas[];
}
