import { Injectable } from '@nestjs/common';
import { CreateKepatuhanOjkDto } from './dto/create-kepatuhan-ojk.dto';
import { UpdateKepatuhanOjkDto } from './dto/update-kepatuhan-ojk.dto';

@Injectable()
export class KepatuhanOjkService {
  create(createKepatuhanOjkDto: CreateKepatuhanOjkDto) {
    return 'This action adds a new kepatuhanOjk';
  }

  findAll() {
    return `This action returns all kepatuhanOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kepatuhanOjk`;
  }

  update(id: number, updateKepatuhanOjkDto: UpdateKepatuhanOjkDto) {
    return `This action updates a #${id} kepatuhanOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} kepatuhanOjk`;
  }
}
