import { PartialType } from '@nestjs/swagger';
import { CreateLikuiditasProdukKpmrDto } from './create-likuiditas-produk-kpmr.dto';

export class UpdateLikuiditasProdukKpmrDto extends PartialType(
  CreateLikuiditasProdukKpmrDto,
) {}
