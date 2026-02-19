// src/features/Dashboard/pages/RiskProfile/pages/Operasional/operasional.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperasionalController } from './operasional.controller';
import { OperasionalService } from './operasional.service';
import { OperasionalSection } from './entities/operasional-section.entity';
import { Operasional } from './entities/operasional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OperasionalSection, Operasional])],
  controllers: [OperasionalController],
  providers: [OperasionalService],
  exports: [OperasionalService],
})
export class OperasionalModule {}
