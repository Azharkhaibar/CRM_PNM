// src/ojk/likuiditas/likuiditas-kpmr/likuiditas-kpmr.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KpmrAspekLikuiditas } from './entities/likuiditas-kpmr-aspek.entity'; // IMPORT DARI FILE TERPISAH
import { KpmrPertanyaanLikuiditas } from './entities/likuiditas-kpmr-pertanyaan.entity';
import { KpmrLikuiditas } from './entities/likuiditas-produk-ojk.entity';
import { KpmrLikuiditasController } from './likuiditas-produk-kpmr.controller';
import { KpmrLikuiditasService } from './likuiditas-produk-kpmr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KpmrLikuiditas,
      KpmrAspekLikuiditas,
      KpmrPertanyaanLikuiditas,
      // ✅ HAPUS: PasarProdukKpmrModule - ini menyebabkan circular dependency
    ]),
    // ✅ TAMBAHKAN: Import module yang diperlukan
    LikuiditasKpmrModule,
  ],
  controllers: [KpmrLikuiditasController],
  providers: [KpmrLikuiditasService],
  exports: [KpmrLikuiditasService],
})
export class LikuiditasKpmrModule {}
