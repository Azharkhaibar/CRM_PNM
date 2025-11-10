import { Injectable } from '@nestjs/common';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';

@Injectable()
export class DivisiService {
  create(createDivisiDto: CreateDivisiDto) {
    return 'This action adds a new divisi';
  }

  findAll() {
    return `This action returns all divisi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} divisi`;
  }

  update(id: number, updateDivisiDto: UpdateDivisiDto) {
    return `This action updates a #${id} divisi`;
  }

  remove(id: number) {
    return `This action removes a #${id} divisi`;
  }
}
