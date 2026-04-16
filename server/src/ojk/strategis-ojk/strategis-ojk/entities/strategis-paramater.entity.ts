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
import { StrategisOjk } from './strategis-ojk.entity';
import { StrategisNilai } from './strategis-nilai.entity';

@Entity('strategis_parameters')
@Index(['strategisOjkId', 'nomor'], { unique: false })
export class StrategisParameter {
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

  @Column({ name: 'strategis_ojk_id' })
  strategisOjkId: number;

  @ManyToOne(() => StrategisOjk, (strategis) => strategis.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'strategis_ojk_id' })
  strategisOjk: StrategisOjk;

  @OneToMany(() => StrategisNilai, (nilai) => nilai.parameter, {
    cascade: true,
  })
  nilaiList?: StrategisNilai[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;
}