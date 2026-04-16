// src/features/Dashboard/pages/RiskProfile/pages/Operasional/kpmr-operasional.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KPMROperasionalController } from './kpmr-operasional.controller';
import { KPMROperasionalService } from './kpmr-operasional.service';
import { KPMROperasionalDefinition } from './entities/kpmr-operasional-definisi.entity';
import { KPMROperasionalScore } from './entities/kpmr-operasional-skor.entity';
import { KPMROperasionalAspect } from './entities/kpmr-operasional-aspek.entity';
import { KPMROperasionalQuestion } from './entities/kpmr-operasional-pertanyaan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KPMROperasionalDefinition,
      KPMROperasionalScore,
      KPMROperasionalAspect,
      KPMROperasionalQuestion,
    ]),
  ],
  controllers: [KPMROperasionalController],
  providers: [KPMROperasionalService],
  exports: [KPMROperasionalService],
})
export class KpmrOperasionalModule {}
