import { Injectable } from '@nestjs/common';
import { CreateReputasiKpmrOjkDto } from './dto/create-reputasi-kpmr-ojk.dto';
import { UpdateReputasiKpmrOjkDto } from './dto/update-reputasi-kpmr-ojk.dto';

@Injectable()
export class ReputasiKpmrOjkService {
  create(createReputasiKpmrOjkDto: CreateReputasiKpmrOjkDto) {
    return 'This action adds a new reputasiKpmrOjk';
  }

  findAll() {
    return `This action returns all reputasiKpmrOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reputasiKpmrOjk`;
  }

  update(id: number, updateReputasiKpmrOjkDto: UpdateReputasiKpmrOjkDto) {
    return `This action updates a #${id} reputasiKpmrOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} reputasiKpmrOjk`;
  }
}
