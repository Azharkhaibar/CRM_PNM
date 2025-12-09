import { Injectable } from '@nestjs/common';
import { CreateKpmrHukumDto } from './dto/create-kpmr-hukum.dto';
import { UpdateKpmrHukumDto } from './dto/update-kpmr-hukum.dto';

@Injectable()
export class KpmrHukumService {
  create(createKpmrHukumDto: CreateKpmrHukumDto) {
    return 'This action adds a new kpmrHukum';
  }

  findAll() {
    return `This action returns all kpmrHukum`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kpmrHukum`;
  }

  update(id: number, updateKpmrHukumDto: UpdateKpmrHukumDto) {
    return `This action updates a #${id} kpmrHukum`;
  }

  remove(id: number) {
    return `This action removes a #${id} kpmrHukum`;
  }
}
