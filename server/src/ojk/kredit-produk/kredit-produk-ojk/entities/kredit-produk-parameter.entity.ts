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
import { KreditProdukOjk } from './kredit-produk-ojk.entity';
import { KreditNilai } from './kredit-produk-nilai.entity';

@Entity('kredit_parameters')
@Index(['kreditProdukOjkId', 'nomor'], { unique: false })
export class KreditParameter {
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

  // Foreign key ke KreditProdukOjk
  @Column({ name: 'kredit_produk_ojk_id' })
  kreditProdukOjkId: number;

  @ManyToOne(() => KreditProdukOjk, (kredit) => kredit.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'kredit_produk_ojk_id' })
  kreditProdukOjk: KreditProdukOjk;

  // Relasi ke nilai
  @OneToMany(() => KreditNilai, (nilai) => nilai.parameter, {
    cascade: true,
  })
  nilaiList?: KreditNilai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;
}