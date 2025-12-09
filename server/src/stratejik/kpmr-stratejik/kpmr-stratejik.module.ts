import { Module } from '@nestjs/common';
import { KpmrStratejikService } from './kpmr-stratejik.service';
import { KpmrStratejikController } from './kpmr-stratejik.controller';

@Module({
  controllers: [KpmrStratejikController],
  providers: [KpmrStratejikService],
})
export class KpmrStratejikModule {}
