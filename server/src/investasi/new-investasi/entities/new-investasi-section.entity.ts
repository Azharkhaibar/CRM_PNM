import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Investasi } from './new-investasi.entity';

@Entity('investasi_sections')
export class InvestasiSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  no: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  bobotSection: number;

  @Column({ type: 'varchar', length: 255 })
  parameter: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  // PERBAIKAN: Ubah nama property menjadi 'investasi' (bukan 'investasiRecords')
  @OneToMany(() => Investasi, (investasi) => investasi.section)
  investasi: Investasi[]; // Ubah dari 'investasiRecords' ke 'investasi'
  deletedAt: Date;
}
