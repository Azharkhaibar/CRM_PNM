import { Injectable } from '@nestjs/common';
import { CreateOperasionalDto } from './dto/create-operasional.dto';
import { UpdateOperasionalDto } from './dto/update-operasional.dto';

@Injectable()
export class OperasionalService {
  create(createOperasionalDto: CreateOperasionalDto) {
    return 'This action adds a new operasional';
  }

  findAll() {
    return `This action returns all operasional`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operasional`;
  }

  update(id: number, updateOperasionalDto: UpdateOperasionalDto) {
    return `This action updates a #${id} operasional`;
  }

  remove(id: number) {
    return `This action removes a #${id} operasional`;
  }
}
