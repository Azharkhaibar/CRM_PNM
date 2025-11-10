import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Divisi } from './entities/divisi.entity';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';

@Injectable()
export class DivisiService {
  constructor(
    @InjectRepository(Divisi)
    private readonly divisiRepository: Repository<Divisi>,
  ) {}

  async findAll(): Promise<Divisi[]> {
    try {
      return await this.divisiRepository.find({
        relations: ['users'],
        order: { name: 'ASC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch divisions');
    }
  }

  async findOne(divisi_id: number): Promise<Divisi> {
    try {
      const divisi = await this.divisiRepository.findOne({
        where: { divisi_id },
        relations: ['users'],
      });

      if (!divisi) {
        throw new NotFoundException(`Division with ID ${divisi_id} not found`);
      }

      return divisi;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch division');
    }
  }

  async create(createDivisiDto: CreateDivisiDto): Promise<Divisi> {
    try {
      const divisi = this.divisiRepository.create(createDivisiDto);
      return await this.divisiRepository.save(divisi);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create division');
    }
  }

  async update(
    divisi_id: number,
    updateDivisiDto: UpdateDivisiDto,
  ): Promise<Divisi> {
    try {
      const divisi = await this.findOne(divisi_id);
      Object.assign(divisi, updateDivisiDto);
      return await this.divisiRepository.save(divisi);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update division');
    }
  }

  async remove(divisi_id: number): Promise<void> {
    try {
      const divisi = await this.findOne(divisi_id);

      // Set divisi_id to null for all users in this division
      await this.divisiRepository.manager
        .getRepository('users')
        .update({ divisi: { divisi_id } }, { divisi: null });

      await this.divisiRepository.remove(divisi);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete division');
    }
  }
}
