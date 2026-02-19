// src/ojk/pasar-produk/pasar-produk-ojk/pasar-produk-ojk.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasarProdukOjkService } from './pasar-produk-ojk.service';
import { PasarProdukOjkController } from './pasar-produk-ojk.controller';
import { PasarProdukOjk } from './entities/pasar-produk-ojk.entity';
import { PasarParameter } from './entities/pasar-produk-parameter.entity';
import { PasarNilai } from './entities/pasar-produk-nilai.entity';
import { InherentReferencePasar } from './entities/pasar-inherent-refetences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PasarProdukOjk,
      PasarParameter,
      PasarNilai,
      InherentReferencePasar,
    ]),
  ],
  controllers: [PasarProdukOjkController],
  providers: [PasarProdukOjkService],
  exports: [PasarProdukOjkService],
})
export class PasarProdukOjkModule {}
