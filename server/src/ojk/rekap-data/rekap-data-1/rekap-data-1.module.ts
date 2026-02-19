import { Module } from '@nestjs/common';
import { RekapData1Service } from './rekap-data-1.service';
import { RekapData1Controller } from './rekap-data-1.controller';

@Module({
  controllers: [RekapData1Controller],
  providers: [RekapData1Service],
})
export class RekapData1Module {}
