// src/stratejik/stratejik/stratejik.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StratejikService } from './stratejik.service';
import { StratejikController } from './stratejik.controller';
import { Stratejik } from './entities/stratejik.entity';
import { StratejikSection } from './entities/stratejik-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stratejik, StratejikSection])],
  controllers: [StratejikController],
  providers: [StratejikService],
  exports: [StratejikService],
})
export class StratejikModule {}
