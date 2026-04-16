// src/features/Dashboard/pages/RiskProfile/pages/Pasar/dto/update-pasar-section.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePasarSectionDto } from './create-pasar-section.dto';

export class UpdatePasarSectionDto extends PartialType(CreatePasarSectionDto) {}
