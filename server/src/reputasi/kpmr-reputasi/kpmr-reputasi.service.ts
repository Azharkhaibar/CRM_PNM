import { Injectable } from '@nestjs/common';
import { CreateKpmrReputasiDto } from './dto/create-kpmr-reputasi.dto';
import { UpdateKpmrReputasiDto } from './dto/update-kpmr-reputasi.dto';

@Injectable()
export class KpmrReputasiService {
  create(createKpmrReputasiDto: CreateKpmrReputasiDto) {
    return 'This action adds a new kpmrReputasi';
  }

  findAll() {
    return `This action returns all kpmrReputasi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kpmrReputasi`;
  }

  update(id: number, updateKpmrReputasiDto: UpdateKpmrReputasiDto) {
    return `This action updates a #${id} kpmrReputasi`;
  }

  remove(id: number) {
    return `This action removes a #${id} kpmrReputasi`;
  }
}
