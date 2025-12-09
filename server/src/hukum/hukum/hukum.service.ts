// src/hukum/hukum.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateHukumDto } from './dto/create-hukum.dto';
import { UpdateHukumDto } from './dto/update-hukum.dto';
import { Repository } from 'typeorm';
import { Hukum, CalculationMode, Quarter } from './entities/hukum.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HukumSection } from './entities/hukum-section.entity';
import { CreateHukumSectionDto } from './dto/create-hukum-section.dto';
import { UpdateHukumSectionDto } from './dto/update-hukum-section.dto';

@Injectable()
export class HukumService {
  constructor(
    @InjectRepository(Hukum)
    private hukumRepo: Repository<Hukum>,
    @InjectRepository(HukumSection)
    private sectionRepo: Repository<HukumSection>,
  ) {}

  // ============ SECTION METHODS ============
  async createSection(data: CreateHukumSectionDto): Promise<HukumSection> {
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

  async findAllSection(): Promise<HukumSection[]> {
    return await this.sectionRepo.find({
      where: { isDeleted: false },
      order: { sortOrder: 'ASC', no: 'ASC' },
    });
  }

  async findSectionById(id: number): Promise<HukumSection> {
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
    data: UpdateHukumSectionDto,
  ): Promise<HukumSection> {
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

  // ============ HUKUM METHODS ============
  async findAll(): Promise<Hukum[]> {
    return await this.hukumRepo.find({
      where: { isDeleted: false },
      relations: ['section'],
      order: { year: 'DESC', quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Hukum> {
    const hukum = await this.hukumRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!hukum) {
      throw new NotFoundException(`Hukum with id ${id} not found`);
    }
    return hukum;
  }

  async remove(id: number): Promise<void> {
    const hukum = await this.findOne(id);
    hukum.isDeleted = true;
    hukum.deletedAt = new Date();
    await this.hukumRepo.save(hukum);
  }

  async findByPeriod(year: number, quarter: Quarter): Promise<Hukum[]> {
    return await this.hukumRepo.find({
      where: { year, quarter, isDeleted: false },
      relations: ['section'],
      order: { no: 'ASC', subNo: 'ASC' },
    });
  }

  async findById(id: number): Promise<Hukum> {
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
    // <-- KEMBALIKAN KE string | null
    const mode = data.mode || CalculationMode.RASIO;

    if (mode === CalculationMode.TEKS) {
      return data.hasilText || null;
    }

    const pemb = data.pembilangValue || 0;
    const peny = data.penyebutValue || 0;

    if (mode === CalculationMode.NILAI_TUNGGAL) {
      return peny !== null && peny !== undefined ? peny.toString() : null;
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

    // Default formula: pemb / peny
    if (peny === 0) {
      return null;
    }

    const result = pemb / peny;
    if (data.isPercent) {
      return (result * 100).toFixed(2);
    }
    return result.toString(); // <-- Pastikan return string
  }

  private calculateWeight(
    data: CreateHukumDto | UpdateHukumDto,
    sectionBobot: number,
  ): number {
    const indicatorBobot = data.bobotIndikator || 0;
    const peringkat = data.peringkat || 1;

    return (sectionBobot * indicatorBobot * peringkat) / 10000;
  }

  async create(data: CreateHukumDto): Promise<Hukum> {
    const section = await this.findSectionById(data.sectionId);

    // Validasi duplicate
    const existing = await this.hukumRepo.findOne({
      where: {
        year: data.year,
        quarter: data.quarter,
        sectionId: data.sectionId,
        subNo: data.subNo,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Hukum dengan subNo ${data.subNo} sudah ada untuk periode ${data.year} ${data.quarter} di section ini`,
      );
    }

    // Hitung hasil dan weighted
    const hasil = this.calculateHasil(data);
    const weighted =
      data.weighted || this.calculateWeight(data, section.bobotSection);

    const hukumData: Partial<Hukum> = {
      year: data.year,
      quarter: data.quarter,
      sectionId: data.sectionId,
      section,
      no: section.no,
      sectionLabel: section.parameter,
      bobotSection: section.bobotSection,
      subNo: data.subNo,
      indikator: data.indikator,
      bobotIndikator: data.bobotIndikator,
      sumberRisiko: data.sumberRisiko || null,
      dampak: data.dampak || null,
      low: data.low || null,
      lowToModerate: data.lowToModerate || null,
      moderate: data.moderate || null,
      moderateToHigh: data.moderateToHigh || null,
      high: data.high || null,
      mode: data.mode,
      formula: data.formula || null,
      isPercent: data.isPercent || false,
      pembilangLabel: data.pembilangLabel || null,
      pembilangValue:
        data.pembilangValue !== undefined ? data.pembilangValue : null,
      penyebutLabel: data.penyebutLabel || null,
      penyebutValue:
        data.penyebutValue !== undefined ? data.penyebutValue : null,
      hasil: hasil, // <-- Langsung string
      hasilText: data.hasilText || null,
      peringkat: data.peringkat,
      weighted: weighted,
      keterangan: data.keterangan || null,
    };

    const hukum = this.hukumRepo.create(hukumData);
    return await this.hukumRepo.save(hukum);
  }

  async update(id: number, data: UpdateHukumDto): Promise<Hukum> {
    const hukum = await this.findOne(id);

    // Jika sectionId diubah
    if (data.sectionId && data.sectionId !== hukum.sectionId) {
      const newSection = await this.findSectionById(data.sectionId);
      hukum.section = newSection;
      hukum.sectionId = newSection.id;
      hukum.sectionLabel = newSection.parameter;
      hukum.no = newSection.no;
      hukum.bobotSection = newSection.bobotSection;
    }

    // Update field yang diubah
    if (data.subNo !== undefined) hukum.subNo = data.subNo;
    if (data.indikator !== undefined) hukum.indikator = data.indikator;
    if (data.bobotIndikator !== undefined)
      hukum.bobotIndikator = data.bobotIndikator;
    if (data.mode !== undefined) hukum.mode = data.mode;
    if (data.peringkat !== undefined) hukum.peringkat = data.peringkat;
    if (data.weighted !== undefined) hukum.weighted = data.weighted;
    if (data.isPercent !== undefined) hukum.isPercent = data.isPercent;

    // Update nullable fields
    if (data.hasilText !== undefined) hukum.hasilText = data.hasilText || null;
    if (data.pembilangLabel !== undefined)
      hukum.pembilangLabel = data.pembilangLabel || null;
    if (data.pembilangValue !== undefined)
      hukum.pembilangValue = data.pembilangValue;
    if (data.penyebutLabel !== undefined)
      hukum.penyebutLabel = data.penyebutLabel || null;
    if (data.penyebutValue !== undefined)
      hukum.penyebutValue = data.penyebutValue;
    if (data.formula !== undefined) hukum.formula = data.formula || null;
    if (data.sumberRisiko !== undefined)
      hukum.sumberRisiko = data.sumberRisiko || null;
    if (data.dampak !== undefined) hukum.dampak = data.dampak || null;
    if (data.keterangan !== undefined)
      hukum.keterangan = data.keterangan || null;
    if (data.low !== undefined) hukum.low = data.low || null;
    if (data.lowToModerate !== undefined)
      hukum.lowToModerate = data.lowToModerate || null;
    if (data.moderate !== undefined) hukum.moderate = data.moderate || null;
    if (data.moderateToHigh !== undefined)
      hukum.moderateToHigh = data.moderateToHigh || null;
    if (data.high !== undefined) hukum.high = data.high || null;

    // Hitung ulang hasil jika diperlukan
    const shouldRecalculateHasil =
      data.mode !== undefined ||
      data.pembilangValue !== undefined ||
      data.penyebutValue !== undefined ||
      data.formula !== undefined ||
      data.isPercent !== undefined ||
      data.hasilText !== undefined;

    if (shouldRecalculateHasil) {
      const mode = data.mode !== undefined ? data.mode : hukum.mode;

      const calculationData = {
        mode,
        pembilangValue: hukum.pembilangValue,
        penyebutValue: hukum.penyebutValue,
        formula: hukum.formula,
        isPercent: hukum.isPercent,
        hasilText: hukum.hasilText,
      };

      const newHasil = this.calculateHasil(calculationData);
      hukum.hasil = newHasil; // <-- Langsung assign string
    }

    // Hitung ulang weighted jika diperlukan
    const shouldRecalculateWeight =
      data.bobotIndikator !== undefined ||
      data.peringkat !== undefined ||
      (data.sectionId && data.sectionId !== hukum.sectionId);

    if (shouldRecalculateWeight && !data.weighted) {
      const weightData: any = {
        bobotIndikator:
          data.bobotIndikator !== undefined
            ? data.bobotIndikator
            : hukum.bobotIndikator,
        peringkat:
          data.peringkat !== undefined ? data.peringkat : hukum.peringkat,
      };
      hukum.weighted = this.calculateWeight(weightData, hukum.bobotSection);
    }

    return await this.hukumRepo.save(hukum);
  }

  async delete(id: number): Promise<void> {
    const hukum = await this.findOne(id);
    hukum.isDeleted = true;
    hukum.deletedAt = new Date();
    await this.hukumRepo.save(hukum);
  }

  async bulkCreate(data: CreateHukumDto[]): Promise<Hukum[]> {
    const createdItems: Hukum[] = [];

    for (const item of data) {
      try {
        const created = await this.create(item);
        createdItems.push(created);
      } catch (error) {
        // Jika ada error, batalkan semua yang sudah dibuat
        for (const created of createdItems) {
          await this.hukumRepo.remove(created);
        }
        throw error;
      }
    }

    return createdItems;
  }

  async findByYear(year: number): Promise<Hukum[]> {
    return await this.hukumRepo.find({
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
  ): Promise<Hukum[]> {
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

    return await this.hukumRepo.find({
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
    const result = await this.hukumRepo.update(
      { year, quarter },
      { isDeleted: true, deletedAt: new Date() },
    );
    return result.affected || 0;
  }

  async getStructuredData(year: number, quarter: Quarter) {
    const items = await this.findByPeriod(year, quarter);

    // Group by section
    const grouped = items.reduce((acc, item) => {
      const sectionId = item.sectionId;
      if (!acc[sectionId]) {
        acc[sectionId] = {
          section: item.section,
          indicators: [],
        };
      }
      acc[sectionId].indicators.push(item);
      return acc;
    }, {});

    // Convert to array and sort by section.no
    const sectionsArray = Object.values(grouped);
    sectionsArray.sort((a: any, b: any) => {
      return a.section.no.localeCompare(b.section.no, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });

    return sectionsArray;
  }
}
