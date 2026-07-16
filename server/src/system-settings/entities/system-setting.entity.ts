import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSetting {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'text' })
  value: string;
}
