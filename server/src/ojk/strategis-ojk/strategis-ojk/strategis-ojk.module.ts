import { Module } from '@nestjs/common';
import { StrategisOjkService } from './strategis-ojk.service';
import { StrategisOjkController } from './strategis-ojk.controller';

@Module({
  controllers: [StrategisOjkController],
  providers: [StrategisOjkService],
})
export class StrategisOjkModule {}
