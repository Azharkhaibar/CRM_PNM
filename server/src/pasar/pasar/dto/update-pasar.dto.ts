// src/features/Dashboard/pages/RiskProfile/pages/Pasar/dto/update-pasar.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePasarDto } from './create-pasar.dto';

export class UpdatePasarDto extends PartialType(CreatePasarDto) {}
