// src/kepatuhan/kepatuhan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KepatuhanService } from './kepatuhan.service';
import { KepatuhanController } from './kepatuhan.controller';
import { Kepatuhan } from './entities/kepatuhan.entity';
import { KepatuhanSection } from './entities/kepatuhan-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kepatuhan, KepatuhanSection])],
  controllers: [KepatuhanController],
  providers: [KepatuhanService],
  exports: [KepatuhanService], // Tambahkan export jika diperlukan di module lain
})
export class KepatuhanModule {}
