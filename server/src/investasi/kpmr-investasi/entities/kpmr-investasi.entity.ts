import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kpmr_investasi')
export class KpmrInvestasi {
  @PrimaryGeneratedColumn()
  id_kpmr_investasi: number;

  @Column()
  tata_kelola_resiko: string;

  @Column()
  strong: string;

  @Column({
    nullable: false,
  })
  satisfactory: string;

  @Column({
    nullable: false,
  })
  fair: string;

  @Column({
    nullable: false,
  })
  marginal: string;

  @Column({
    nullable: false,
  })
  unsatisfactory: string;

  @Column({
    nullable: false,
  })
  evidence: string;
}
