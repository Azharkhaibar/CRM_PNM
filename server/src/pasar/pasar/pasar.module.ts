import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasarService } from './pasar.service';
import { PasarController } from './pasar.controller';
import { SectionPasar } from './entities/section.entity';
import { IndikatorPasar } from './entities/indikator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectionPasar, IndikatorPasar])],
  controllers: [PasarController],
  providers: [PasarService],
  exports: [PasarService],
})
export class PasarModule {}
