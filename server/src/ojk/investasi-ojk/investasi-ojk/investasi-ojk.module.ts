import { Module } from '@nestjs/common';
import { InvestasiOjkService } from './investasi-ojk.service';
import { InvestasiOjkController } from './investasi-ojk.controller';

@Module({
  controllers: [InvestasiOjkController],
  providers: [InvestasiOjkService],
})
export class InvestasiOjkModule {}
