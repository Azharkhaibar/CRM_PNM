// src/ojk/pasar-produk/pasar-produk-kpmr/pasar-produk-kpmr.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpmrPasarService } from './pasar-produk-kpmr.service';
import { KpmrPasarController } from './pasar-produk-kpmr.controller';
import { KpmrPasarOjk } from './entities/pasar-produk-ojk.entity';
import { KpmrAspekPasar } from './entities/pasar-produk-kpmr-aspek.entity'; // IMPORT DARI FILE TERPISAH
import { KpmrPertanyaanPasar } from './entities/pasar-produk-kpmr-pertanyaan.entity';
import { PasarProdukOjk } from '../pasar-produk-ojk/entities/pasar-produk-ojk.entity';
import { PasarProdukOjkModule } from '../pasar-produk-ojk/pasar-produk-ojk.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KpmrPasarOjk,
      KpmrAspekPasar,
      KpmrPertanyaanPasar,
      PasarProdukKpmrModule,
      PasarProdukOjkModule,
    ]),
  ],
  controllers: [KpmrPasarController],
  providers: [KpmrPasarService],
  exports: [KpmrPasarService],
})
export class PasarProdukKpmrModule {}
