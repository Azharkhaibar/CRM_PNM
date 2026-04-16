import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikuiditasController } from './likuiditas.controller';
import { LikuiditasService } from './likuiditas.service';
import { Likuiditas } from './entities/likuiditas.entity';
import { LikuiditasSection } from './entities/likuiditas-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Likuiditas, LikuiditasSection])],
  controllers: [LikuiditasController],
  providers: [LikuiditasService],
  exports: [LikuiditasService],
})
export class LikuiditasModule {}
