import { Injectable } from '@nestjs/common';
import { CreateRentabilitasOjkDto } from './dto/create-rentabilitas-ojk.dto';
import { UpdateRentabilitasOjkDto } from './dto/update-rentabilitas-ojk.dto';

@Injectable()
export class RentabilitasOjkService {
  create(createRentabilitasOjkDto: CreateRentabilitasOjkDto) {
    return 'This action adds a new rentabilitasOjk';
  }

  findAll() {
    return `This action returns all rentabilitasOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rentabilitasOjk`;
  }

  update(id: number, updateRentabilitasOjkDto: UpdateRentabilitasOjkDto) {
    return `This action updates a #${id} rentabilitasOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} rentabilitasOjk`;
  }
}
