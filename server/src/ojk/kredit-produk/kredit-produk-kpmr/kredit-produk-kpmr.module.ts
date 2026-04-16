import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpmrKreditService } from './kredit-produk-kpmr.service';
import { KpmrKreditController } from './kredit-produk-kpmr.controller';
// import { KpmrKreditOjk } from './entities/kredit-produk-ojk.entity';
import { KpmrAspekKredit } from './entities/kredit-kpmr-aspek.entity';
// import { KpmrAspekKredit } from './entities/kredit-produk-kpmr-aspek.entity';
// import { KpmrPertanyaanKredit } from './entities/kredit-produk-kpmr-pertanyaan.entity';

import { KpmrPertanyaanKredit } from './entities/kredit-kpmr-pertanyaan.entity';

import { KpmrKreditOjk } from './entities/kredit-produk-kpmr.entity';
import { KreditProdukOjkModule } from '../kredit-produk-ojk/kredit-produk-ojk.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KpmrAspekKredit,
      KpmrPertanyaanKredit,
      KpmrKreditOjk,
    ]),
  ],
  controllers: [KpmrKreditController],
  providers: [KpmrKreditService],
  exports: [KpmrKreditService],
})
export class KreditProdukKpmrModule {}
