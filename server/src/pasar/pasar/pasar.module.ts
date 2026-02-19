import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasarService } from './pasar.service';
import { PasarController } from './pasar.controller';
import { PasarSection } from './entities/section.entity';
import { Pasar } from './entities/indikator.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PasarSection, Pasar])],
  controllers: [PasarController],
  providers: [PasarService],
  exports: [PasarService],
})
export class PasarModule {}
