import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKpmrInvestasiDto } from './dto/create-kpmr-investasi.dto';
import { UpdateKpmrInvestasiDto } from './dto/update-kpmr-investasi.dto';
import { Repository } from 'typeorm';
import { KpmrInvestasi } from './entities/kpmr-investasi.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KpmrInvestasiService {
  constructor(
    @InjectRepository(KpmrInvestasi)
    private readonly kpmrInvestRepository: Repository<KpmrInvestasi>,
  ) {}

  async create(
    createKpmrInvestasiDto: CreateKpmrInvestasiDto,
  ): Promise<KpmrInvestasi> {
    try {
      const kpmrInvest = this.kpmrInvestRepository.create(
        createKpmrInvestasiDto,
      );
      return await this.kpmrInvestRepository.save(kpmrInvest);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create KPMR Investasi: ${error.message}`);
      }
      throw new Error('Failed to create KPMR Investasi');
    }
  }

  async findAll(): Promise<KpmrInvestasi[]> {
    return await this.kpmrInvestRepository.find();
  }

  async findOne(id: number): Promise<KpmrInvestasi> {
    const findKpmrInvestasi = await this.kpmrInvestRepository.findOne({
      where: { id_kpmr_investasi: id },
    });

    if (!findKpmrInvestasi) {
      throw new NotFoundException(`KPMR Investasi with ID ${id} not found`);
    }
    return findKpmrInvestasi;
  }

  async findByPeriod(year: number, quarter: string): Promise<KpmrInvestasi[]> {
    const qb = this.kpmrInvestRepository.createQueryBuilder('kpmr');

    if (year !== undefined && year !== null) {
      qb.andWhere('kpmr.year = :year', { year });
    }

    if (quarter) {
      qb.andWhere('kpmr.quarter = :quarter', { quarter });
    }

    return await qb.getMany();
  }

  async update(
    id: number,
    updateKpmrInvestasiDto: UpdateKpmrInvestasiDto,
  ): Promise<KpmrInvestasi> {
    const existingData = await this.findOne(id);
    await this.kpmrInvestRepository.update(
      { id_kpmr_investasi: id },
      updateKpmrInvestasiDto,
    );

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kpmrInvestRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`KPMR Investasi with ID ${id} not found`);
    }
  }

  async findByFilters(filters: {
    year?: number;
    quarter?: string;
    aspek_no?: string;
    query?: string;
  }): Promise<KpmrInvestasi[]> {
    const queryBuilder = this.kpmrInvestRepository.createQueryBuilder('kpmr');

    if (filters.year) {
      queryBuilder.andWhere('kpmr.year = :year', { year: filters.year });
    }

    if (filters.quarter) {
      queryBuilder.andWhere('kpmr.quarter = :quarter', {
        quarter: filters.quarter,
      });
    }

    if (filters.aspek_no) {
      queryBuilder.andWhere('kpmr.aspek_no = :aspek_no', {
        aspek_no: filters.aspek_no,
      });
    }

    if (filters.query) {
      queryBuilder.andWhere(
        '(kpmr.tata_kelola_resiko LIKE :query OR kpmr.aspek_title LIKE :query OR kpmr.section_title LIKE :query OR kpmr.evidence LIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    return await queryBuilder.getMany();
  }
}
