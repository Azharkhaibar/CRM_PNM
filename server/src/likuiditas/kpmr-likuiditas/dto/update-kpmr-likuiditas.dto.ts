// src/kpmr-likuiditas/dto/update-kpmr-likuiditas.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateKpmrLikuiditasDto } from './create-kpmr-likuidita.dto';
export class UpdateKpmrLikuiditasDto extends PartialType(
  CreateKpmrLikuiditasDto,
) {}
