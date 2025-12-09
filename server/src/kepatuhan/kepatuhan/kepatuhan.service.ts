// src/kepatuhan/kepatuhan.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateKepatuhanDto } from './dto/create-kepatuhan.dto';
import { UpdateKepatuhanDto } from './dto/update-kepatuhan.dto';
import { Repository } from 'typeorm';
import {
  Kepatuhan,
  CalculationMode,
  Quarter,
} from './entities/kepatuhan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { KepatuhanSection } from './entities/kepatuhan-section.entity';
import { CreateKepatuhanSectionDto } from './dto/create-kepatuhan-section.dto';
import { UpdateKepatuhanSectionDto } from './dto/update-kepatuhan-section.dto';

@Injectable()
export class KepatuhanService {
  constructor(
    @InjectRepository(Kepatuhan)
    private kepatuhanRepo: Repository<Kepatuhan>,
    @InjectRepository(KepatuhanSection)
    private sectionRepo: Repository<KepatuhanSection>,
  ) {}

  // ============ SECTION METHODS ============
  async createSection(
    data: CreateKepatuhanSectionDto,
  ): Promise<KepatuhanSection> {
    // Cek dengan withDeleted: true untuk melihat semua data
    const existing = await this.sectionRepo.findOne({
      where: { no: data.no },
      withDeleted: true,
    });

    if (existing) {
      // Jika data sudah ada dan aktif, throw error biasa
      if (!existing.isDeleted) {
        throw new BadRequestException(
          `Section dengan nomor "${data.no}" sudah ada`,
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

  async findAllSection(): Promise<KepatuhanSection[]> {
    return await this.sectionRepo.find({
      where: { isDeleted: false },
      order: { sortOrder: 'ASC', no: 'ASC' },
    });
  }

  async findSectionById(id: number): Promise<KepatuhanSection> {
    const section = await this.sectionRepo.findOne({
      where: { id, isDeleted: false },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  async updateSection(
    id: number,
    data: UpdateKepatuhanSectionDto,
  ): Promise<KepatuhanSection> {
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
            `Section dengan nomor "${data.no}" sudah ada`,
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

  // ============ KEPATUHAN METHODS ============
  async findAll(): Promise<Kepatuhan[]> {
    return await this.kepatuhanRepo.find({
      where: { isDeleted: false },
      relations: ['section'],
      order: { year: 'DESC', quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Kepatuhan> {
    const kepatuhan = await this.kepatuhanRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!kepatuhan) {
      throw new NotFoundException(`Kepatuhan with id ${id} not found`);
    }
    return kepatuhan;
  }

  async remove(id: number): Promise<void> {
    const kepatuhan = await this.findOne(id);
    kepatuhan.isDeleted = true;
    kepatuhan.deletedAt = new Date();
    await this.kepatuhanRepo.save(kepatuhan);
  }

  async findByPeriod(year: number, quarter: Quarter): Promise<Kepatuhan[]> {
    return await this.kepatuhanRepo.find({
      where: { year, quarter, isDeleted: false },
      relations: ['section'],
      order: { no: 'ASC', subNo: 'ASC' },
    });
  }

  async findById(id: number): Promise<Kepatuhan> {
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

    // Default formula: peny / pemb
    if (pemb === 0) {
      return null;
    }

    const result = peny / pemb; // Perhatikan: untuk Kepatuhan, biasanya peny / pemb
    if (data.isPercent) {
      return (result * 100).toFixed(2);
    }
    return result.toString();
  }

  private calculateWeight(
    data: CreateKepatuhanDto | UpdateKepatuhanDto,
  ): number {
    const sectionBobot = data.bobotSection || 0;
    const indicatorBobot = data.bobotIndikator || 0;
    const peringkat = data.peringkat || 1;

    return (sectionBobot * indicatorBobot * peringkat) / 10000;
  }

  async create(data: CreateKepatuhanDto): Promise<Kepatuhan> {
    const section = await this.findSectionById(data.sectionId);

    // Validasi duplicate
    const existing = await this.kepatuhanRepo.findOne({
      where: {
        year: data.year,
        quarter: data.quarter,
        subNo: data.subNo,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Kepatuhan dengan subNo ${data.subNo} sudah ada untuk periode ${data.year} ${data.quarter}`,
      );
    }

    // Hitung hasil dan weighted
    const hasil = this.calculateHasil(data);
    const weighted = data.weighted || this.calculateWeight(data);

    const kepatuhanData: Partial<Kepatuhan> = {
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

    const kepatuhan = this.kepatuhanRepo.create(kepatuhanData);
    return await this.kepatuhanRepo.save(kepatuhan);
  }

  async update(id: number, data: UpdateKepatuhanDto): Promise<Kepatuhan> {
    const kepatuhan = await this.findOne(id);

    // Jika sectionId diubah, validasi section baru
    if (data.sectionId && data.sectionId !== kepatuhan.sectionId) {
      const newSection = await this.findSectionById(data.sectionId);
      kepatuhan.section = newSection;
      kepatuhan.sectionId = newSection.id;
      kepatuhan.sectionLabel = newSection.parameter;
    }

    // Update field yang diubah
    if (data.no !== undefined) kepatuhan.no = data.no;
    if (data.sectionLabel !== undefined)
      kepatuhan.sectionLabel = data.sectionLabel;
    if (data.bobotSection !== undefined)
      kepatuhan.bobotSection = data.bobotSection;
    if (data.subNo !== undefined) kepatuhan.subNo = data.subNo;
    if (data.indikator !== undefined) kepatuhan.indikator = data.indikator;
    if (data.bobotIndikator !== undefined)
      kepatuhan.bobotIndikator = data.bobotIndikator;
    if (data.mode !== undefined) kepatuhan.mode = data.mode;
    if (data.peringkat !== undefined) kepatuhan.peringkat = data.peringkat;
    if (data.weighted !== undefined) kepatuhan.weighted = data.weighted;
    if (data.isPercent !== undefined) kepatuhan.isPercent = data.isPercent;

    // Update nullable string fields
    if (data.hasilText !== undefined)
      kepatuhan.hasilText = data.hasilText || null;
    if (data.pembilangLabel !== undefined)
      kepatuhan.pembilangLabel = data.pembilangLabel || null;
    if (data.pembilangValue !== undefined)
      kepatuhan.pembilangValue = data.pembilangValue;
    if (data.penyebutLabel !== undefined)
      kepatuhan.penyebutLabel = data.penyebutLabel || null;
    if (data.penyebutValue !== undefined)
      kepatuhan.penyebutValue = data.penyebutValue;
    if (data.formula !== undefined) kepatuhan.formula = data.formula || null;
    if (data.sumberRisiko !== undefined)
      kepatuhan.sumberRisiko = data.sumberRisiko || null;
    if (data.dampak !== undefined) kepatuhan.dampak = data.dampak || null;
    if (data.keterangan !== undefined)
      kepatuhan.keterangan = data.keterangan || null;
    if (data.low !== undefined) kepatuhan.low = data.low || null;
    if (data.lowToModerate !== undefined)
      kepatuhan.lowToModerate = data.lowToModerate || null;
    if (data.moderate !== undefined) kepatuhan.moderate = data.moderate || null;
    if (data.moderateToHigh !== undefined)
      kepatuhan.moderateToHigh = data.moderateToHigh || null;
    if (data.high !== undefined) kepatuhan.high = data.high || null;

    // Hitung ulang hasil jika diperlukan
    const shouldRecalculateHasil =
      data.mode !== undefined ||
      data.pembilangValue !== undefined ||
      data.penyebutValue !== undefined ||
      data.formula !== undefined ||
      data.isPercent !== undefined;

    if (shouldRecalculateHasil) {
      const mode = data.mode !== undefined ? data.mode : kepatuhan.mode;

      const calculationData = {
        mode,
        pembilangValue: kepatuhan.pembilangValue,
        penyebutValue: kepatuhan.penyebutValue,
        formula: kepatuhan.formula,
        isPercent: kepatuhan.isPercent,
        hasilText: kepatuhan.hasilText,
      };
      kepatuhan.hasil = this.calculateHasil(calculationData);
    }

    // Hitung ulang weighted jika diperlukan
    const shouldRecalculateWeight =
      data.bobotSection !== undefined ||
      data.bobotIndikator !== undefined ||
      data.peringkat !== undefined;

    if (shouldRecalculateWeight && !data.weighted) {
      const weightData: any = {
        bobotSection: kepatuhan.bobotSection,
        bobotIndikator: kepatuhan.bobotIndikator,
        peringkat: kepatuhan.peringkat,
      };
      kepatuhan.weighted = this.calculateWeight(weightData);
    }

    return await this.kepatuhanRepo.save(kepatuhan);
  }

  async delete(id: number): Promise<void> {
    const kepatuhan = await this.findOne(id);
    kepatuhan.isDeleted = true;
    kepatuhan.deletedAt = new Date();
    await this.kepatuhanRepo.save(kepatuhan);
  }

  async bulkCreate(data: CreateKepatuhanDto[]): Promise<Kepatuhan[]> {
    const createdItems: Kepatuhan[] = [];

    for (const item of data) {
      try {
        const created = await this.create(item);
        createdItems.push(created);
      } catch (error) {
        // Jika ada error, batalkan semua yang sudah dibuat
        for (const created of createdItems) {
          await this.kepatuhanRepo.remove(created);
        }
        throw error;
      }
    }

    return createdItems;
  }

  async findByYear(year: number): Promise<Kepatuhan[]> {
    return await this.kepatuhanRepo.find({
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
  ): Promise<Kepatuhan[]> {
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

    return await this.kepatuhanRepo.find({
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
    const result = await this.kepatuhanRepo.update(
      { year, quarter },
      { isDeleted: true, deletedAt: new Date() },
    );
    return result.affected || 0;
  }
}
