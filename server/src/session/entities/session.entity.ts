// session.entity.ts - SIMPLE VERSION
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  session_id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Auth, (auth) => auth.sessions)
  @JoinColumn({ name: 'auth_id' }) 
  auth: Auth;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
  x;
}
