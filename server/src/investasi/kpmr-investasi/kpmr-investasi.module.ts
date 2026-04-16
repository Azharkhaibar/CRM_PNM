// src/features/Dashboard/pages/RiskProfile/pages/Investasi/kpmr.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KPMRController } from './kpmr-investasi.controller';
import { KPMRService } from './kpmr-investasi.service';
import { KPMRDefinition } from './entities/kpmr-investasi-definisi.entity';
import { KPMRScore } from './entities/kpmr-investasi-skor.entity';
import { KPMRAspect } from './entities/kpmr-investasi-aspek.entity';
import { KPMRQuestion } from './entities/kpmr-investasi-pertanyaan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KPMRDefinition,
      KPMRScore,
      KPMRAspect,
      KPMRQuestion,
    ]),
  ],
  controllers: [KPMRController],
  providers: [KPMRService],
  exports: [KPMRService],
})
export class KpmrInvestasiModule {}
