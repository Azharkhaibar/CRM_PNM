import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('likuiditas')
export class Likuiditas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'float' })
  bobot: number; 

  @Column({ type: 'text', nullable: false })
  parameter: string;

  @Column({ nullable: false })
  no_indikator: number;

  @Column({ type: 'text', nullable: false })
  indikator: string;

  @Column({ nullable: false, type: 'float' })
  bobot_indikator: number;

  @Column({ type: 'text', nullable: false })
  sumber_resiko: string;

  @Column({ type: 'text', nullable: false })
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

  @Column({ nullable: false, type: 'float' })
  hasil: number;

  @Column({ nullable: true })
  peringkat: number;

  @Column({ nullable: true })
  nama_pembilang: string;

  @Column({ nullable: true })
  nama_penyebut: string;

  @Column({ nullable: true, type: 'float' })
  nilai_pembilang: number;

  @Column({ nullable: true, type: 'float' })
  nilai_penyebut: number;

  @Column({ nullable: true, type: 'float' })
  weighted: number;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @Column({ nullable: true })
  pereview_hasil: number;
}
