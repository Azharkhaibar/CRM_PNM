import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReputasiDto } from './dto/create-reputasi.dto';
import { UpdateReputasiDto } from './dto/update-reputasi.dto';
import { Reputasi, CalculationMode, Quarter } from './entities/reputasi.entity';
import { ReputasiSection } from './entities/reputasi-section.entity';
import { CreateReputasiSectionDto } from './dto/create-reputasi-section.dto';
import { UpdateReputasiSectionDto } from './dto/update-reputasi-section.dto';

@Injectable()
export class ReputasiService {
  constructor(
    @InjectRepository(Reputasi)
    private reputasiRepo: Repository<Reputasi>,
    @InjectRepository(ReputasiSection)
    private sectionRepo: Repository<ReputasiSection>,
  ) {}

  // ============ SECTION METHODS ============
  async createSection(
    data: CreateReputasiSectionDto,
  ): Promise<ReputasiSection> {
    // Cek dengan withDeleted: true untuk melihat semua data
    const existing = await this.sectionRepo.findOne({
      where: { no: data.no },
      withDeleted: true,
    });

    if (existing) {
      // Jika data sudah ada dan aktif, throw error biasa
      if (!existing.isDeleted) {
        throw new BadRequestException(
          `Section reputasi dengan nomor "${data.no}" sudah ada`,
        );
      }

      // Jika data sudah di-delete, kita RESTORE dengan data baru
      existing.isDeleted = false;
      Object.assign(existing, data);
      return await this.sectionRepo.save(existing);
    }

    // Jika tidak ada data dengan no yang sama, buat baru
    const section = this.sectionRepo.create(data);
    return await this.sectionRepo.save(section);
  }

  async findAllSection(): Promise<ReputasiSection[]> {
    return await this.sectionRepo.find({
      where: { isDeleted: false },
      order: { sortOrder: 'ASC', no: 'ASC' },
    });
  }

  async findSectionById(id: number): Promise<ReputasiSection> {
    const section = await this.sectionRepo.findOne({
      where: { id, isDeleted: false },
    });

    if (!section) {
      throw new NotFoundException(
        `Section reputasi dengan ID ${id} tidak ditemukan`,
      );
    }
    return section;
  }

  async updateSection(
    id: number,
    data: UpdateReputasiSectionDto,
  ): Promise<ReputasiSection> {
    const section = await this.findSectionById(id);

    // Jika nomor diubah
    if (data.no !== undefined && data.no !== section.no) {
      // Cek dengan withDeleted: true
      const existing = await this.sectionRepo.findOne({
        where: { no: data.no },
        withDeleted: true,
      });

      // Jika ada data dengan nomor yang baru
      if (existing) {
        // Jika data aktif (dan bukan data yang sama), throw error
        if (!existing.isDeleted && existing.id !== id) {
          throw new BadRequestException(
            `Section reputasi dengan nomor "${data.no}" sudah ada`,
          );
        }

        // Jika data sudah di-delete, hard delete untuk memberi jalan
        if (existing.isDeleted) {
          await this.sectionRepo.remove(existing);
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

  // ============ REPUTASI METHODS ============
  async findAll(): Promise<Reputasi[]> {
    return await this.reputasiRepo.find({
      where: { isDeleted: false },
      relations: ['section'],
      order: { year: 'DESC', quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Reputasi> {
    const reputasi = await this.reputasiRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!reputasi) {
      throw new NotFoundException(
        `Data reputasi dengan id ${id} tidak ditemukan`,
      );
    }
    return reputasi;
  }

  async remove(id: number): Promise<void> {
    const reputasi = await this.findOne(id);
    reputasi.isDeleted = true;
    reputasi.deletedAt = new Date();
    await this.reputasiRepo.save(reputasi);
  }

  async findByPeriod(year: number, quarter: Quarter): Promise<Reputasi[]> {
    return await this.reputasiRepo.find({
      where: { year, quarter, isDeleted: false },
      relations: ['section'],
      order: { no: 'ASC', subNo: 'ASC' },
    });
  }

  async findById(id: number): Promise<Reputasi> {
    return this.findOne(id);
  }

  private calculateHasil(data: {
    mode?: CalculationMode;
    pembilangValue?: number | null;
    penyebutValue?: number | null;
    formula?: string | null;
    isPercent?: boolean;
    hasilText?: string | null;
  }): string | null {
    const mode = data.mode || CalculationMode.RASIO;

    if (mode === CalculationMode.TEKS) {
      return data.hasilText || null;
    }

    const pemb = data.pembilangValue || 0;
    const peny = data.penyebutValue || 0;

    if (mode === CalculationMode.NILAI_TUNGGAL) {
      return peny.toString();
    }

    // Mode RASIO
    if (data.formula && data.formula.trim() !== '') {
      try {
        const expr = data.formula
          .replace(/\bpemb\b/g, 'pemb')
          .replace(/\bpeny\b/g, 'peny');

        const fn = new Function('pemb', 'peny', `return (${expr});`);
        const result = fn(pemb, peny);

        if (isFinite(result) && !isNaN(result)) {
          if (data.isPercent) {
            return (result * 100).toFixed(2);
          }
          return result.toString();
        }
      } catch (error) {
        console.warn('Invalid formula:', data.formula, error);
      }
    }

    // Default formula: pemb / peny (sesuai dengan reputasi)
    if (peny === 0) {
      return null;
    }

    const result = pemb / peny;
    if (data.isPercent) {
      return (result * 100).toFixed(2);
    }
    return result.toString();
  }

  private calculateWeight(data: CreateReputasiDto | UpdateReputasiDto): number {
    const sectionBobot = data.bobotSection || 0;
    const indicatorBobot = data.bobotIndikator || 0;
    const peringkat = data.peringkat || 1;

    return (sectionBobot * indicatorBobot * peringkat) / 10000;
  }

  async create(data: CreateReputasiDto): Promise<Reputasi> {
    const section = await this.findSectionById(data.sectionId);

    // Validasi duplicate
    const existing = await this.reputasiRepo.findOne({
      where: {
        year: data.year,
        quarter: data.quarter,
        subNo: data.subNo,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Data reputasi dengan subNo ${data.subNo} sudah ada untuk periode ${data.year} ${data.quarter}`,
      );
    }

    // Hitung hasil dan weighted
    const hasil = this.calculateHasil(data);
    const weighted = data.weighted || this.calculateWeight(data);

    const reputasiData: Partial<Reputasi> = {
      ...data,
      sectionLabel: section.parameter,
      hasil,
      hasilText: data.mode === CalculationMode.TEKS ? data.hasilText : null,
      weighted,
      section,
      // Pastikan nullable fields diisi dengan null jika undefined
      sumberRisiko: data.sumberRisiko || null,
      dampak: data.dampak || null,
      low: data.low || null,
      lowToModerate: data.lowToModerate || null,
      moderate: data.moderate || null,
      moderateToHigh: data.moderateToHigh || null,
      high: data.high || null,
      pembilangLabel: data.pembilangLabel || null,
      pembilangValue:
        data.pembilangValue !== undefined ? data.pembilangValue : null,
      penyebutLabel: data.penyebutLabel || null,
      penyebutValue:
        data.penyebutValue !== undefined ? data.penyebutValue : null,
      formula: data.formula || null,
      keterangan: data.keterangan || null,
    };

    const reputasi = this.reputasiRepo.create(reputasiData);
    return await this.reputasiRepo.save(reputasi);
  }

  async update(id: number, data: UpdateReputasiDto): Promise<Reputasi> {
    const reputasi = await this.findOne(id);

    // Jika sectionId diubah, validasi section baru
    if (data.sectionId && data.sectionId !== reputasi.sectionId) {
      const newSection = await this.findSectionById(data.sectionId);
      reputasi.section = newSection;
      reputasi.sectionId = newSection.id;
      reputasi.sectionLabel = newSection.parameter;
    }

    // Update field yang diubah
    if (data.no !== undefined) reputasi.no = data.no;
    if (data.sectionLabel !== undefined)
      reputasi.sectionLabel = data.sectionLabel;
    if (data.bobotSection !== undefined)
      reputasi.bobotSection = data.bobotSection;
    if (data.subNo !== undefined) reputasi.subNo = data.subNo;
    if (data.indikator !== undefined) reputasi.indikator = data.indikator;
    if (data.bobotIndikator !== undefined)
      reputasi.bobotIndikator = data.bobotIndikator;
    if (data.mode !== undefined) reputasi.mode = data.mode;
    if (data.peringkat !== undefined) reputasi.peringkat = data.peringkat;
    if (data.weighted !== undefined) reputasi.weighted = data.weighted;
    if (data.isPercent !== undefined) reputasi.isPercent = data.isPercent;

    // Update nullable string fields
    if (data.hasilText !== undefined)
      reputasi.hasilText = data.hasilText || null;
    if (data.pembilangLabel !== undefined)
      reputasi.pembilangLabel = data.pembilangLabel || null;
    if (data.pembilangValue !== undefined)
      reputasi.pembilangValue = data.pembilangValue;
    if (data.penyebutLabel !== undefined)
      reputasi.penyebutLabel = data.penyebutLabel || null;
    if (data.penyebutValue !== undefined)
      reputasi.penyebutValue = data.penyebutValue;
    if (data.formula !== undefined) reputasi.formula = data.formula || null;
    if (data.sumberRisiko !== undefined)
      reputasi.sumberRisiko = data.sumberRisiko || null;
    if (data.dampak !== undefined) reputasi.dampak = data.dampak || null;
    if (data.keterangan !== undefined)
      reputasi.keterangan = data.keterangan || null;
    if (data.low !== undefined) reputasi.low = data.low || null;
    if (data.lowToModerate !== undefined)
      reputasi.lowToModerate = data.lowToModerate || null;
    if (data.moderate !== undefined) reputasi.moderate = data.moderate || null;
    if (data.moderateToHigh !== undefined)
      reputasi.moderateToHigh = data.moderateToHigh || null;
    if (data.high !== undefined) reputasi.high = data.high || null;

    // Hitung ulang hasil jika diperlukan
    const shouldRecalculateHasil =
      data.mode !== undefined ||
      data.pembilangValue !== undefined ||
      data.penyebutValue !== undefined ||
      data.formula !== undefined ||
      data.isPercent !== undefined;

    if (shouldRecalculateHasil) {
      const mode = data.mode !== undefined ? data.mode : reputasi.mode;

      const calculationData = {
        mode,
        pembilangValue: reputasi.pembilangValue,
        penyebutValue: reputasi.penyebutValue,
        formula: reputasi.formula,
        isPercent: reputasi.isPercent,
        hasilText: reputasi.hasilText,
      };
      reputasi.hasil = this.calculateHasil(calculationData);
    }

    // Hitung ulang weighted jika diperlukan
    const shouldRecalculateWeight =
      data.bobotSection !== undefined ||
      data.bobotIndikator !== undefined ||
      data.peringkat !== undefined;

    if (shouldRecalculateWeight && !data.weighted) {
      const weightData: any = {
        bobotSection: reputasi.bobotSection,
        bobotIndikator: reputasi.bobotIndikator,
        peringkat: reputasi.peringkat,
      };
      reputasi.weighted = this.calculateWeight(weightData);
    }

    return await this.reputasiRepo.save(reputasi);
  }

  async delete(id: number): Promise<void> {
    const reputasi = await this.findOne(id);
    reputasi.isDeleted = true;
    reputasi.deletedAt = new Date();
    await this.reputasiRepo.save(reputasi);
  }

  async bulkCreate(data: CreateReputasiDto[]): Promise<Reputasi[]> {
    const createdItems: Reputasi[] = [];

    for (const item of data) {
      try {
        const created = await this.create(item);
        createdItems.push(created);
      } catch (error) {
        // Jika ada error, batalkan semua yang sudah dibuat
        for (const created of createdItems) {
          await this.reputasiRepo.remove(created);
        }
        throw error;
      }
    }

    return createdItems;
  }

  async findByYear(year: number): Promise<Reputasi[]> {
    return await this.reputasiRepo.find({
      where: { year, isDeleted: false },
      relations: ['section'],
      order: { quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
    });
  }

  async getSummary(year: number, quarter: Quarter) {
    const items = await this.findByPeriod(year, quarter);

    const totalWeighted = items.reduce(
      (sum, item) => sum + (item.weighted || 0),
      0,
    );

    // Group by section
    const sections = items.reduce((acc, item) => {
      const sectionId = item.sectionId;
      if (!acc[sectionId]) {
        acc[sectionId] = {
          section: item.section,
          items: [],
          totalWeighted: 0,
        };
      }
      acc[sectionId].items.push(item);
      acc[sectionId].totalWeighted += item.weighted || 0;
      return acc;
    }, {});

    return {
      year,
      quarter,
      totalItems: items.length,
      totalWeighted,
      sections: Object.values(sections),
      items,
    };
  }

  async findBySection(
    sectionId: number,
    year?: number,
    quarter?: Quarter,
  ): Promise<Reputasi[]> {
    const where: any = {
      sectionId,
      isDeleted: false,
    };

    if (year !== undefined) {
      where.year = year;
    }

    if (quarter !== undefined) {
      where.quarter = quarter;
    }

    return await this.reputasiRepo.find({
      where,
      relations: ['section'],
      order: {
        year: 'DESC',
        quarter: 'ASC',
        subNo: 'ASC',
      },
    });
  }

  async deleteByPeriod(year: number, quarter: Quarter): Promise<number> {
    const result = await this.reputasiRepo.update(
      { year, quarter },
      { isDeleted: true, deletedAt: new Date() },
    );
    return result.affected || 0;
  }

  // ============ METHODS KHUSUS REPUTASI ============
  async getReputasiScore(year: number, quarter: Quarter): Promise<number> {
    const items = await this.findByPeriod(year, quarter);
    const totalWeighted = items.reduce(
      (sum, item) => sum + (item.weighted || 0),
      0,
    );
    return totalWeighted;
  }

  async getRiskLevelDistribution(year: number, quarter: Quarter) {
    const items = await this.findByPeriod(year, quarter);

    const distribution = {
      low: 0,
      lowToModerate: 0,
      moderate: 0,
      moderateToHigh: 0,
      high: 0,
    };

    items.forEach((item) => {
      // Logika untuk menentukan level risiko berdasarkan peringkat
      if (item.peringkat === 1) distribution.low++;
      else if (item.peringkat === 2) distribution.lowToModerate++;
      else if (item.peringkat === 3) distribution.moderate++;
      else if (item.peringkat === 4) distribution.moderateToHigh++;
      else if (item.peringkat === 5) distribution.high++;
    });

    return {
      year,
      quarter,
      distribution,
      totalItems: items.length,
    };
  }
}
