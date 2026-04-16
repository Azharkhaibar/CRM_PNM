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
import { KpmrKreditOjk } from './kredit-produk-kpmr.entity';
// import { KpmrPertanyaanKredit } from './kredit-produk-kpmr-pertanyaan.entity';


import { KpmrPertanyaanKredit } from './kredit-kpmr-pertanyaan.entity';
@Entity('kpmr_aspek_kredit')
@Index(['kpmrKreditId', 'nomor'], { unique: false })
@Index(['kpmrKreditId', 'orderIndex'], { unique: false })
@Index(['kpmrKreditId', 'bobot'])
@Index(['kpmrKreditId', 'createdAt'])
export class KpmrAspekKredit {
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

  @Column({ name: 'kpmr_kredit_id' })
  kpmrKreditId: number;

  @ManyToOne(() => KpmrKreditOjk, (kpmr) => kpmr.aspekList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'kpmr_kredit_id' })
  kpmrKredit: KpmrKreditOjk;

  @OneToMany(() => KpmrPertanyaanKredit, (pertanyaan) => pertanyaan.aspek, {
    cascade: true,
    eager: false,
  })
  pertanyaanList?: KpmrPertanyaanKredit[];

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