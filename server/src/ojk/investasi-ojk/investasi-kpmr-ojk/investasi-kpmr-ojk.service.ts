import { Injectable } from '@nestjs/common';
import { CreateInvestasiKpmrOjkDto } from './dto/create-investasi-kpmr-ojk.dto';
import { UpdateInvestasiKpmrOjkDto } from './dto/update-investasi-kpmr-ojk.dto';

@Injectable()
export class InvestasiKpmrOjkService {
  create(createInvestasiKpmrOjkDto: CreateInvestasiKpmrOjkDto) {
    return 'This action adds a new investasiKpmrOjk';
  }

  findAll() {
    return `This action returns all investasiKpmrOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} investasiKpmrOjk`;
  }

  update(id: number, updateInvestasiKpmrOjkDto: UpdateInvestasiKpmrOjkDto) {
    return `This action updates a #${id} investasiKpmrOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} investasiKpmrOjk`;
  }
}
