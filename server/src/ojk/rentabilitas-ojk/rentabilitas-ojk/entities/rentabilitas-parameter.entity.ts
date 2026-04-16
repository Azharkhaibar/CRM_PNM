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

import { RentabilitasNilai } from './rentabilitas-nilai.entity';
import { RentabilitasProdukOjk } from './rentabilitas-ojk.entity';

@Entity('rentabilitas_parameters')
@Index(['rentabilitasProdukOjkId', 'nomor'], { unique: false })
export class RentabilitasParameter {
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

  // Foreign key ke RentabilitasProdukOjk
  @Column({ name: 'rentabilitas_produk_ojk_id' })
  rentabilitasProdukOjkId: number;

  @ManyToOne(
    () => RentabilitasProdukOjk,
    (rentabilitas) => rentabilitas.parameters,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'rentabilitas_produk_ojk_id' })
  rentabilitasProdukOjk: RentabilitasProdukOjk;

  // Relasi ke nilai
  @OneToMany(() => RentabilitasNilai, (nilai) => nilai.parameter, {
    cascade: true,
  })
  nilaiList?: RentabilitasNilai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;
}
