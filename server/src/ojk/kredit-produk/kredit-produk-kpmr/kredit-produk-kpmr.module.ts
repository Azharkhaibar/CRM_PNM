import { Module } from '@nestjs/common';
import { KreditProdukKpmrService } from './kredit-produk-kpmr.service';
import { KreditProdukKpmrController } from './kredit-produk-kpmr.controller';

@Module({
  controllers: [KreditProdukKpmrController],
  providers: [KreditProdukKpmrService],
})
export class KreditProdukKpmrModule {}
