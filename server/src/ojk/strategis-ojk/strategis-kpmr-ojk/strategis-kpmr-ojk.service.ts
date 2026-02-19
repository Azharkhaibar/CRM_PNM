import { Injectable } from '@nestjs/common';
import { CreateStrategisKpmrOjkDto } from './dto/create-strategis-kpmr-ojk.dto';
import { UpdateStrategisKpmrOjkDto } from './dto/update-strategis-kpmr-ojk.dto';

@Injectable()
export class StrategisKpmrOjkService {
  create(createStrategisKpmrOjkDto: CreateStrategisKpmrOjkDto) {
    return 'This action adds a new strategisKpmrOjk';
  }

  findAll() {
    return `This action returns all strategisKpmrOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} strategisKpmrOjk`;
  }

  update(id: number, updateStrategisKpmrOjkDto: UpdateStrategisKpmrOjkDto) {
    return `This action updates a #${id} strategisKpmrOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} strategisKpmrOjk`;
  }
}
