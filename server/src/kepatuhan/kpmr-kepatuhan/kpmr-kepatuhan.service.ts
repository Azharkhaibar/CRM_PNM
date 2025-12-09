import { Injectable } from '@nestjs/common';
import { CreateKpmrKepatuhanDto } from './dto/create-kpmr-kepatuhan.dto';
import { UpdateKpmrKepatuhanDto } from './dto/update-kpmr-kepatuhan.dto';

@Injectable()
export class KpmrKepatuhanService {
  create(createKpmrKepatuhanDto: CreateKpmrKepatuhanDto) {
    return 'This action adds a new kpmrKepatuhan';
  }

  findAll() {
    return `This action returns all kpmrKepatuhan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kpmrKepatuhan`;
  }

  update(id: number, updateKpmrKepatuhanDto: UpdateKpmrKepatuhanDto) {
    return `This action updates a #${id} kpmrKepatuhan`;
  }

  remove(id: number) {
    return `This action removes a #${id} kpmrKepatuhan`;
  }
}
