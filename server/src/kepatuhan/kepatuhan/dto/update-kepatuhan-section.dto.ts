// src/kepatuhan/dto/update-kepatuhan-section.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateKepatuhanSectionDto } from './create-kepatuhan-section.dto';

export class UpdateKepatuhanSectionDto extends PartialType(
  CreateKepatuhanSectionDto,
) {}
