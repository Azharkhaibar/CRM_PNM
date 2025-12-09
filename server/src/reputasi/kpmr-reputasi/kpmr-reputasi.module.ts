import { Module } from '@nestjs/common';
import { KpmrReputasiService } from './kpmr-reputasi.service';
import { KpmrReputasiController } from './kpmr-reputasi.controller';

@Module({
  controllers: [KpmrReputasiController],
  providers: [KpmrReputasiService],
})
export class KpmrReputasiModule {}
