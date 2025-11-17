import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
export enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum ModuleType {
  INVESTASI = 'INVESTASI',
  PASAR = 'PASAR',
  LIKUIDITAS = 'LIKUIDITAS',
  OPERASIONAL = 'OPERASIONAL',
  HUKUM = 'HUKUM',
  STRATEJIK = 'STRATEJIK',
  KEPATUHAN = 'KEPATUHAN',
  REPUTASI = 'REPUTASI',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  SYSTEM = 'SYSTEM',
}

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null; // <-- WAJIB ADA

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: User | null;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  action: ActionType;

  @Column({
    type: 'enum',
    enum: ModuleType,
  })
  module: ModuleType;

  @Column('text')
  description: string;

  @Column({ type: 'text', nullable: true })
  endpoint: string | null;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ip_address: string;

  @Column({ name: 'is_success', default: true })
  isSuccess: boolean;

  @Index()
  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'json', nullable: true })
  metadata: any;
}
