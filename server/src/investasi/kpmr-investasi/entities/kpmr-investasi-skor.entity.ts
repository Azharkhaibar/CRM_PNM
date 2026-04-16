import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, // TAMBAHKAN
  JoinColumn, // TAMBAHKAN
  Index,
} from 'typeorm';
import { KPMRDefinition } from './kpmr-investasi-definisi.entity'; // TAMBAHKAN

@Entity('kpmr_investasi_skor_holding')
@Index('IDX_KPMR_SCORE_DEF_QUARTER', ['definitionId', 'year', 'quarter'], {
  unique: true,
})
export class KPMRScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'definition_id' })
  definitionId: number;

  // TAMBAHKAN MANY-TO-ONE KE DEFINITION
  @ManyToOne(() => KPMRDefinition, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'definition_id' })
  definition: KPMRDefinition;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 10 })
  quarter: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'section_skor',
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value ? Number(value) : null),
    },
  })
  sectionSkor: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 100, nullable: true })
  createdBy: string | null;

  @Column({ name: 'updated_by', type: 'varchar', length: 100, nullable: true })
  updatedBy: string | null;
}
