// src/ojk/operasional/operasional-kpmr/operasional-kpmr.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KpmrAspekOperasional } from './entities/operasional-kpmr-aspek.entity'; // IMPORT DARI FILE TERPISAH
import { KpmrPertanyaanOperasional } from './entities/operasional-kpmr-pertanyaan.entity';
import { KpmrOperasionalOjk } from './entities/operasional-kpmr-ojk.entity';
import { KpmrOperasionalController } from './operasional-kpmr-ojk.controller';
import { KpmrOperasionalService } from './operasional-kpmr-ojk.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KpmrOperasionalOjk,
      KpmrAspekOperasional,
      KpmrPertanyaanOperasional,
      // ✅ HAPUS: PasarProdukKpmrModule - ini menyebabkan circular dependency
    ]),
  ],
  controllers: [KpmrOperasionalController],
  providers: [KpmrOperasionalService],
  exports: [KpmrOperasionalService],
})
export class OperasionalKpmrModule {}
