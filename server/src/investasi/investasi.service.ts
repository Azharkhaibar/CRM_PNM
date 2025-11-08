import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvestasiDto } from './dto/create-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-investasi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Investasi } from './entities/investasi.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvestasiService {
  constructor(
    @InjectRepository(Investasi)
    private readonly investRepository: Repository<Investasi>,
  ) {}

  async create(dto: CreateInvestasiDto): Promise<Investasi> {
    const weighted = dto.hasil * dto.bobot_indikator * dto.bobot;

    const entity = this.investRepository.create({
      ...dto,
      weighted,
    });

    return this.investRepository.save(entity);
  }

  async findAll(): Promise<Investasi[]> {
    return this.investRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Investasi> {
    const data = await this.investRepository.findOne({ where: { id } });
    if (!data)
      throw new NotFoundException(`Investasi ID ${id} tidak ditemukan`);
    return data;
  }

  async update(id: number, dto: UpdateInvestasiDto): Promise<Investasi> {
    const data = await this.findOne(id);
    Object.assign(data, dto);
    return this.investRepository.save(data);
  }

  async remove(id: number): Promise<{ message: string }> {
    const data = await this.findOne(id);
    await this.investRepository.remove(data);
    return { message: `Investasi ID ${id} berhasil dihapus` };
  }

  async getInvestDataField(): Promise<Partial<Investasi>[]> {
    return this.investRepository
      .createQueryBuilder('i')
      .select([
        'i.id',
        'i.parameter',
        'i.indikator',
        'i.hasil',
        'i.peringkat',
        'i.weighted',
      ])
      .orderBy('i.id', 'ASC')
      .getMany();
  }
}
