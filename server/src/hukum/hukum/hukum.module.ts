// src/hukum/hukum.module.ts
import { Module } from '@nestjs/common';
import { HukumService } from './hukum.service';
import { HukumController } from './hukum.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hukum } from './entities/hukum.entity';
import { HukumSection } from './entities/hukum-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hukum, HukumSection])],
  controllers: [HukumController],
  providers: [HukumService],
  exports: [HukumService],
})
export class HukumModule {}
