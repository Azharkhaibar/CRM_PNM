// likuiditas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikuiditasController } from './likuiditas.controller';
import { LikuiditasService } from './likuiditas.service';
import { LikuiditasSection } from './entities/section-likuiditas.entity';
import { Likuiditas } from './entities/likuiditas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikuiditasSection, Likuiditas])],
  controllers: [LikuiditasController],
  providers: [LikuiditasService],
  exports: [LikuiditasService],
})
export class LikuiditasModule {}
