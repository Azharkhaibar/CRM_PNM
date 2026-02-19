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
import { KpmrLikuiditas } from './likuiditas-produk-ojk.entity';
import { KpmrPertanyaanLikuiditas } from './likuiditas-kpmr-pertanyaan.entity';

@Entity('kpmr_aspek_likuiditas')
@Index(['kpmrOjkId', 'nomor'], { unique: false })
@Index(['kpmrOjkId', 'orderIndex'], { unique: false })
@Index(['kpmrOjkId', 'bobot'])
@Index(['kpmrOjkId', 'createdAt'])
export class KpmrAspekLikuiditas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nomor?: string;

  @Column({ nullable: false })
  judul: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  bobot: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  deskripsi?: string;

  @Column({ name: 'kpmr_ojk_id' })
  kpmrOjkId: number;

  @ManyToOne(() => KpmrLikuiditas, (kpmr) => kpmr.aspekList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'kpmr_ojk_id' })
  kpmrOjk: KpmrLikuiditas;

  @OneToMany(() => KpmrPertanyaanLikuiditas, (pertanyaan) => pertanyaan.aspek, {
    cascade: true,
    eager: false,
  })
  pertanyaanList?: KpmrPertanyaanLikuiditas[];

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

  @Column({ nullable: true, type: 'text' })
  notes?: string;
}