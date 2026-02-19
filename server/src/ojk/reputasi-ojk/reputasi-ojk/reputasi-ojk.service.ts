import { Injectable } from '@nestjs/common';
import { CreateReputasiOjkDto } from './dto/create-reputasi-ojk.dto';
import { UpdateReputasiOjkDto } from './dto/update-reputasi-ojk.dto';

@Injectable()
export class ReputasiOjkService {
  create(createReputasiOjkDto: CreateReputasiOjkDto) {
    return 'This action adds a new reputasiOjk';
  }

  findAll() {
    return `This action returns all reputasiOjk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reputasiOjk`;
  }

  update(id: number, updateReputasiOjkDto: UpdateReputasiOjkDto) {
    return `This action updates a #${id} reputasiOjk`;
  }

  remove(id: number) {
    return `This action removes a #${id} reputasiOjk`;
  }
}
