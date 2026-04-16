// src/features/Dashboard/pages/RiskProfile/pages/Operasional/operasional.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperasionalController } from './operasional.controller';
import { OperasionalService } from './operasional.service';
import { Operasional } from './entities/operasional.entity';
import { OperasionalSection } from './entities/operasional-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operasional, OperasionalSection])],
  controllers: [OperasionalController],
  providers: [OperasionalService],
  exports: [OperasionalService],
})
export class OperasionalModule {}
