import { Module } from '@nestjs/common';
import { ReputasiKpmrOjkService } from './reputasi-kpmr-ojk.service';
import { ReputasiKpmrOjkController } from './reputasi-kpmr-ojk.controller';

@Module({
  controllers: [ReputasiKpmrOjkController],
  providers: [ReputasiKpmrOjkService],
})
export class ReputasiKpmrOjkModule {}
