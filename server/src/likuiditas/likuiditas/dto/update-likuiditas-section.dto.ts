// src/features/Dashboard/pages/RiskProfile/pages/Strategik/dto/update-strategik-section.dto.ts
import { PartialType } from '@nestjs/swagger';
// import { CreateStrategikSectionDto } from './create-strategik-section.dto';
import { CreateLikuiditasSectionDto } from './create-likuiditas-section.dto';
export class UpdateLikuiditasSectionDto extends PartialType(
  CreateLikuiditasSectionDto,
) {}
