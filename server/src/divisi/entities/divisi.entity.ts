import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('division')
export class Divisi {
  @PrimaryGeneratedColumn()
  divisi_id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.divisi)
  users: User[];
}
