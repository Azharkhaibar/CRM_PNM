import { Injectable } from '@nestjs/common';
import { CreateRentabilitasKpmrOjkDto } from './dto/create-rentabilitas-kpmr-ojk.dto';
import { UpdateRentabilitasKpmrOjkDto } from './dto/update-rentabilitas-kpmr-ojk.dto';

@Injectable()
export class RentabilitasKpmrOjkService {
  create(createRentabilitasKpmrOjkDto: CreateRentabilitasKpmrOjkDto) {
    return 'This action adds a new rentabilitasKpmrOjk';
  }

  findAll() {
    return `This action returns all rentabilitasKpmrOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rentabilitasKpmrOjk`;
  }

  update(id: number, updateRentabilitasKpmrOjkDto: UpdateRentabilitasKpmrOjkDto) {
    return `This action updates a #${id} rentabilitasKpmrOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} rentabilitasKpmrOjk`;
  }
}
