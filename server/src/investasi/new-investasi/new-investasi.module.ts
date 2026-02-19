import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvestasiController } from './new-investasi.controller';
import { InvestasiService } from './new-investasi.service';
import { Investasi } from './entities/new-investasi.entity';
import { InvestasiSection } from './entities/new-investasi-section.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Investasi, InvestasiSection])],
  controllers: [InvestasiController],
  providers: [InvestasiService],
  exports: [InvestasiService],
})
export class NewInvestasiModule {}
