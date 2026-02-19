import { Module } from '@nestjs/common';
import { HukumKpmrOjkService } from './hukum-kpmr-ojk.service';
import { HukumKpmrOjkController } from './hukum-kpmr-ojk.controller';

@Module({
  controllers: [HukumKpmrOjkController],
  providers: [HukumKpmrOjkService],
})
export class HukumKpmrOjkModule {}
