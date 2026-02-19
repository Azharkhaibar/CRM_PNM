// src/ojk/likuiditas-produk/likuiditas-produk-ojk/dto/update-likuiditas-produk-ojk.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateLikuiditasProdukOjkDto } from './create-likuiditas-produk-ojk.dto';

export class UpdateLikuiditasProdukOjkDto extends PartialType(
  CreateLikuiditasProdukOjkDto,
) {}
