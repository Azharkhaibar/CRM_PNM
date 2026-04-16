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
import { ReputasiOjk } from './reputasi-ojk.entity';
import { ReputasiNilai } from './reputasi-nilai.entity';

@Entity('reputasi_parameters')
@Index(['reputasiOjkId', 'nomor'], { unique: false })
export class ReputasiParameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nomor?: string;

  @Column({ nullable: false })
  judul: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  bobot: number;

  @Column({ type: 'json', nullable: true })
  kategori?: {
    model?: string;
    prinsip?: string;
    jenis?: string;
    underlying?: string[];
  };

  @Column({ name: 'reputasi_ojk_id' })
  reputasiOjkId: number;

  @ManyToOne(() => ReputasiOjk, (reputasi) => reputasi.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reputasi_ojk_id' })
  reputasiOjk: ReputasiOjk;

  @OneToMany(() => ReputasiNilai, (nilai) => nilai.parameter, {
    cascade: true,
  })
  nilaiList?: ReputasiNilai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;
}
