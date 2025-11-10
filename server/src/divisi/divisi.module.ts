import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisiService } from './divisi.service';
import { DivisiController } from './divisi.controller';
import { Divisi } from './entities/divisi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Divisi])],
  controllers: [DivisiController],
  providers: [DivisiService],
  exports: [DivisiService],
})
export class DivisiModule {}
