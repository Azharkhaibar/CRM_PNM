import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('investasi')
export class Investasi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  bobot: number;

  @Column({ type: 'text', nullable: false })
  parameter: string;

  @Column({ type: 'int', nullable: false })
  no_indikator: number;

  @Column({ type: 'text', nullable: false })
  indikator: string;

  @Column({ type: 'int', nullable: false })
  bobot_indikator: number;

  @Column({ type: 'text', nullable: false })
  sumber_resiko: string;

  @Column({ type: 'text', nullable: false })
  dampak: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  low: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  low_to_moderate: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  moderate: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  moderate_to_high: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  high: string;

  @Column({ type: 'float', nullable: false })
  hasil: number;

  @Column({ type: 'int', nullable: true })
  peringkat: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_pembilang: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_penyebut: string;

  @Column({ type: 'float', nullable: true })
  nilai_pembilang: number;

  @Column({ type: 'float', nullable: true })
  nilai_penyebut: number;

  @Column({ type: 'float', nullable: true })
  weighted: number;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @Column({ type: 'int', nullable: true })
  pereview_hasil: number;
}
