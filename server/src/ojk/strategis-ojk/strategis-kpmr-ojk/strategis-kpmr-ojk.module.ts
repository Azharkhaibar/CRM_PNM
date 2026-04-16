import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpmrStrategisService } from './strategis-kpmr-ojk.service';
import { KpmrStrategisController } from './strategis-kpmr-ojk.controller';
import { KpmrAspekStrategis } from './entities/strategis-kpmr-aspek.entity';
import { KpmrPertanyaanStrategis } from './entities/strategis-kpmr-pertanyaan.entity';
import { KpmrStrategisOjk } from './entities/strategis-kpmr-ojk.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      KpmrAspekStrategis,
      KpmrPertanyaanStrategis,
      KpmrStrategisOjk,
    ]),
  ],
  controllers: [KpmrStrategisController],
  providers: [KpmrStrategisService],
  exports: [KpmrStrategisService],
})
export class StrategisProdukKpmrModule {}