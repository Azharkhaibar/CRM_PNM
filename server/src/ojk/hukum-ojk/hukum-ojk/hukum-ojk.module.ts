import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HukumOjkService } from './hukum-ojk.service';
import { HukumOjkController } from './hukum-ojk.controller';
import { HukumOjk } from './entities/hukum-ojk.entity';
import { HukumParameter } from './entities/hukum-paramater.entity';
import { HukumNilai } from './entities/hukum-nilai.entity';
import { InherentReferenceHukum } from './entities/hukum-inherent-references.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HukumOjk,
      HukumParameter,
      HukumNilai,
      InherentReferenceHukum,
    ]),
  ],
  controllers: [HukumOjkController],
  providers: [HukumOjkService],
  exports: [HukumOjkService],
})
export class HukumOjkModule {}
