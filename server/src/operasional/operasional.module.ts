import { Module } from '@nestjs/common';
import { OperasionalService } from './operasional.service';
import { OperasionalController } from './operasional.controller';

@Module({
  controllers: [OperasionalController],
  providers: [OperasionalService],
})
export class OperasionalModule {}
