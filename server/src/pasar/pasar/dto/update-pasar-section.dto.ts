// src/features/Dashboard/pages/RiskProfile/pages/Strategik/dto/update-strategik-section.dto.ts
import { PartialType } from '@nestjs/swagger';
// import { CreateStrategikSectionDto } from './create-strategik-section.dto';
import { CreatePasarSectionDto } from './create-pasar-section.dto';
export class UpdatePasarSectionDto extends PartialType(CreatePasarSectionDto) {}
