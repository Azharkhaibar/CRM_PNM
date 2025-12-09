// src/kpmr-pasar/kpmr-pasar.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpmrPasarService } from './kpmr-pasar.service';
import { KpmrPasarController } from './kpmr-pasar.controller';
import { KpmrPasar } from './entities/kpmr-pasar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KpmrPasar])],
  controllers: [KpmrPasarController],
  providers: [KpmrPasarService],
  exports: [KpmrPasarService], // ✅ Export jika akan digunakan di module lain
})
export class KpmrPasarModule {}
