import { PartialType } from '@nestjs/swagger';
import { CreateKpmrReputasiDto } from './create-kpmr-reputasi.dto';

export class UpdateKpmrReputasiDto extends PartialType(CreateKpmrReputasiDto) {}
