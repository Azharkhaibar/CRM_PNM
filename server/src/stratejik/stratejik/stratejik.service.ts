// stratejik.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateStratejikDto } from './dto/create-stratejik.dto';
import { UpdateStratejikDto } from './dto/update-stratejik.dto';
import { Repository } from 'typeorm';
import {
  Stratejik,
  CalculationMode,
  Quarter,
} from './entities/stratejik.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StratejikSection } from './entities/stratejik-section.entity';
import { CreateStratejikSectionDto } from './dto/create-stratejik-section.dto';
import { UpdateStratejikSectionDto } from './dto/update-stratejik-section.dto';

@Injectable()
export class StratejikService {
  constructor(
    @InjectRepository(Stratejik)
    private stratejikRepo: Repository<Stratejik>,
    @InjectRepository(StratejikSection)
    private sectionRepo: Repository<StratejikSection>,
  ) {}

  // ============ SECTION METHODS ============
  async createSection(
    data: CreateStratejikSectionDto,
  ): Promise<StratejikSection> {
    // Cek dengan withDeleted: true untuk melihat semua data
    const existing = await this.sectionRepo.findOne({
      where: { no: data.no },
      withDeleted: true, // INCLUDE SOFT DELETED DATA
    });

    if (existing) {
      // Jika data sudah ada dan aktif, throw error biasa
      if (!existing.isDeleted) {
        throw new BadRequestException(
          `Section dengan nomor "${data.no}" sudah ada`,
        );
      }

      // Jika data sudah di-delete, kita RESTORE dengan data baru
      // Ini adalah pendekatan yang user-friendly
      existing.isDeleted = false;
      Object.assign(existing, data);
      return await this.sectionRepo.save(existing);
    }

    // Jika tidak ada data dengan no yang sama, buat baru
    const section = this.sectionRepo.create(data);
    return await this.sectionRepo.save(section);
  }

  async findAllSection(): Promise<StratejikSection[]> {
    return await this.sectionRepo.find({
      where: { isDeleted: false },
      order: { no: 'ASC' },
    });
  }

  async findSectionById(id: number): Promise<StratejikSection> {
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
    data: UpdateStratejikSectionDto,
  ): Promise<StratejikSection> {
    const section = await this.findSectionById(id);

    // Jika nomor diubah
    if (data.no !== undefined && data.no !== section.no) {
      // Cek dengan withDeleted: true
      const existing = await this.sectionRepo.findOne({
        where: { no: data.no },
        withDeleted: true, // INCLUDE SOFT DELETED DATA
      });

      // Jika ada data dengan nomor yang baru
      if (existing) {
        // Jika data aktif (dan bukan data yang sama), throw error
        if (!existing.isDeleted && existing.id !== id) {
          throw new BadRequestException(
            `Section dengan nomor "${data.no}" sudah ada`,
          );
        }

        // Jika data sudah di-delete, kita bisa:
        // 1. Hard delete untuk memberi jalan (recommended)
        // 2. Atau skip dan throw error khusus
        if (existing.isDeleted) {
          // Hard delete data yang sudah di-soft delete
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

  // ============ STRATEJIK METHODS ============
  async findAll(): Promise<Stratejik[]> {
    return await this.stratejikRepo.find({
      where: { isDeleted: false },
      relations: ['section'],
      select: [
        'id',
        'year',
        'quarter',
        'no',
        'subNo',
        'indikator',
        'bobotSection',
        'bobotIndikator',
        'hasil',
        'peringkat',
        'weighted',
        'mode',
        'sectionLabel',
      ],
      order: { year: 'DESC', quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Stratejik> {
    const stratejik = await this.stratejikRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!stratejik) {
      throw new NotFoundException(`Stratejik with id ${id} not found`);
    }
    return stratejik;
  }

  async remove(id: number): Promise<void> {
    const stratejik = await this.findOne(id);
    stratejik.isDeleted = true;
    stratejik.deletedAt = new Date();
    await this.stratejikRepo.save(stratejik);
  }

  async findByPeriod(year: number, quarter: Quarter): Promise<Stratejik[]> {
    return await this.stratejikRepo.find({
      where: { year, quarter, isDeleted: false },
      relations: ['section'],
      order: { no: 'ASC', subNo: 'ASC' },
    });
  }

  async findById(id: number): Promise<Stratejik> {
    return this.findOne(id);
  }

  private calculateHasil(data: {
    mode?: CalculationMode; // Ubah menjadi optional
    pembilangValue?: number | null;
    penyebutValue?: number | null;
    formula?: string | null;
    isPercent?: boolean;
    hasilText?: string | null;
  }): string | null {
    // Pastikan mode punya nilai default jika undefined
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

        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const fn = new Function('pemb', 'peny', `return (${expr});`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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
    return result.toString();
  }
  private calculateWeight(
    data: CreateStratejikDto | UpdateStratejikDto,
  ): number {
    const sectionBobot = data.bobotSection || 0;
    const indicatorBobot = data.bobotIndikator || 0;
    const peringkat = data.peringkat || 1;

    return (sectionBobot * indicatorBobot * peringkat) / 10000;
  }

  async create(data: CreateStratejikDto): Promise<Stratejik> {
    const section = await this.findSectionById(data.sectionId);

    // Validasi duplicate
    const existing = await this.stratejikRepo.findOne({
      where: {
        year: data.year,
        quarter: data.quarter,
        subNo: data.subNo,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Stratejik with subNo ${data.subNo} already exists for ${data.year} ${data.quarter}`,
      );
    }

    // Hitung hasil dan weighted
    const hasil = this.calculateHasil(data);
    const weighted = data.weighted || this.calculateWeight(data);

    const stratejikData: Partial<Stratejik> = {
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

    const stratejik = this.stratejikRepo.create(stratejikData);
    return await this.stratejikRepo.save(stratejik);
  }

  async update(id: number, data: UpdateStratejikDto): Promise<Stratejik> {
    const stratejik = await this.findOne(id);

    // Jika sectionId diubah, validasi section baru
    if (data.sectionId && data.sectionId !== stratejik.sectionId) {
      const newSection = await this.findSectionById(data.sectionId);
      stratejik.section = newSection;
      stratejik.sectionId = newSection.id;
      stratejik.sectionLabel = newSection.parameter;
    }

    // Update field yang diubah
    if (data.no !== undefined) stratejik.no = data.no;
    if (data.sectionLabel !== undefined)
      stratejik.sectionLabel = data.sectionLabel;
    if (data.bobotSection !== undefined)
      stratejik.bobotSection = data.bobotSection;
    if (data.subNo !== undefined) stratejik.subNo = data.subNo;
    if (data.indikator !== undefined) stratejik.indikator = data.indikator;
    if (data.bobotIndikator !== undefined)
      stratejik.bobotIndikator = data.bobotIndikator;
    if (data.mode !== undefined) stratejik.mode = data.mode;
    if (data.peringkat !== undefined) stratejik.peringkat = data.peringkat;
    if (data.weighted !== undefined) stratejik.weighted = data.weighted;
    if (data.isPercent !== undefined) stratejik.isPercent = data.isPercent;

    // Update nullable string fields
    if (data.hasilText !== undefined)
      stratejik.hasilText = data.hasilText || null;
    if (data.pembilangLabel !== undefined)
      stratejik.pembilangLabel = data.pembilangLabel || null;
    if (data.pembilangValue !== undefined)
      stratejik.pembilangValue = data.pembilangValue;
    if (data.penyebutLabel !== undefined)
      stratejik.penyebutLabel = data.penyebutLabel || null;
    if (data.penyebutValue !== undefined)
      stratejik.penyebutValue = data.penyebutValue;
    if (data.formula !== undefined) stratejik.formula = data.formula || null;
    if (data.sumberRisiko !== undefined)
      stratejik.sumberRisiko = data.sumberRisiko || null;
    if (data.dampak !== undefined) stratejik.dampak = data.dampak || null;
    if (data.keterangan !== undefined)
      stratejik.keterangan = data.keterangan || null;
    if (data.low !== undefined) stratejik.low = data.low || null;
    if (data.lowToModerate !== undefined)
      stratejik.lowToModerate = data.lowToModerate || null;
    if (data.moderate !== undefined) stratejik.moderate = data.moderate || null;
    if (data.moderateToHigh !== undefined)
      stratejik.moderateToHigh = data.moderateToHigh || null;
    if (data.high !== undefined) stratejik.high = data.high || null;

    // Hitung ulang hasil jika diperlukan
    const shouldRecalculateHasil =
      data.mode !== undefined ||
      data.pembilangValue !== undefined ||
      data.penyebutValue !== undefined ||
      data.formula !== undefined ||
      data.isPercent !== undefined;

    if (shouldRecalculateHasil) {
      // Pastikan mode tidak undefined
      const mode = data.mode !== undefined ? data.mode : stratejik.mode;

      const calculationData = {
        mode,
        pembilangValue: stratejik.pembilangValue,
        penyebutValue: stratejik.penyebutValue,
        formula: stratejik.formula,
        isPercent: stratejik.isPercent,
        hasilText: stratejik.hasilText,
      };
      stratejik.hasil = this.calculateHasil(calculationData);
    }

    // Hitung ulang weighted jika diperlukan
    const shouldRecalculateWeight =
      data.bobotSection !== undefined ||
      data.bobotIndikator !== undefined ||
      data.peringkat !== undefined;

    if (shouldRecalculateWeight && !data.weighted) {
      const weightData: any = {
        bobotSection: stratejik.bobotSection,
        bobotIndikator: stratejik.bobotIndikator,
        peringkat: stratejik.peringkat,
      };
      stratejik.weighted = this.calculateWeight(weightData);
    }

    return await this.stratejikRepo.save(stratejik);
  }

  async delete(id: number): Promise<void> {
    const stratejik = await this.findOne(id);
    stratejik.isDeleted = true;
    stratejik.deletedAt = new Date();
    await this.stratejikRepo.save(stratejik);
  }

  async bulkCreate(data: CreateStratejikDto[]): Promise<Stratejik[]> {
    // Validasi jumlah data
    if (!data || data.length === 0) {
      throw new BadRequestException('Data array tidak boleh kosong');
    }

    if (data.length > 100) {
      throw new BadRequestException('Maksimal 100 data per request');
    }

    const createdItems: Stratejik[] = [];

    // Gunakan transaction untuk atomic operation
    const queryRunner =
      this.stratejikRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of data) {
        const created = await this.create(item);
        createdItems.push(created);
      }

      await queryRunner.commitTransaction();
      return createdItems;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Gagal membuat data: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findByYear(year: number): Promise<Stratejik[]> {
    return await this.stratejikRepo.find({
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
  ): Promise<Stratejik[]> {
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

    return await this.stratejikRepo.find({
      where,
      relations: ['section'],
      order: {
        year: 'DESC',
        quarter: 'ASC',
        subNo: 'ASC',
      },
    });
  }
}
