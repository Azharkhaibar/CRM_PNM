// src/features/Dashboard/pages/RiskProfile/pages/Strategik/strategik.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { StrategikSection } from '../../../entities/strategik/stratejik-section.entity';
// import { Strategik } from '../../../entities/strategik/stratejik.entity';
// import { StrategikService } from './services/strategik.service';
// import { StrategikController } from './controllers/strategik.controller';

import { StrategikSection } from './entities/stratejik-section.entity';
import { Strategik } from './entities/stratejik.entity';
import { StrategikService } from './stratejik.service';
import { StrategikController } from './stratejik.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StrategikSection, Strategik])],
  controllers: [StrategikController],
  providers: [StrategikService],
  exports: [StrategikService],
})
export class StrategikModule {}
