import { Module } from '@nestjs/common';
import { InvestasiService } from './investasi.service';
import { InvestasiController } from './investasi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investasi } from './entities/investasi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investasi])],
  controllers: [InvestasiController],
  providers: [InvestasiService],
  exports: [InvestasiService],
})
export class InvestasiModule {}
