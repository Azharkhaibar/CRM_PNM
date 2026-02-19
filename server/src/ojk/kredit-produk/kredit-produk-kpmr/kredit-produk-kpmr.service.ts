import { Injectable } from '@nestjs/common';
import { CreateKreditProdukKpmrDto } from './dto/create-kredit-produk-kpmr.dto';
import { UpdateKreditProdukKpmrDto } from './dto/update-kredit-produk-kpmr.dto';

@Injectable()
export class KreditProdukKpmrService {
  create(createKreditProdukKpmrDto: CreateKreditProdukKpmrDto) {
    return 'This action adds a new kreditProdukKpmr';
  }

  findAll() {
    return `This action returns all kreditProdukKpmr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kreditProdukKpmr`;
  }

  update(id: number, updateKreditProdukKpmrDto: UpdateKreditProdukKpmrDto) {
    return `This action updates a #${id} kreditProdukKpmr`;
  }

  remove(id: number) {
    return `This action removes a #${id} kreditProdukKpmr`;
  }
}
