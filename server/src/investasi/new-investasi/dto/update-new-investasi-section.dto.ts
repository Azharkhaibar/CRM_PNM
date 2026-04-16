// src/features/Dashboard/pages/RiskProfile/pages/Investasi/dto/update-investasi-section.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateInvestasiSectionDto } from './create-investasi-section.dto';

export class UpdateInvestasiSectionDto extends PartialType(
  CreateInvestasiSectionDto,
) {}
