// src/ojk/likuiditas-produk/likuiditas-produk-ojk/entities/likuiditas-parameter.entity.ts
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
import { LikuiditasProdukOjk } from './likuiditas-produk-ojk.entity';
import { LikuiditasNilai } from './likuditas-nilai.entity';

@Entity('likuiditas_parameters')
@Index(['likuiditasProdukOjkId', 'nomor'], { unique: false })
export class LikuiditasParameter {
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

  // Foreign key ke LikuiditasProdukOjk
  @Column({ name: 'likuiditas_produk_ojk_id' })
  likuiditasProdukOjkId: number;

  @ManyToOne(() => LikuiditasProdukOjk, (likuiditas) => likuiditas.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'likuiditas_produk_ojk_id' })
  likuiditasProdukOjk: LikuiditasProdukOjk;

  // Relasi ke nilai
  @OneToMany(() => LikuiditasNilai, (nilai) => nilai.parameter, {
    cascade: true,
  })
  nilaiList?: LikuiditasNilai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;
}
