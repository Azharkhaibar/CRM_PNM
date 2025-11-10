entitas

// divisi.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Divisi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.divisi)
  users: User[];
}

## -------------------------------------------------------------------

// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Divisi } from '../divisi/divisi.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // relasi ke divisi
  @ManyToOne(() => Divisi, (divisi) => divisi.users, { nullable: true }) // nullable biar data lama tetap bisa ada
  @JoinColumn({ name: 'divisi_id' })
  divisi: Divisi;
}

## ------------------------------------------------------------

export class CreateUserDto {
  name: string;
  divisiId?: number; // optional
}


## ----------------------------------------------------------------

const divisi = await this.divisiRepository.findOne({ where: { id: dto.divisiId } });
const user = this.userRepository.create({ ...dto, divisi });
await this.userRepository.save(user);
