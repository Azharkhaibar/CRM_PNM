import { Injectable } from '@nestjs/common';
import { CreateStrategisOjkDto } from './dto/create-strategis-ojk.dto';
import { UpdateStrategisOjkDto } from './dto/update-strategis-ojk.dto';

@Injectable()
export class StrategisOjkService {
  create(createStrategisOjkDto: CreateStrategisOjkDto) {
    return 'This action adds a new strategisOjk';
  }

  findAll() {
    return `This action returns all strategisOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} strategisOjk`;
  }

  update(id: number, updateStrategisOjkDto: UpdateStrategisOjkDto) {
    return `This action updates a #${id} strategisOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} strategisOjk`;
  }
}
