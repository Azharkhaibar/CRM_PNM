// src/features/Dashboard/pages/RiskProfile/pages/Operasional/dto/update-operasional.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOperasionalDto } from './create-operasional.dto';

export class UpdateOperasionalDto extends PartialType(CreateOperasionalDto) {}
