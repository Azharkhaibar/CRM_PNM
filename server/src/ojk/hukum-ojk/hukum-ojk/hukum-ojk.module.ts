import { Module } from '@nestjs/common';
import { HukumOjkService } from './hukum-ojk.service';
import { HukumOjkController } from './hukum-ojk.controller';

@Module({
  controllers: [HukumOjkController],
  providers: [HukumOjkService],
})
export class HukumOjkModule {}
