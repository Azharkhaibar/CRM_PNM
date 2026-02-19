import { Module } from '@nestjs/common';
import { KepatuhanOjkService } from './kepatuhan-ojk.service';
import { KepatuhanOjkController } from './kepatuhan-ojk.controller';

@Module({
  controllers: [KepatuhanOjkController],
  providers: [KepatuhanOjkService],
})
export class KepatuhanOjkModule {}
