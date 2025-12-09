import { Injectable } from '@nestjs/common';
import { CreateKpmrOperasionalDto } from './dto/create-kpmr-operasional.dto';
import { UpdateKpmrOperasionalDto } from './dto/update-kpmr-operasional.dto';

@Injectable()
export class KpmrOperasionalService {
  create(createKpmrOperasionalDto: CreateKpmrOperasionalDto) {
    return 'This action adds a new kpmrOperasional';
  }

  findAll() {
    return `This action returns all kpmrOperasional`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kpmrOperasional`;
  }

  update(id: number, updateKpmrOperasionalDto: UpdateKpmrOperasionalDto) {
    return `This action updates a #${id} kpmrOperasional`;
  }

  remove(id: number) {
    return `This action removes a #${id} kpmrOperasional`;
  }
}
