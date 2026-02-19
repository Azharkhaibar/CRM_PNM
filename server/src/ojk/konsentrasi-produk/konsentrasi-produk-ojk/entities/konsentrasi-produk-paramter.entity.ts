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
import { KonsentrasiProdukOjk } from './konsentrasi-produk-ojk.entity';
import { KonsentrasiNilai } from './konsentrasi-produk-nilai.entity';

@Entity('konsentrasi_parameters')
@Index(['konsentrasiProdukOjkId', 'nomor'], { unique: false })
export class KonsentrasiParameter {
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

  // Foreign key ke KonsentrasiProdukOjk
  @Column({ name: 'konsentrasi_produk_ojk_id' })
  konsentrasiProdukOjkId: number;

  @ManyToOne(() => KonsentrasiProdukOjk, (kons) => kons.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'konsentrasi_produk_ojk_id' })
  konsentrasiProdukOjk: KonsentrasiProdukOjk;

  // Relasi ke nilai
  @OneToMany(() => KonsentrasiNilai, (nilai) => nilai.parameter, {
    cascade: true,
  })
  nilaiList?: KonsentrasiNilai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;
}
