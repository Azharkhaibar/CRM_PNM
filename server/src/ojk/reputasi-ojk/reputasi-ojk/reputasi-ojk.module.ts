import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReputasiOjkService } from './reputasi-ojk.service';
import { ReputasiOjkController } from './reputasi-ojk.controller';
import { ReputasiOjk } from './entities/reputasi-ojk.entity';
import { ReputasiParameter } from './entities/reputasi-paramater.entity';
import { ReputasiNilai } from './entities/reputasi-nilai.entity';
import { ReputasiReference } from './entities/reputasi-inherent-references.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReputasiOjk,
      ReputasiParameter,
      ReputasiNilai,
      ReputasiReference,
    ]),
  ],
  controllers: [ReputasiOjkController],
  providers: [ReputasiOjkService],
  exports: [ReputasiOjkService],
})
export class ReputasiOjkModule {}