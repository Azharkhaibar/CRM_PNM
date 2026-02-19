import { Injectable } from '@nestjs/common';
import { CreateRekapData1Dto } from './dto/create-rekap-data-1.dto';
import { UpdateRekapData1Dto } from './dto/update-rekap-data-1.dto';

@Injectable()
export class RekapData1Service {
  create(createRekapData1Dto: CreateRekapData1Dto) {
    return 'This action adds a new rekapData1';
  }

  findAll() {
    return `This action returns all rekapData1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rekapData1`;
  }

  update(id: number, updateRekapData1Dto: UpdateRekapData1Dto) {
    return `This action updates a #${id} rekapData1`;
  }

  remove(id: number) {
    return `This action removes a #${id} rekapData1`;
  }
}
