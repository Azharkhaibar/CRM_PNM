// src/ojk/kredit-produk/kredit-produk-ojk/kredit-produk-ojk.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KreditProdukOjkService } from './kredit-produk-ojk.service';
import { KreditProdukOjkController } from './kredit-produk-ojk.controller';
import { KreditProdukOjk } from './entities/kredit-produk-ojk.entity';
import { KreditParameter } from './entities/kredit-produk-parameter.entity';
import { KreditNilai } from './entities/kredit-produk-nilai.entity';
import { InherentReferenceKredit } from './entities/kredit-inherent-references.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KreditProdukOjk,
      KreditParameter,
      KreditNilai,
      InherentReferenceKredit,
    ]),
  ],
  controllers: [KreditProdukOjkController],
  providers: [KreditProdukOjkService],
  exports: [KreditProdukOjkService],
})
export class KreditProdukOjkModule {}
