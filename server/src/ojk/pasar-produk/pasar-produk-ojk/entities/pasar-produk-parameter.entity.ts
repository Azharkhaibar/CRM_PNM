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
import { PasarProdukOjk } from './pasar-produk-ojk.entity';
import { PasarNilai } from './pasar-produk-nilai.entity';

@Entity('pasar_parameters')
@Index(['pasarProdukOjkId', 'nomor'], { unique: false })
export class PasarParameter {
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

  // Foreign key ke PasarProdukOjk
  @Column({ name: 'pasar_produk_ojk_id' })
  pasarProdukOjkId: number;

  @ManyToOne(() => PasarProdukOjk, (pasar) => pasar.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pasar_produk_ojk_id' })
  pasarProdukOjk: PasarProdukOjk;

  // Relasi ke nilai
  @OneToMany(() => PasarNilai, (nilai) => nilai.parameter, {
    cascade: true,
  })
  nilaiList?: PasarNilai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;
}
