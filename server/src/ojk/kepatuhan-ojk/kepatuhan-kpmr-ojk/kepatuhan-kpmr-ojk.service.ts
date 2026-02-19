import { Injectable } from '@nestjs/common';
import { CreateKepatuhanKpmrOjkDto } from './dto/create-kepatuhan-kpmr-ojk.dto';
import { UpdateKepatuhanKpmrOjkDto } from './dto/update-kepatuhan-kpmr-ojk.dto';

@Injectable()
export class KepatuhanKpmrOjkService {
  create(createKepatuhanKpmrOjkDto: CreateKepatuhanKpmrOjkDto) {
    return 'This action adds a new kepatuhanKpmrOjk';
  }

  findAll() {
    return `This action returns all kepatuhanKpmrOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kepatuhanKpmrOjk`;
  }

  update(id: number, updateKepatuhanKpmrOjkDto: UpdateKepatuhanKpmrOjkDto) {
    return `This action updates a #${id} kepatuhanKpmrOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} kepatuhanKpmrOjk`;
  }
}
