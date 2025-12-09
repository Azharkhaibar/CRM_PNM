import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationalService } from './operasional.service'; // Import OperationalService
import { OperasionalController } from './operasional.controller';
import { Operational } from './entities/operasional.entity';
import { SectionOperational } from './entities/operasional-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operational, SectionOperational])],
  controllers: [OperasionalController],
  providers: [OperationalService], // Gunakan OperationalService
  exports: [OperationalService], // Ekspor juga jika diperlukan
})
export class OperasionalModule {}
