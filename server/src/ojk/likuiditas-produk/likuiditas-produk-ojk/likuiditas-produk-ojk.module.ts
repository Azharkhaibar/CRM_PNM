// src/ojk/likuiditas-produk/likuiditas-produk-ojk/likuiditas-produk-ojk.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikuiditasProdukOjkService } from './likuiditas-produk-ojk.service';
import { LikuiditasProdukOjkController } from './likuiditas-produk-ojk.controller';
import { LikuiditasProdukOjk } from './entities/likuiditas-produk-ojk.entity';
import { LikuiditasParameter } from './entities/likuiditas-parameter.entity';
import { LikuiditasNilai } from './entities/likuditas-nilai.entity';
import { InherentReferenceLikuiditas } from './entities/likuditas-inherent-refrences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LikuiditasProdukOjk,
      LikuiditasParameter,
      LikuiditasNilai,
      InherentReferenceLikuiditas,
    ]),
  ],
  controllers: [LikuiditasProdukOjkController],
  providers: [LikuiditasProdukOjkService],
  exports: [LikuiditasProdukOjkService],
})
export class LikuiditasProdukOjkModule {}
