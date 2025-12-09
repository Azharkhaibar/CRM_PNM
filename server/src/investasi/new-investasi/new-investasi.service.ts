import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Investasi,
  CalculationMode,
  Quarter,
} from './entities/new-investasi.entity';
import { InvestasiSection } from './entities/new-investasi-section.entity';
import { CreateInvestasiDto } from './dto/create-new-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-new-investasi.dto';
import { CreateSectionDto } from './dto/create-investasi-section.dto';
import { UpdateInvestasiSectionDto } from './dto/update-new-investasi.dto';

@Injectable()
export class InvestasiService {
  constructor(
    @InjectRepository(Investasi)
    private investasiRepo: Repository<Investasi>,
    @InjectRepository(InvestasiSection)
    private sectionRepo: Repository<InvestasiSection>,
  ) {}

  // ===================== SECTION SERVICES =====================
  async findAllSections(): Promise<InvestasiSection[]> {
    return await this.sectionRepo.find({
      where: { isDeleted: false },
      order: { no: 'ASC' },
    });
  }

  async findSectionById(id: number): Promise<InvestasiSection> {
    const section = await this.sectionRepo.findOne({
      where: { id, isDeleted: false },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return section;
  }

  async createSection(data: CreateSectionDto): Promise<InvestasiSection> {
    // 1. Cek apakah ada data dengan no yang sama (baik aktif maupun deleted)
    const existing = await this.sectionRepo.findOne({
      where: { no: data.no },
      withDeleted: true, // TypeORM option untuk include soft-deleted data
    });

    // 2. Jika ada data dengan no yang sama
    if (existing) {
      // 2a. Jika data aktif, throw error biasa
      if (!existing.isDeleted) {
        throw new BadRequestException(`Section dengan no ${data.no} sudah ada`);
      }

      // 2b. Jika data sudah di-delete, kita RESTORE dengan data baru
      // Ini mencegah duplicate entry dan menjaga historical data
      existing.isDeleted = false;
      Object.assign(existing, data);
      return await this.sectionRepo.save(existing);
    }

    // 3. Jika tidak ada data dengan no yang sama, buat baru
    const section = this.sectionRepo.create(data);
    return await this.sectionRepo.save(section);
  }

  async updateSection(
    id: number,
    data: UpdateInvestasiSectionDto,
  ): Promise<InvestasiSection> {
    const section = await this.findSectionById(id);

    // Jika nomor diubah
    if (data.no && data.no !== section.no) {
      // Cek apakah ada data (aktif atau deleted) dengan no yang baru
      const existingWithNewNo = await this.sectionRepo.findOne({
        where: { no: data.no },
        withDeleted: true,
      });

      // Jika ada data dengan no yang baru
      if (existingWithNewNo) {
        // Jika data aktif, throw error
        if (!existingWithNewNo.isDeleted && existingWithNewNo.id !== id) {
          throw new BadRequestException(
            `Section dengan no ${data.no} sudah ada`,
          );
        }

        // Jika data sudah di-delete, hapus permanent untuk memberi jalan
        // atau bisa juga restore dengan ID yang berbeda (tapi perlu pertimbangan)
        if (existingWithNewNo.isDeleted) {
          await this.sectionRepo.remove(existingWithNewNo); // Hard delete
        }
      }
    }

    Object.assign(section, data);
    return await this.sectionRepo.save(section);
  }

  async deleteSection(id: number): Promise<void> {
    const section = await this.findSectionById(id);
    section.isDeleted = true;
    await this.sectionRepo.save(section);
  }

  // ===================== INVESTASI SERVICES =====================
  async findByPeriod(year: number, quarter: Quarter): Promise<Investasi[]> {
    return await this.investasiRepo.find({
      where: {
        year,
        quarter,
        isDeleted: false,
      },
      relations: ['section'],
      order: {
        no: 'ASC',
        subNo: 'ASC',
      },
    });
  }

  async findById(id: number): Promise<Investasi> {
    const investasi = await this.investasiRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!investasi) {
      throw new NotFoundException(`Investasi with ID ${id} not found`);
    }

    return investasi;
  }

  async create(data: CreateInvestasiDto): Promise<Investasi> {
    const section = await this.findSectionById(data.sectionId);

    // Hitung hasil dan weighted
    const hasil = this.calculateHasil(data);
    const weighted = this.calculateWeighted(data);

    // ❌ HAPUS 'no' dari data karena akan di-override
    const { no, sectionLabel, bobotSection, ...restData } = data;

    const investasi = this.investasiRepo.create({
      ...restData,
      hasil,
      weighted,
      section,
      // ✅ Gunakan data dari section
      no: section.no,
      sectionLabel: section.parameter,
      bobotSection: section.bobotSection,
    });

    return await this.investasiRepo.save(investasi);
  }

  async update(id: number, data: UpdateInvestasiDto): Promise<Investasi> {
    const investasi = await this.findById(id);

    // PERBAIKAN: Validasi sectionId
    if (data.sectionId && data.sectionId !== investasi.sectionId) {
      const section = await this.findSectionById(data.sectionId);

      if (data.no !== section.no) {
        throw new BadRequestException('Section no mismatch');
      }

      investasi.section = section;
    }

    // PERBAIKAN: Hitung ulang hasil dan weighted
    const hasil = this.calculateHasil(data);
    const weighted = this.calculateWeighted(data);

    Object.assign(investasi, data, { hasil, weighted });

    return await this.investasiRepo.save(investasi);
  }

  async delete(id: number): Promise<void> {
    const investasi = await this.findById(id);
    investasi.isDeleted = true;
    investasi.deletedAt = new Date();
    await this.investasiRepo.save(investasi);
  }

  async getSummary(year: number, quarter: Quarter): Promise<any> {
    const investasiList = await this.findByPeriod(year, quarter);

    const totalWeighted = investasiList.reduce(
      (sum, item) => sum + Number(item.weighted || 0),
      0,
    );
    const sections = new Set(investasiList.map((item) => item.sectionLabel));

    return {
      year,
      quarter,
      totalIndicators: investasiList.length,
      totalSections: sections.size,
      totalWeighted: parseFloat(totalWeighted.toFixed(4)),
      averageRating:
        investasiList.length > 0
          ? parseFloat(
              (
                investasiList.reduce((sum, item) => sum + item.peringkat, 0) /
                investasiList.length
              ).toFixed(2),
            )
          : 0,
    };
  }

  // ===================== HELPER METHODS =====================
  private calculateHasil(
    data: CreateInvestasiDto | UpdateInvestasiDto,
  ): number {
    // PERBAIKAN: Handle undefined values
    if (data.mode === CalculationMode.NILAI_TUNGGAL) {
      return data.denominatorValue || 0;
    }

    if (!data.denominatorValue || data.denominatorValue === 0) {
      return 0;
    }

    if (data.formula && data.formula.trim() !== '') {
      try {
        const fn = new Function('pemb', 'peny', `return (${data.formula});`);
        const result = fn(data.numeratorValue || 0, data.denominatorValue || 0);

        if (!isFinite(result) || isNaN(result)) {
          throw new Error('Invalid formula result');
        }

        return data.isPercent ? result * 100 : result;
      } catch (error) {
        throw new BadRequestException(`Invalid formula: ${error.message}`);
      }
    }

    // PERBAIKAN: Handle possible undefined
    const numerator = data.numeratorValue || 0;
    const denominator = data.denominatorValue || 0;
    const result = denominator === 0 ? 0 : numerator / denominator;

    return data.isPercent ? result * 100 : result;
  }

  private calculateWeighted(
    data: CreateInvestasiDto | UpdateInvestasiDto,
  ): number {
    // PERBAIKAN: Handle undefined dengan nilai default
    const bobotSection = data.bobotSection || 0;
    const bobotIndikator = data.bobotIndikator || 0;
    const peringkat = data.peringkat || 1;

    const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
    return parseFloat(weighted.toFixed(4));
  }
}
