import { Module } from '@nestjs/common';
import { KonsentrasiProdukKpmrService } from './konsentrasi-produk-kpmr.service';
import { KonsentrasiProdukKpmrController } from './konsentrasi-produk-kpmr.controller';

@Module({
  controllers: [KonsentrasiProdukKpmrController],
  providers: [KonsentrasiProdukKpmrService],
})
export class KonsentrasiProdukKpmrModule {}
