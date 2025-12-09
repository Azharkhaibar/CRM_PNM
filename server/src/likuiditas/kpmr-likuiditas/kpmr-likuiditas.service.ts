// src/kpmr-likuiditas/kpmr-likuiditas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { KpmrLikuiditas } from './entities/kpmr-likuidita.entity';
import { CreateKpmrLikuiditasDto } from './dto/create-kpmr-likuidita.dto';
import { UpdateKpmrLikuiditasDto } from './dto/update-kpmr-likuiditas.dto';
import { KpmrLikuiditasQueryDto } from './dto/kpmr-likuiditas-query.dto';

export interface KpmrGroup {
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  items: KpmrLikuiditas[];
  skorAverage: number;
}

export interface GroupedKpmrResponse {
  data: KpmrLikuiditas[];
  groups: KpmrGroup[];
  overallAverage: number;
}

export interface KpmrListResponse {
  data: KpmrLikuiditas[];
  total: number;
}

export interface KpmrExportData {
  year: number;
  quarter: string;
  rows: KpmrLikuiditas[];
  groups: KpmrGroup[];
  overallAverage: number;
  exportDate: string;
}

export interface KpmrWhereClause {
  year?: number;
  quarter?: string;
  aspekNo?: string;
  indikator?: any;
}

@Injectable()
export class KpmrLikuiditasService {
  constructor(
    @InjectRepository(KpmrLikuiditas)
    private readonly kpmrLikuiditasRepo: Repository<KpmrLikuiditas>,
  ) {}

  async create(createDto: CreateKpmrLikuiditasDto): Promise<KpmrLikuiditas> {
    const existing = await this.kpmrLikuiditasRepo.findOne({
      where: {
        year: createDto.year,
        quarter: createDto.quarter,
        aspekNo: createDto.aspekNo,
        sectionNo: createDto.sectionNo,
      },
    });

    if (existing) {
      throw new Error(
        'Data dengan tahun, quarter, aspekNo, dan sectionNo yang sama sudah ada',
      );
    }

    const kpmr = this.kpmrLikuiditasRepo.create(createDto);
    return await this.kpmrLikuiditasRepo.save(kpmr);
  }

  async findAll(query: KpmrLikuiditasQueryDto): Promise<KpmrListResponse> {
    const { year, quarter, search, aspekNo, page = 1, limit = 50 } = query;

    const where: KpmrWhereClause = {};

    if (year) where.year = year;
    if (quarter) where.quarter = quarter;
    if (aspekNo) where.aspekNo = aspekNo;

    if (search) {
      where.indikator = Like(`%${search}%`);
    }

    const options: FindManyOptions<KpmrLikuiditas> = {
      where,
      order: {
        aspekNo: 'ASC',
        sectionNo: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.kpmrLikuiditasRepo.findAndCount(options);

    return { data, total };
  }

  async findOne(id_kpmr_likuiditas: number): Promise<KpmrLikuiditas> {
    const kpmr = await this.kpmrLikuiditasRepo.findOne({
      where: { id_kpmr_likuiditas },
    });

    if (!kpmr) {
      throw new NotFoundException(
        `KPMR Likuiditas dengan ID ${id_kpmr_likuiditas} tidak ditemukan`,
      );
    }

    return kpmr;
  }

  async update(
    id_kpmr_likuiditas: number,
    updateDto: UpdateKpmrLikuiditasDto,
  ): Promise<KpmrLikuiditas> {
    const kpmr = await this.findOne(id_kpmr_likuiditas);

    Object.assign(kpmr, updateDto);

    return await this.kpmrLikuiditasRepo.save(kpmr);
  }

  async remove(id_kpmr_likuiditas: number): Promise<void> {
    const kpmr = await this.findOne(id_kpmr_likuiditas);
    await this.kpmrLikuiditasRepo.remove(kpmr);
  }

  async findByPeriod(year: number, quarter: string): Promise<KpmrLikuiditas[]> {
    return await this.kpmrLikuiditasRepo.find({
      where: { year, quarter },
      order: {
        aspekNo: 'ASC',
        sectionNo: 'ASC',
      },
    });
  }

  async getGroupedData(
    year: number,
    quarter: string,
  ): Promise<GroupedKpmrResponse> {
    const data = await this.findByPeriod(year, quarter);

    const groups = new Map<string, KpmrGroup>();

    data.forEach((item: KpmrLikuiditas) => {
      const key = `${item.aspekNo}|${item.aspekTitle}|${item.aspekBobot}`;

      if (!groups.has(key)) {
        groups.set(key, {
          aspekNo: item.aspekNo || '',
          aspekTitle: item.aspekTitle || '',
          aspekBobot: item.aspekBobot || 0,
          items: [],
          skorAverage: 0,
        });
      }

      const group = groups.get(key);
      if (group) {
        group.items.push(item);
      }
    });

    const groupedArray: KpmrGroup[] = Array.from(groups.values()).map(
      (group: KpmrGroup) => {
        const validScores: number[] = group.items
          .map((item: KpmrLikuiditas) => item.sectionSkor || 0)
          .filter(
            (score: number) => score !== null && !isNaN(score) && score > 0,
          );

        group.skorAverage =
          validScores.length > 0
            ? Number(
                (
                  validScores.reduce(
                    (sum: number, score: number) => sum + score,
                    0,
                  ) / validScores.length
                ).toFixed(2),
              )
            : 0;

        return group;
      },
    );

    const validAverages: number[] = groupedArray
      .map((group: KpmrGroup) => group.skorAverage)
      .filter((avg: number) => avg > 0);

    const overallAverage: number =
      validAverages.length > 0
        ? Number(
            (
              validAverages.reduce((sum: number, avg: number) => sum + avg, 0) /
              validAverages.length
            ).toFixed(2),
          )
        : 0;

    return {
      data,
      groups: groupedArray,
      overallAverage,
    };
  }

  async getExportData(year: number, quarter: string): Promise<KpmrExportData> {
    const data = await this.findByPeriod(year, quarter);
    const groupedData = await this.getGroupedData(year, quarter);

    return {
      year,
      quarter,
      rows: data,
      groups: groupedData.groups,
      overallAverage: groupedData.overallAverage,
      exportDate: new Date().toISOString(),
    };
  }
}
