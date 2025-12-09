// src/kpmr-pasar/kpmr-pasar.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpmrPasar } from './entities/kpmr-pasar.entity';
import { CreateKpmrPasarDto } from './dto/create-kpmr-pasar.dto';
import { UpdateKpmrPasarDto } from './dto/update-kpmr-pasar.dto';

// Interface untuk grouped data
export interface GroupedAspek {
  aspekNo?: string;
  aspekTitle?: string;
  aspekBobot?: number;
  items: KpmrPasar[];
  average_skor: string;
  total_items: number;
}

interface GroupedResult {
  [key: string]: Omit<GroupedAspek, 'average_skor' | 'total_items'>;
}

export interface PeriodResult {
  year: number;
  quarter: string;
}

@Injectable()
export class KpmrPasarService {
  constructor(
    @InjectRepository(KpmrPasar)
    private readonly kpmrPasarRepo: Repository<KpmrPasar>,
  ) {}

  async create(createDto: CreateKpmrPasarDto): Promise<KpmrPasar> {
    // Validasi required fields
    if (!createDto.year || !createDto.quarter) {
      throw new BadRequestException('Year dan Quarter harus diisi');
    }

    // Check for duplicate entry
    const isDuplicate = await this.checkDuplicate(
      createDto.year,
      createDto.quarter,
      createDto.aspekNo,
      createDto.sectionNo,
    );

    if (isDuplicate) {
      throw new ConflictException(
        `Data dengan year ${createDto.year}, quarter ${createDto.quarter}, aspek ${createDto.aspekNo}, section ${createDto.sectionNo} sudah ada`,
      );
    }

    const kpmr = this.kpmrPasarRepo.create(createDto);
    return await this.kpmrPasarRepo.save(kpmr);
  }

  async findAllByPeriod(year: number, quarter: string): Promise<KpmrPasar[]> {
    return await this.kpmrPasarRepo.find({
      where: { year, quarter },
      order: {
        aspekNo: 'ASC',
        sectionNo: 'ASC',
      },
    });
  }

  async findGroupedByAspek(
    year: number,
    quarter: string,
  ): Promise<GroupedAspek[]> {
    const data = await this.findAllByPeriod(year, quarter);

    // Group by aspek dengan type safety yang lebih ketat
    const grouped = data.reduce((acc: GroupedResult, item: KpmrPasar) => {
      const key = `${item.aspekNo ?? ''}|${item.aspekTitle ?? ''}|${item.aspekBobot ?? ''}`;

      if (!acc[key]) {
        acc[key] = {
          aspekNo: item.aspekNo ?? undefined,
          aspekTitle: item.aspekTitle ?? undefined,
          aspekBobot: item.aspekBobot ?? undefined,
          items: [],
        };
      }

      acc[key].items.push(item);
      return acc;
    }, {} as GroupedResult);

    // Calculate averages dengan type safety
    return Object.values(grouped).map((group): GroupedAspek => {
      const skorValues = group.items
        .map((item: KpmrPasar) => item.sectionSkor)
        .filter(
          (skor): skor is number =>
            skor !== null && skor !== undefined && !isNaN(skor),
        );

      const averageSkor =
        skorValues.length > 0
          ? (
              skorValues.reduce((a: number, b: number) => a + b, 0) /
              skorValues.length
            ).toFixed(2)
          : '0.00';

      return {
        aspekNo: group.aspekNo,
        aspekTitle: group.aspekTitle,
        aspekBobot: group.aspekBobot,
        items: group.items,
        average_skor: averageSkor,
        total_items: group.items.length,
      };
    });
  }

  async findOne(id: number): Promise<KpmrPasar> {
    const kpmr = await this.kpmrPasarRepo.findOne({
      where: { id_kpmr_pasar: id },
    });

    if (!kpmr) {
      throw new NotFoundException(`KPMR Pasar with ID ${id} not found`);
    }

    return kpmr;
  }

  async update(id: number, updateDto: UpdateKpmrPasarDto): Promise<KpmrPasar> {
    const kpmr = await this.kpmrPasarRepo.findOne({
      where: { id_kpmr_pasar: id },
    });

    if (!kpmr) {
      throw new NotFoundException(`KPMR Pasar with ID ${id} not found`);
    }

    // Type-safe check for duplicate dengan nullish coalescing
    const checkYear = updateDto.year ?? kpmr.year;
    const checkQuarter = updateDto.quarter ?? kpmr.quarter;
    const checkAspekNo = updateDto.aspekNo ?? kpmr.aspekNo;
    const checkSectionNo = updateDto.sectionNo ?? kpmr.sectionNo;

    // Only check duplicate if relevant fields are being updated
    if (
      updateDto.year !== undefined ||
      updateDto.quarter !== undefined ||
      updateDto.aspekNo !== undefined ||
      updateDto.sectionNo !== undefined
    ) {
      const existing = await this.kpmrPasarRepo.findOne({
        where: {
          year: checkYear,
          quarter: checkQuarter,
          aspekNo: checkAspekNo,
          sectionNo: checkSectionNo,
        },
      });

      if (existing && existing.id_kpmr_pasar !== id) {
        throw new ConflictException(
          'Data dengan kombinasi periode, aspek, dan section yang sama sudah ada',
        );
      }
    }

    // Update hanya fields yang ada di DTO
    const updateData: Partial<KpmrPasar> = {};

    if (updateDto.year !== undefined) updateData.year = updateDto.year;
    if (updateDto.quarter !== undefined) updateData.quarter = updateDto.quarter;
    if (updateDto.aspekNo !== undefined) updateData.aspekNo = updateDto.aspekNo;
    if (updateDto.aspekBobot !== undefined)
      updateData.aspekBobot = updateDto.aspekBobot;
    if (updateDto.aspekTitle !== undefined)
      updateData.aspekTitle = updateDto.aspekTitle;
    if (updateDto.sectionNo !== undefined)
      updateData.sectionNo = updateDto.sectionNo;
    if (updateDto.indikator !== undefined)
      updateData.indikator = updateDto.indikator;
    if (updateDto.sectionSkor !== undefined)
      updateData.sectionSkor = updateDto.sectionSkor;
    if (updateDto.strong !== undefined) updateData.strong = updateDto.strong;
    if (updateDto.satisfactory !== undefined)
      updateData.satisfactory = updateDto.satisfactory;
    if (updateDto.fair !== undefined) updateData.fair = updateDto.fair;
    if (updateDto.marginal !== undefined)
      updateData.marginal = updateDto.marginal;
    if (updateDto.unsatisfactory !== undefined)
      updateData.unsatisfactory = updateDto.unsatisfactory;
    if (updateDto.evidence !== undefined)
      updateData.evidence = updateDto.evidence;

    const updatedKpmr = this.kpmrPasarRepo.merge(kpmr, updateData);
    return await this.kpmrPasarRepo.save(updatedKpmr);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kpmrPasarRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`KPMR Pasar with ID ${id} not found`);
    }
  }

  async getTotalAverage(year: number, quarter: string): Promise<number> {
    const grouped = await this.findGroupedByAspek(year, quarter);

    const averages = grouped
      .map((group) => {
        const avg = parseFloat(group.average_skor);
        return isNaN(avg) ? null : avg;
      })
      .filter((avg): avg is number => avg !== null);

    if (averages.length === 0) return 0;

    const totalAverage = averages.reduce((a, b) => a + b, 0) / averages.length;
    return Number(totalAverage.toFixed(2));
  }

  async checkDuplicate(
    year: number,
    quarter: string,
    aspekNo?: string,
    sectionNo?: string,
  ): Promise<boolean> {
    const whereClause: {
      year: number;
      quarter: string;
      aspekNo?: string;
      sectionNo?: string;
    } = {
      year,
      quarter,
    };

    if (aspekNo !== undefined) whereClause.aspekNo = aspekNo;
    if (sectionNo !== undefined) whereClause.sectionNo = sectionNo;

    const existing = await this.kpmrPasarRepo.findOne({
      where: whereClause,
    });

    return !!existing;
  }

  async getPeriods(): Promise<PeriodResult[]> {
    const results = await this.kpmrPasarRepo
      .createQueryBuilder('kpmr')
      .select(['kpmr.year', 'kpmr.quarter'])
      .distinct(true)
      .orderBy('kpmr.year', 'DESC')
      .addOrderBy('kpmr.quarter', 'DESC')
      .getRawMany();

    // Type-safe transformation dengan validasi
    return results
      .map((result: { kpmr_year: string; kpmr_quarter: string }) => ({
        year: parseInt(result.kpmr_year, 10),
        quarter: result.kpmr_quarter,
      }))
      .filter(
        (period): period is PeriodResult =>
          !isNaN(period.year) &&
          ['Q1', 'Q2', 'Q3', 'Q4'].includes(period.quarter),
      );
  }

  // Method tambahan untuk mencari berdasarkan kriteria
  async findByCriteria(criteria: {
    year?: number;
    quarter?: string;
    aspekNo?: string;
    sectionNo?: string;
  }): Promise<KpmrPasar[]> {
    const whereClause: Partial<{
      year: number;
      quarter: string;
      aspekNo: string;
      sectionNo: string;
    }> = {};

    if (criteria.year !== undefined) whereClause.year = criteria.year;
    if (criteria.quarter !== undefined) whereClause.quarter = criteria.quarter;
    if (criteria.aspekNo !== undefined) whereClause.aspekNo = criteria.aspekNo;
    if (criteria.sectionNo !== undefined)
      whereClause.sectionNo = criteria.sectionNo;

    return await this.kpmrPasarRepo.find({
      where: whereClause,
      order: { aspekNo: 'ASC', sectionNo: 'ASC' },
    });
  }
}
