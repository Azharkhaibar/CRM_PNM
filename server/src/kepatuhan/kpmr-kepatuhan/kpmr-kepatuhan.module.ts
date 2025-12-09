import { Module } from '@nestjs/common';
import { KpmrKepatuhanService } from './kpmr-kepatuhan.service';
import { KpmrKepatuhanController } from './kpmr-kepatuhan.controller';

@Module({
  controllers: [KpmrKepatuhanController],
  providers: [KpmrKepatuhanService],
})
export class KpmrKepatuhanModule {}
