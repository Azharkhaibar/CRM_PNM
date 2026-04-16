// src/features/Dashboard/pages/RiskProfile/pages/Pasar/kpmr-pasar.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KPMRPasarController } from './kpmr-pasar.controller';
import { KPMRPasarService } from './kpmr-pasar.service';
import { KPMRPasarDefinition } from './entities/kpmr-pasar-definisi.entity';
import { KPMRPasarScore } from './entities/kpmr-pasar-skor.entity';
import { KPMRPasarAspect } from './entities/kpmr-pasar-aspek.entity';
import { KPMRPasarQuestion } from './entities/kpmr-pasar-pertanyaan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KPMRPasarDefinition,
      KPMRPasarScore,
      KPMRPasarAspect,
      KPMRPasarQuestion,
    ]),
  ],
  controllers: [KPMRPasarController],
  providers: [KPMRPasarService],
  exports: [KPMRPasarService],
})
export class KpmrPasarModule {}
