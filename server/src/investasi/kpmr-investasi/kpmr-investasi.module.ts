import { Module } from '@nestjs/common';
import { KpmrInvestasiService } from './kpmr-investasi.service';
import { KpmrInvestasiController } from './kpmr-investasi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpmrInvestasi } from './entities/kpmr-investasi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KpmrInvestasi])],
  controllers: [KpmrInvestasiController],
  providers: [KpmrInvestasiService],
})
export class KpmrInvestasiModule {}
