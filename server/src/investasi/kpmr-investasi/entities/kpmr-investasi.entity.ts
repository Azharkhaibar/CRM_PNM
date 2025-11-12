import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kpmr_investasi')
export class KpmrInvestasi {
  @PrimaryGeneratedColumn()
  id_kpmr_investasi: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 10 })
  quarter: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'aspek_no' })
  aspekNo?: string;

  @Column({ type: 'float', nullable: true, name: 'aspek_bobot' })
  aspekBobot?: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'aspek_title' })
  aspekTitle?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'section_no' })
  sectionNo?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
    name: 'indikator',
  })
  indikator: string;

  @Column({ type: 'float', nullable: true, name: 'section_skor' })
  sectionSkor?: number;

  @Column({ type: 'varchar', nullable: true })
  tata_kelola_resiko?: string;

  @Column({ type: 'varchar', nullable: true })
  strong?: string;

  @Column({ type: 'varchar', nullable: true })
  satisfactory?: string;

  @Column({ type: 'varchar', nullable: true })
  fair?: string;

  @Column({ type: 'varchar', nullable: true })
  marginal?: string;

  @Column({ type: 'varchar', nullable: true })
  unsatisfactory?: string;

  @Column({ type: 'varchar', nullable: true })
  evidence?: string;
}
