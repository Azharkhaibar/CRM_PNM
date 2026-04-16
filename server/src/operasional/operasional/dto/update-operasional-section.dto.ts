// src/features/Dashboard/pages/RiskProfile/pages/Operasional/dto/update-operasional-section.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateOperasionalSectionDto } from './create-operasional-section.dto';

export class UpdateOperasionalSectionDto extends PartialType(
  CreateOperasionalSectionDto,
) {}
