import { Module } from '@nestjs/common';
import { OperasionalKpmrOjkService } from './operasional-kpmr-ojk.service';
import { OperasionalKpmrOjkController } from './operasional-kpmr-ojk.controller';

@Module({
  controllers: [OperasionalKpmrOjkController],
  providers: [OperasionalKpmrOjkService],
})
export class OperasionalKpmrOjkModule {}
