import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategisOjkService } from './strategis-ojk.service';
import { StrategisOjkController } from './strategis-ojk.controller';
import { StrategisOjk } from './entities/strategis-ojk.entity';
import { StrategisParameter } from './entities/strategis-paramater.entity';
import { StrategisNilai } from './entities/strategis-nilai.entity';
import { StrategisReference } from './entities/strategis-inherent-references.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StrategisOjk,
      StrategisParameter,
      StrategisNilai,
      StrategisReference,
    ]),
  ],
  controllers: [StrategisOjkController],
  providers: [StrategisOjkService],
  exports: [StrategisOjkService],
})
export class StrategisOjkModule {}
