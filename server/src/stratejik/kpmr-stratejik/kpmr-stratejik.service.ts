import { Injectable } from '@nestjs/common';
import { CreateKpmrStratejikDto } from './dto/create-kpmr-stratejik.dto';
import { UpdateKpmrStratejikDto } from './dto/update-kpmr-stratejik.dto';

@Injectable()
export class KpmrStratejikService {
  create(createKpmrStratejikDto: CreateKpmrStratejikDto) {
    return 'This action adds a new kpmrStratejik';
  }

  findAll() {
    return `This action returns all kpmrStratejik`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kpmrStratejik`;
  }

  update(id: number, updateKpmrStratejikDto: UpdateKpmrStratejikDto) {
    return `This action updates a #${id} kpmrStratejik`;
  }

  remove(id: number) {
    return `This action removes a #${id} kpmrStratejik`;
  }
}
