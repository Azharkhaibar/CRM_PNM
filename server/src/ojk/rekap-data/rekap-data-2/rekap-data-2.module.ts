import { Module } from '@nestjs/common';
import { RekapData2Service } from './rekap-data-2.service';
import { RekapData2Controller } from './rekap-data-2.controller';

@Module({
  controllers: [RekapData2Controller],
  providers: [RekapData2Service],
})
export class RekapData2Module {}
