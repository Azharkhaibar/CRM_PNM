import { PartialType } from '@nestjs/swagger';
import { CreateKonsentrasiProdukOjkDto } from './create-konsentrasi-produk-ojk.dto';

export class UpdateKonsentrasiProdukOjkDto extends PartialType(CreateKonsentrasiProdukOjkDto) {}
