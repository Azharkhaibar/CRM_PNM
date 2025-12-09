import { PartialType } from '@nestjs/mapped-types';
import { CreateStratejikSectionDto } from './create-stratejik-section.dto';
export class UpdateStratejikSectionDto extends PartialType(
  CreateStratejikSectionDto,
) {}
