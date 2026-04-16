import { PartialType } from '@nestjs/swagger';
import { CreateKonsentrasiProdukKpmrDto } from './create-konsentrasi-produk-kpmr.dto';

export class UpdateKonsentrasiProdukKpmrDto extends PartialType(
  CreateKonsentrasiProdukKpmrDto,
) {}
