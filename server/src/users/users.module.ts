import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Divisi } from 'src/divisi/entities/divisi.entity';
import { DivisiModule } from 'src/divisi/divisi.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auth, Divisi]), DivisiModule],

  controllers: [UsersController],

  providers: [UsersService],

  exports: [UsersService],
})
export class UsersModule {}
