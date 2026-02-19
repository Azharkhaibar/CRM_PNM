import { Injectable } from '@nestjs/common';
import { CreateInvestasiOjkDto } from './dto/create-investasi-ojk.dto';
import { UpdateInvestasiOjkDto } from './dto/update-investasi-ojk.dto';

@Injectable()
export class InvestasiOjkService {
  create(createInvestasiOjkDto: CreateInvestasiOjkDto) {
    return 'This action adds a new investasiOjk';
  }

  findAll() {
    return `This action returns all investasiOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} investasiOjk`;
  }

  update(id: number, updateInvestasiOjkDto: UpdateInvestasiOjkDto) {
    return `This action updates a #${id} investasiOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} investasiOjk`;
  }
}
