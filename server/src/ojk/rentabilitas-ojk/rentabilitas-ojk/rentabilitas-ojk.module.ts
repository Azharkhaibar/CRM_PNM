// src/ojk/rentabilitas-produk/rentabilitas-produk-ojk/rentabilitas-produk-ojk.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RentabilitasProdukOjkService } from './rentabilitas-produk-ojk.service';
// import { RentabilitasProdukOjkController } from './rentabilitas-produk-ojk.controller';
// import { RentabilitasProdukOjk } from './entities/rentabilitas-produk-ojk.entity';
// import { RentabilitasParameter } from './entities/rentabilitas-produk-parameter.entity';
// import { RentabilitasNilai } from './entities/rentabilitas-produk-nilai.entity';
import { RentabilitasProdukOjk } from './entities/rentabilitas-ojk.entity';
import { RentabilitasProdukOjkService } from './rentabilitas-ojk.service';
import { RentabilitasProdukOjkController } from './rentabilitas-ojk.controller';
import { RentabilitasParameter } from './entities/rentabilitas-parameter.entity';
import { RentabilitasNilai } from './entities/rentabilitas-nilai.entity';
import { InherentReferenceRentabilitas } from './entities/rentabilitas-inherent-references.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RentabilitasProdukOjk,
      RentabilitasParameter,
      RentabilitasNilai,
      InherentReferenceRentabilitas,
    ]),
  ],
  controllers: [RentabilitasProdukOjkController],
  providers: [RentabilitasProdukOjkService],
  exports: [RentabilitasProdukOjkService],
})
export class RentabilitasProdukOjkModule {}
