import { Module } from '@nestjs/common';
import { ReputasiOjkService } from './reputasi-ojk.service';
import { ReputasiOjkController } from './reputasi-ojk.controller';

@Module({
  controllers: [ReputasiOjkController],
  providers: [ReputasiOjkService],
})
export class ReputasiOjkModule {}
