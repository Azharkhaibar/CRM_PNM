// src/features/Dashboard/pages/RiskProfile/pages/Investasi/dto/update-new-investasi.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestasiDto } from './create-new-investasi.dto';

export class UpdateInvestasiDto extends PartialType(CreateInvestasiDto) {}
