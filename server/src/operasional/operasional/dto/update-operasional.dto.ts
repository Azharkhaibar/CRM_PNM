// src/features/Dashboard/pages/RiskProfile/pages/Operasional/dto/update-operasional.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateOperasionalDto } from './create-operasional.dto';

export class UpdateOperasionalDto extends PartialType(CreateOperasionalDto) {}
