import { Module } from '@nestjs/common';
import { KpmrHukumService } from './kpmr-hukum.service';
import { KpmrHukumController } from './kpmr-hukum.controller';

@Module({
  controllers: [KpmrHukumController],
  providers: [KpmrHukumService],
})
export class KpmrHukumModule {}
