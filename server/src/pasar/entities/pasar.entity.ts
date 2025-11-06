import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pasar')
export class Pasar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  bobot: number;

  @Column('text', { nullable: false })
  parameter: string;

  @Column({ nullable: false })
  no_indikator: number;

  @Column('text', { nullable: false })
  indikator: string;

  @Column({ nullable: false })
  bobot_indikator: number;

  @Column('text', { nullable: false })
  sumber_resiko: string;

  @Column('text', { nullable: false })
  dampak: string;

  @Column({ nullable: false })
  low: string;

  @Column({ nullable: false })
  low_to_moderate: string;

  @Column({ nullable: false })
  moderate: string;

  @Column({ nullable: false })
  moderate_to_high: string;

  @Column({ nullable: false })
  high: string;

  @Column({ nullable: false })
  hasil: number;

  @Column({ nullable: true })
  peringkat: number;

  @Column({ nullable: true })
  nama_pembilang: string;

  @Column({ nullable: true })
  nama_penyebut: string;

  @Column({ nullable: true })
  nilai_pembilang: number;

  @Column({ nullable: true })
  nilai_penyebut: number;

  @Column({ nullable: true })
  weighted: number;

  @Column('text', { nullable: true })
  keterangan: string;

  @Column({ nullable: true })
  pereview_hasil: number;
}
