import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { KpmrInvestasi } from './entities/kpmr-investasi.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKpmrInvestasiDto } from './dto/create-kpmr-investasi.dto';
import { UpdateKpmrInvestasiDto } from './dto/update-kpmr-investasi.dto';

@Injectable()
export class KpmrInvestasiService {
  private readonly logger = new Logger(KpmrInvestasiService.name);
  constructor(
    @InjectRepository(KpmrInvestasi)
    private readonly kpmrInvestRepository: Repository<KpmrInvestasi>,
  ) {}

  async create(
    createKpmrInvestasiDto: CreateKpmrInvestasiDto,
  ): Promise<KpmrInvestasi> {
    this.logger.log(
      `CREATE request received: ${JSON.stringify(createKpmrInvestasiDto)}`,
    );
    try {
      const kpmrInvest = this.kpmrInvestRepository.create(
        createKpmrInvestasiDto,
      );
      const saved = await this.kpmrInvestRepository.save(kpmrInvest);
      this.logger.log(`CREATE success: ${JSON.stringify(saved)}`);
      return saved;
    } catch (error) {
      this.logger.error('CREATE failed', error);
      throw error;
    }
  }

  async findAll(): Promise<KpmrInvestasi[]> {
    this.logger.log('Fetching all KPMR Investasi');
    return this.kpmrInvestRepository.find();
  }

  async findOne(id: number): Promise<KpmrInvestasi> {
    const entity = await this.kpmrInvestRepository.findOne({
      where: { id_kpmr_investasi: id },
    });
    if (!entity)
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    return entity;
  }

  async update(
    id: number,
    dto: UpdateKpmrInvestasiDto,
  ): Promise<KpmrInvestasi> {
    await this.kpmrInvestRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kpmrInvestRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
  }

  async findByPeriod(year: number, quarter: string): Promise<KpmrInvestasi[]> {
    return await this.kpmrInvestRepository.find({ where: { year, quarter } });
  }

  async findByFilters(filters: {
    year?: number;
    quarter?: string;
    aspekNo?: string;
    query?: string;
  }): Promise<KpmrInvestasi[]> {
    const qb = this.kpmrInvestRepository.createQueryBuilder('kpmr');

    if (filters.year !== undefined)
      qb.andWhere('kpmr.year = :year', { year: filters.year });
    if (filters.quarter)
      qb.andWhere('kpmr.quarter = :quarter', { quarter: filters.quarter });
    if (filters.aspekNo)
      qb.andWhere('kpmr.aspek_no = :aspekNo', { aspekNo: filters.aspekNo });
    if (filters.query) {
      qb.andWhere(
        '(kpmr.indikator LIKE :q OR kpmr.aspek_title LIKE :q OR kpmr.section_title LIKE :q OR kpmr.evidence LIKE :q)',
        { q: `%${filters.query}%` },
      );
    }

    return await qb.getMany();
  }
}
