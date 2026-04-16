import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KPMRLikuiditasController } from './kpmr-likuiditas.controller';
import { KPMRLikuiditasService } from './kpmr-likuiditas.service';
import { KPMRLikuiditasDefinition } from './entities/kpmr-likuiditas-definisi.entity';
import { KPMRLikuiditasScore } from './entities/kpmr-likuiditas-skor.entity';
import { KPMRLikuiditasAspect } from './entities/kpmr-likuiditas-aspek.entity';
import { KPMRLikuiditasQuestion } from './entities/kpmr-likuiditas-pertanyaan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KPMRLikuiditasDefinition,
      KPMRLikuiditasScore,
      KPMRLikuiditasAspect,
      KPMRLikuiditasQuestion,
    ]),
  ],
  controllers: [KPMRLikuiditasController],
  providers: [KPMRLikuiditasService],
  exports: [KPMRLikuiditasService],
})
export class KpmrLikuiditasModule {}
