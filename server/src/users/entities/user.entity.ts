import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { Gender, Role } from '../enum/userEnum';
import { Auth } from 'src/auth/entities/auth.entity';
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

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Auth, (auth) => auth.user, {
    cascade: true,
    eager: true,
  })
  auth: Auth;
}
