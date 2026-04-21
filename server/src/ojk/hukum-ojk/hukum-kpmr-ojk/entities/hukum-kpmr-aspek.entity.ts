import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { KpmrHukum } from './hukum-kpmr-ojk.entity';
import { KpmrPertanyaanHukum } from './hukum-kpmr-pertanyaan.entity';

@Entity('kpmr_aspek_hukum')
@Index(['kpmrHukumId', 'nomor'])
@Index(['kpmrHukumId', 'orderIndex'])
@Index(['kpmrHukumId', 'bobot'])
@Index(['kpmrHukumId', 'createdAt'])
export class KpmrAspekHukum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nomor?: string;

  @Column()
  judul: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  bobot: number;

  @Column({ type: 'text', nullable: true })
  deskripsi?: string;

  @Column({ name: 'kpmr_hukum_id' })
  kpmrHukumId: number;

  @ManyToOne(() => KpmrHukum, (kpmr) => kpmr.aspekList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'kpmr_hukum_id' })
  kpmrHukum: KpmrHukum;

  @OneToMany(() => KpmrPertanyaanHukum, (pertanyaan) => pertanyaan.aspek, {
    cascade: true,
  })
  pertanyaanList?: KpmrPertanyaanHukum[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'average_score',
  })
  averageScore?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rating?: string;

  @Column({ nullable: true, name: 'updated_by' })
  updatedBy?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
