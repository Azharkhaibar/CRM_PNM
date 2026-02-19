import { Module } from '@nestjs/common';
import { KepatuhanKpmrOjkService } from './kepatuhan-kpmr-ojk.service';
import { KepatuhanKpmrOjkController } from './kepatuhan-kpmr-ojk.controller';

@Module({
  controllers: [KepatuhanKpmrOjkController],
  providers: [KepatuhanKpmrOjkService],
})
export class KepatuhanKpmrOjkModule {}
