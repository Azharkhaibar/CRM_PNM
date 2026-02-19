import { PartialType } from '@nestjs/swagger';
import { CreateKreditProdukOjkDto } from './create-kredit-produk-ojk.dto';

export class UpdateKreditProdukOjkDto extends PartialType(
  CreateKreditProdukOjkDto,
) {}
