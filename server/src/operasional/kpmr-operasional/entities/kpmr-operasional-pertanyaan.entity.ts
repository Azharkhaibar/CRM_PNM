// src/features/Dashboard/pages/RiskProfile/pages/Operasional/entities/kpmr-operasional-pertanyaan.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { KPMROperasionalAspect } from './kpmr-operasional-aspek.entity';
import { KPMROperasionalDefinition } from './kpmr-operasional-definisi.entity';

@Entity('kpmr_operasional_pertanyaan_holding')
@Index('IDX_KPMR_OPERASIONAL_QUESTION_ASPECT', ['year', 'aspekNo'])
export class KPMROperasionalQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 50, name: 'aspek_no' })
  aspekNo: string;

  @ManyToOne(() => KPMROperasionalAspect, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'year', referencedColumnName: 'year' },
    { name: 'aspek_no', referencedColumnName: 'aspekNo' },
  ])
  aspect: KPMROperasionalAspect;

  @Column({ type: 'varchar', length: 50, name: 'section_no' })
  sectionNo: string;

  @Column({ type: 'text', name: 'section_title' })
  sectionTitle: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => KPMROperasionalDefinition,
    (definition) => definition.question,
  )
  definitions: KPMROperasionalDefinition[];
}
