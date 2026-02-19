import { PartialType } from '@nestjs/swagger';
import { CreateKreditProdukKpmrDto } from './create-kredit-produk-kpmr.dto';

export class UpdateKreditProdukKpmrDto extends PartialType(CreateKreditProdukKpmrDto) {}
