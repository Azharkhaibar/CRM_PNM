import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NewInvestasiController } from './new-investasi.controller';
import { InvestasiService } from './new-investasi.service';
import { Investasi } from './entities/new-investasi.entity';
import { InvestasiSection } from './entities/new-investasi-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investasi, InvestasiSection])],
  controllers: [NewInvestasiController],
  providers: [InvestasiService],
  exports: [InvestasiService],
})
export class NewInvestasiModule {}
