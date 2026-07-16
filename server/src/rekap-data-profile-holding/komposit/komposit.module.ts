import { Module } from '@nestjs/common';
import { KompositService } from './komposit.service';
import { KompositController } from './komposit.controller';
import { RekapData1Module } from '../rekap-data-1/rekap-data-1.module';

@Module({
  imports: [RekapData1Module],
  controllers: [KompositController],
  providers: [KompositService],
})
export class KompositModule {}

