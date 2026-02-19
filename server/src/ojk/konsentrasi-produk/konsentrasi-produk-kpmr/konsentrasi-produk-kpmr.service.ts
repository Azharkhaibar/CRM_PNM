import { Injectable } from '@nestjs/common';
import { CreateKonsentrasiProdukKpmrDto } from './dto/create-konsentrasi-produk-kpmr.dto';
import { UpdateKonsentrasiProdukKpmrDto } from './dto/update-konsentrasi-produk-kpmr.dto';

@Injectable()
export class KonsentrasiProdukKpmrService {
  create(createKonsentrasiProdukKpmrDto: CreateKonsentrasiProdukKpmrDto) {
    return 'This action adds a new konsentrasiProdukKpmr';
  }

  findAll() {
    return `This action returns all konsentrasiProdukKpmr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} konsentrasiProdukKpmr`;
  }

  update(id: number, updateKonsentrasiProdukKpmrDto: UpdateKonsentrasiProdukKpmrDto) {
    return `This action updates a #${id} konsentrasiProdukKpmr`;
  }

  remove(id: number) {
    return `This action removes a #${id} konsentrasiProdukKpmr`;
  }
}
