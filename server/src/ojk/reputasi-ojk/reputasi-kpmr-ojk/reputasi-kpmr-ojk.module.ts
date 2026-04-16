import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpmrReputasiService } from './reputasi-kpmr-ojk.service';
import { KpmrReputasiController } from './reputasi-kpmr-ojk.controller';
import { KpmrAspekReputasi } from './entities/reputasi-kpmr-aspek.entity';
import { KpmrPertanyaanReputasi } from './entities/reputasi-kpmr-pertanyaan.entity';
import { KpmrReputasiOjk } from './entities/reputasi-kpmr-ojk.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KpmrAspekReputasi,
      KpmrPertanyaanReputasi,
      KpmrReputasiOjk,
    ]),
  ],
  controllers: [KpmrReputasiController],
  providers: [KpmrReputasiService],
  exports: [KpmrReputasiService],
})
export class ReputasiProdukKpmrModule {}
