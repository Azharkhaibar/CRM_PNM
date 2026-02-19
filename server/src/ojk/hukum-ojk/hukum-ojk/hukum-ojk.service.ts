import { Injectable } from '@nestjs/common';
import { CreateHukumOjkDto } from './dto/create-hukum-ojk.dto';
import { UpdateHukumOjkDto } from './dto/update-hukum-ojk.dto';

@Injectable()
export class HukumOjkService {
  create(createHukumOjkDto: CreateHukumOjkDto) {
    return 'This action adds a new hukumOjk';
  }

  findAll() {
    return `This action returns all hukumOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hukumOjk`;
  }

  update(id: number, updateHukumOjkDto: UpdateHukumOjkDto) {
    return `This action updates a #${id} hukumOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} hukumOjk`;
  }
}
