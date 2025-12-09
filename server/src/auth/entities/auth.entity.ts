import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn()
  auth_id: number;

  @Column({ nullable: false, unique: true })
  userID: string;

  @Column({ nullable: false, select: true })
  hash_password: string;

  @Column({ nullable: true })
  refresh_token?: string;

  @Column({ nullable: true })
  reset_password_token?: string;

  @OneToOne(() => User, (user) => user.auth, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
    sessions: any;
}
