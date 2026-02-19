import { Injectable } from '@nestjs/common';
import { CreateOperasionalKpmrOjkDto } from './dto/create-operasional-kpmr-ojk.dto';
import { UpdateOperasionalKpmrOjkDto } from './dto/update-operasional-kpmr-ojk.dto';

@Injectable()
export class OperasionalKpmrOjkService {
  create(createOperasionalKpmrOjkDto: CreateOperasionalKpmrOjkDto) {
    return 'This action adds a new operasionalKpmrOjk';
  }

  findAll() {
    return `This action returns all operasionalKpmrOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operasionalKpmrOjk`;
  }

  update(id: number, updateOperasionalKpmrOjkDto: UpdateOperasionalKpmrOjkDto) {
    return `This action updates a #${id} operasionalKpmrOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} operasionalKpmrOjk`;
  }
}
