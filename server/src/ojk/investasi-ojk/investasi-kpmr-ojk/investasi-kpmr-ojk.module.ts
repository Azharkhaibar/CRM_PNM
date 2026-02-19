import { Module } from '@nestjs/common';
import { InvestasiKpmrOjkService } from './investasi-kpmr-ojk.service';
import { InvestasiKpmrOjkController } from './investasi-kpmr-ojk.controller';

@Module({
  controllers: [InvestasiKpmrOjkController],
  providers: [InvestasiKpmrOjkService],
})
export class InvestasiKpmrOjkModule {}
