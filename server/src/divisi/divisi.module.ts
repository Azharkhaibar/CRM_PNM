import { Module } from '@nestjs/common';
import { DivisiService } from './divisi.service';
import { DivisiController } from './divisi.controller';

@Module({
  controllers: [DivisiController],
  providers: [DivisiService],
})
export class DivisiModule {}
