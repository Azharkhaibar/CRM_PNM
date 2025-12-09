import { PartialType } from '@nestjs/mapped-types';
import { CreateReputasiSectionDto } from './create-reputasi-section.dto';

export class UpdateReputasiSectionDto extends PartialType(
  CreateReputasiSectionDto,
) {}
