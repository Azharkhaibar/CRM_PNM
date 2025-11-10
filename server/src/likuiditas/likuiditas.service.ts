import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Likuiditas } from './entities/likuidita.entity';
import { CreateLikuiditasDto } from './dto/create-likuidita.dto';
import { UpdateLikuiditasDto } from './dto/update-likuidita.dto';

@Injectable()
export class LikuiditasService {
  constructor(
    @InjectRepository(Likuiditas)
    private readonly likuiditasRepo: Repository<Likuiditas>,
  ) {}

  private calculateWeighted(
    hasil: number,
    bobotIndikator: number,
    bobotParameter: number,
  ) {
    return hasil * bobotIndikator * bobotParameter;
  }

  async create(dto: CreateLikuiditasDto): Promise<Likuiditas> {
    const weighted = this.calculateWeighted(
      dto.hasil,
      dto.bobot_indikator,
      dto.bobot,
    );

    const entity = this.likuiditasRepo.create({
      ...dto,
      weighted,
    });

    return this.likuiditasRepo.save(entity);
  }

  async findAll(): Promise<Likuiditas[]> {
    return this.likuiditasRepo.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Likuiditas> {
    const row = await this.likuiditasRepo.findOne({ where: { id } });

    if (!row)
      throw new NotFoundException(`Likuiditas ID ${id} tidak ditemukan`);

    return row;
  }

  async update(id: number, dto: UpdateLikuiditasDto): Promise<Likuiditas> {
    const row = await this.findOne(id);

    const merged = Object.assign(row, dto);

    merged.weighted = this.calculateWeighted(
      merged.hasil,
      merged.bobot_indikator,
      merged.bobot,
    );

    return this.likuiditasRepo.save(merged);
  }

  async remove(id: number): Promise<{ message: string }> {
    const row = await this.findOne(id);

    await this.likuiditasRepo.remove(row);

    return { message: `Likuiditas ID ${id} berhasil dihapus` };
  }
  async summary(): Promise<Partial<Likuiditas>[]> {
    return this.likuiditasRepo
      .createQueryBuilder('l')
      .select([
        'l.id',
        'l.parameter',
        'l.indikator',
        'l.hasil',
        'l.peringkat',
        'l.weighted',
      ])
      .orderBy('l.id', 'ASC')
      .getMany();
  }
}
