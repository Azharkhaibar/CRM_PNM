// src/hukum/dto/update-hukum-section.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateHukumSectionDto } from './create-hukum-section.dto';

export class UpdateHukumSectionDto extends PartialType(CreateHukumSectionDto) {}
