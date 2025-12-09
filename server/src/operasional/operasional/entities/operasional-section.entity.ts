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
// import { Operational, Quarter } from './operational.entity';
import { Operational, Quarter } from './operasional.entity';
@Entity('sections_operational')
@Index('IDX_SECTION_OPERATIONAL_PERIOD', ['year', 'quarter'])
export class SectionOperational {
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

  @OneToMany(() => Operational, (operational) => operational.section, {
    cascade: true,
    eager: false,
  })
  indikators: Operational[];
}
