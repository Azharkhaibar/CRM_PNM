import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OperasionalController } from './operasional-ojk.controller';
import { Operasional } from './entities/operasional-ojk.entity';
import { OperasionalParameter } from './entities/operasional-produk-parameter.entity';
import { OperasionalNilai } from './entities/operasional-produk-nilai.entity';
import { OperasionalReference } from './entities/operasional-inherent-references.entity';
import { OperasionalService } from './operasional-ojk.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Operasional,
      OperasionalParameter,
      OperasionalNilai,
      OperasionalReference,
    ]),
  ],
  controllers: [OperasionalController],
  providers: [OperasionalService],
  exports: [OperasionalService],
})
export class OperasionalOjkModule {}
