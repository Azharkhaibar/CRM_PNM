import { Module } from '@nestjs/common';
import { PasarService } from './pasar.service';
import { PasarController } from './pasar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pasar } from './entities/pasar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pasar])],
  controllers: [PasarController],
  providers: [PasarService],
})
export class PasarModule {}
