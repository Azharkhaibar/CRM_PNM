import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany, // TAMBAHKAN INI
} from 'typeorm';
import { KPMRAspect } from './kpmr-investasi-aspek.entity';
import { KPMRDefinition } from './kpmr-investasi-definisi.entity'; // TAMBAHKAN INI

@Entity('kpmr_investasi_pertanyaan_holding')
@Index('IDX_KPMR_QUESTION_ASPECT', ['year', 'aspekNo'])
export class KPMRQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 50, name: 'aspek_no' })
  aspekNo: string;

  @ManyToOne(() => KPMRAspect, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'year', referencedColumnName: 'year' },
    { name: 'aspek_no', referencedColumnName: 'aspekNo' },
  ])
  aspect: KPMRAspect;

  @Column({ type: 'varchar', length: 50, name: 'section_no' })
  sectionNo: string;

  @Column({ type: 'text', name: 'section_title' })
  sectionTitle: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // TAMBAHKAN RELASI OneToMany KE DEFINITION
  @OneToMany(() => KPMRDefinition, (definition) => definition.question)
  definitions: KPMRDefinition[];
}
