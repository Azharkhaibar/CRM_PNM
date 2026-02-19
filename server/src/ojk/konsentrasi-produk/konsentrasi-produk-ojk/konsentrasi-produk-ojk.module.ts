// src/ojk/konsentrasi-produk/konsentrasi-produk-ojk/konsentrasi-produk-ojk.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KonsentrasiProdukOjkService } from './konsentrasi-produk-ojk.service';
import { KonsentrasiProdukOjkController } from './konsentrasi-produk-ojk.controller';
import { KonsentrasiProdukOjk } from './entities/konsentrasi-produk-ojk.entity';
import { KonsentrasiParameter } from './entities/konsentrasi-produk-paramter.entity';
import { KonsentrasiNilai } from './entities/konsentrasi-produk-nilai.entity';
import { InherentReferenceKonsentrasi } from './entities/konsentrasi-inherent-references.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KonsentrasiProdukOjk,
      KonsentrasiParameter,
      KonsentrasiNilai,
      InherentReferenceKonsentrasi,
    ]),
  ],
  controllers: [KonsentrasiProdukOjkController],
  providers: [KonsentrasiProdukOjkService],
  exports: [KonsentrasiProdukOjkService],
})
export class KonsentrasiProdukOjkModule {}
