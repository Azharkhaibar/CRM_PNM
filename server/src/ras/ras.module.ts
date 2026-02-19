import { Module } from '@nestjs/common';
import { RasService } from './ras.service';
import { RasController } from './ras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RasData } from './entities/ras.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RasData])],
  controllers: [RasController],
  providers: [RasService],
  exports: [RasService]
})
export class RasModule {}
