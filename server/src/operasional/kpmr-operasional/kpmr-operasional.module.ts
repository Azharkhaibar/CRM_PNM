import { Module } from '@nestjs/common';
import { KpmrOperasionalService } from './kpmr-operasional.service';
import { KpmrOperasionalController } from './kpmr-operasional.controller';

@Module({
  controllers: [KpmrOperasionalController],
  providers: [KpmrOperasionalService],
})
export class KpmrOperasionalModule {}
