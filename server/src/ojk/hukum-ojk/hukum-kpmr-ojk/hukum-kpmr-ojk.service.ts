import { Injectable } from '@nestjs/common';
import { CreateHukumKpmrOjkDto } from './dto/create-hukum-kpmr-ojk.dto';
import { UpdateHukumKpmrOjkDto } from './dto/update-hukum-kpmr-ojk.dto';

@Injectable()
export class HukumKpmrOjkService {
  create(createHukumKpmrOjkDto: CreateHukumKpmrOjkDto) {
    return 'This action adds a new hukumKpmrOjk';
  }

  findAll() {
    return `This action returns all hukumKpmrOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hukumKpmrOjk`;
  }

  update(id: number, updateHukumKpmrOjkDto: UpdateHukumKpmrOjkDto) {
    return `This action updates a #${id} hukumKpmrOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} hukumKpmrOjk`;
  }
}
