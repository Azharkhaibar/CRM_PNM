// src/kepatuhan/dto/update-kepatuhan.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateKepatuhanDto } from './create-kepatuhan.dto';

export class UpdateKepatuhanDto extends PartialType(CreateKepatuhanDto) {}
