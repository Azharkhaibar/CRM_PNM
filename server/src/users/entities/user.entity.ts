import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Gender, Role } from '../enum/userEnum';
import { Auth } from 'src/auth/entities/auth.entity';
import { Divisi } from 'src/divisi/entities/divisi.entity';
import { Notification } from 'src/notification/entities/notification.entity'; // ✅ tambahkan import ini
import { AuditLog } from 'src/audit-log/entities/audit-log.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: false, unique: true })
  userID: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // ✅ Relasi ke notifikasi
  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notifications: Notification[];

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  @ManyToOne(() => Divisi, (divisi) => divisi.users, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'divisi_id' })
  divisi: Divisi | null;

  @OneToOne(() => Auth, (auth) => auth.user, {
    cascade: true,
  })
  auth: Auth;

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
  sessions: any;
}
