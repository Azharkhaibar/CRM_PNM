import { Module } from '@nestjs/common';
import { RentabilitasKpmrOjkService } from './rentabilitas-kpmr-ojk.service';
import { RentabilitasKpmrOjkController } from './rentabilitas-kpmr-ojk.controller';

@Module({
  controllers: [RentabilitasKpmrOjkController],
  providers: [RentabilitasKpmrOjkService],
})
export class RentabilitasKpmrOjkModule {}
