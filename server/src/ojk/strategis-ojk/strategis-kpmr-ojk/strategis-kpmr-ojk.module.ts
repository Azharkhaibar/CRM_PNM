import { Module } from '@nestjs/common';
import { StrategisKpmrOjkService } from './strategis-kpmr-ojk.service';
import { StrategisKpmrOjkController } from './strategis-kpmr-ojk.controller';

@Module({
  controllers: [StrategisKpmrOjkController],
  providers: [StrategisKpmrOjkService],
})
export class StrategisKpmrOjkModule {}
