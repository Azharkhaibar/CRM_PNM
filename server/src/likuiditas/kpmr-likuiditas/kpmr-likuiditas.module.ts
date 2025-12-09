// src/kpmr-likuiditas/kpmr-likuiditas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpmrLikuiditasService } from './kpmr-likuiditas.service';
import { KpmrLikuiditasController } from './kpmr-likuiditas.controller';
import { KpmrLikuiditas } from './entities/kpmr-likuidita.entity';
@Module({
  imports: [TypeOrmModule.forFeature([KpmrLikuiditas])],
  controllers: [KpmrLikuiditasController],
  providers: [KpmrLikuiditasService],
  exports: [KpmrLikuiditasService],
})
export class KpmrLikuiditasModule {}
