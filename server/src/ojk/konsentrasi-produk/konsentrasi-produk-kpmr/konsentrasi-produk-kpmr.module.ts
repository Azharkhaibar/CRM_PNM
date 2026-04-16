// src/ojk/konsentrasi/konsentrasi-kpmr/konsentrasi-kpmr.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KpmrAspekKonsentrasi } from './entities/konsentrasi-kpmr-aspek.entity'; // IMPORT DARI FILE TERPISAH
import { KpmrPertanyaanKonsentrasi } from './entities/konsentrasi-kpmr-pertanyaan.entity';
import { KpmrKonsentrasiOjk } from './entities/konsentrasi-produk-kpmr.entity';
import { KpmrKonsentrasiController } from './konsentrasi-produk-kpmr.controller';
import { KpmrKonsentrasiService } from './konsentrasi-produk-kpmr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KpmrKonsentrasiOjk,
      KpmrAspekKonsentrasi,
      KpmrPertanyaanKonsentrasi,
      // ✅ HAPUS: PasarProdukKpmrModule - ini menyebabkan circular dependency
    ]),
  ],
  controllers: [KpmrKonsentrasiController],
  providers: [KpmrKonsentrasiService],
  exports: [KpmrKonsentrasiService],
})
export class KonsentrasiKpmrModule {}
