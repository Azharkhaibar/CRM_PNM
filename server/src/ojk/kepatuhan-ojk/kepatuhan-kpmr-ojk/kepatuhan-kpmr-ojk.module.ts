import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpmrKepatuhanService } from './kepatuhan-kpmr-ojk.service';
import { KpmrKepatuhanController } from './kepatuhan-kpmr-ojk.controller';
import { KpmrAspekKepatuhan } from './entities/kepatuhan-kpmr-aspek.entity';
import { KpmrPertanyaanKepatuhan } from './entities/kepatuhan-kpmr-pertanyaan.entity';
import { KpmrKepatuhanOjk } from './entities/kepatuhan-kpmr-ojk.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      KpmrAspekKepatuhan,
      KpmrPertanyaanKepatuhan,
      KpmrKepatuhanOjk,
    ]),
    // KepatuhanProdukOjkModule, // Uncomment jika diperlukan
  ],
  controllers: [KpmrKepatuhanController],
  providers: [KpmrKepatuhanService],
  exports: [KpmrKepatuhanService],
})
export class KepatuhanProdukKpmrModule {}
