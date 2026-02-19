import { Module } from '@nestjs/common';
import { RentabilitasOjkService } from './rentabilitas-ojk.service';
import { RentabilitasOjkController } from './rentabilitas-ojk.controller';

@Module({
  controllers: [RentabilitasOjkController],
  providers: [RentabilitasOjkService],
})
export class RentabilitasOjkModule {}
