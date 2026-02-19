import { Injectable } from '@nestjs/common';
import { CreateRekapData2Dto } from './dto/create-rekap-data-2.dto';
import { UpdateRekapData2Dto } from './dto/update-rekap-data-2.dto';

@Injectable()
export class RekapData2Service {
  create(createRekapData2Dto: CreateRekapData2Dto) {
    return 'This action adds a new rekapData2';
  }

  findAll() {
    return `This action returns all rekapData2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rekapData2`;
  }

  update(id: number, updateRekapData2Dto: UpdateRekapData2Dto) {
    return `This action updates a #${id} rekapData2`;
  }

  remove(id: number) {
    return `This action removes a #${id} rekapData2`;
  }
}
