import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pasar } from './entities/pasar.entity';
import { CreatePasarDto } from './dto/create-pasar.dto';
import { UpdatePasarDto } from './dto/update-pasar.dto';

@Injectable()
export class PasarService {
  constructor(
    @InjectRepository(Pasar)
    private readonly pasarRepository: Repository<Pasar>,
  ) {}

  async create(dto: CreatePasarDto): Promise<Pasar> {
    const entity = this.pasarRepository.create(dto);
    return this.pasarRepository.save(entity);
  }

  async findAll(): Promise<Pasar[]> {
    return this.pasarRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Pasar> {
    const data = await this.pasarRepository.findOne({ where: { id } });

    if (!data) {
      throw new NotFoundException(`Pasar ID ${id} tidak ditemukan`);
    }

    return data;
  }

  async update(id: number, dto: UpdatePasarDto): Promise<Pasar> {
    const existing = await this.findOne(id);
    Object.assign(existing, dto);
    return this.pasarRepository.save(existing);
  }

  async remove(id: number): Promise<{ message: string }> {
    const existing = await this.findOne(id);
    await this.pasarRepository.remove(existing);

    return { message: `Pasar ID ${id} berhasil dihapus` };
  }

  async getPasarSummary(): Promise<Partial<Pasar>[]> {
    return this.pasarRepository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.parameter',
        'p.indikator',
        'p.hasil',
        'p.peringkat',
        'p.weighted',
        'p.keterangan',
      ])
      .orderBy('p.id', 'ASC')
      .getMany();
  }
}
