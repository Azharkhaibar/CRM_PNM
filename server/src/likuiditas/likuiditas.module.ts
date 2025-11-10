import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likuiditas } from './entities/likuidita.entity';
import { LikuiditasService } from './likuiditas.service';
import { LikuiditasController } from './likuiditas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Likuiditas])],
  controllers: [LikuiditasController],
  providers: [LikuiditasService],
  exports: [TypeOrmModule],
})
export class LikuiditasModule {}
