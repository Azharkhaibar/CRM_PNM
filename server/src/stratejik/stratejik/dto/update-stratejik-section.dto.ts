// src/features/Dashboard/pages/RiskProfile/pages/Strategik/dto/update-strategik-section.dto.ts
import { PartialType } from '@nestjs/swagger';
// import { CreateStrategikSectionDto } from './create-strategik-section.dto';
import { CreateStrategikSectionDto } from './create-stratejik-section.dto';
export class UpdateStrategikSectionDto extends PartialType(
  CreateStrategikSectionDto,
) {}
