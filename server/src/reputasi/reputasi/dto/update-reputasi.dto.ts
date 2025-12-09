import { PartialType } from '@nestjs/swagger';
import { CreateReputasiDto } from './create-reputasi.dto';

export class UpdateReputasiDto extends PartialType(CreateReputasiDto) {}
