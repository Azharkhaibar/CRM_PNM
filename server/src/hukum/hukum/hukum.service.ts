// src/hukum/hukum.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateHukumDto } from './dto/create-hukum.dto';
import { UpdateHukumDto } from './dto/update-hukum.dto';
import { Like, Not, Repository } from 'typeorm';
import { Hukum, CalculationMode, Quarter } from './entities/hukum.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HukumSection } from './entities/hukum-section.entity';
import { CreateHukumSectionDto } from './dto/create-hukum-section.dto';
import { UpdateHukumSectionDto } from './dto/update-hukum-section.dto';
import { HukumModule } from './hukum.module';

@Injectable()
export class HukumService {
  constructor(
    @InjectRepository(Hukum)
    private hukumRepo: Repository<Hukum>,
    @InjectRepository(HukumSection)
    private sectionRepo: Repository<HukumSection>,
  ) {}

  // HELPER METHODS

  private validateModeSpecificFields(dto: Partial<CreateHukumDto>): void {
    const mode = dto.mode;

    if (mode === CalculationMode.RASIO) {
      if (dto.pembilangValue !== undefined && dto.pembilangValue < 0) {
        throw new BadRequestException(
          'Pembilang value tidak boleh negatif untuk mode RASIO',
        );
      }
      if (dto.penyebutValue !== undefined && dto.penyebutValue <= 0) {
        throw new BadRequestException(
          'Penyebut value harus lebih besar dari 0 untuk mode RASIO',
        );
      }
    } else if (mode === CalculationMode.NILAI_TUNGGAL) {
      if (dto.penyebutValue !== undefined && dto.penyebutValue < 0) {
        throw new BadRequestException(
          'Nilai penyebut tidak boleh negatif untuk mode NILAI_TUNGGAL',
        );
      }
    } else if (mode === CalculationMode.TEKS) {
      // Untuk mode TEKS, hasil harus berupa text
      if (!dto.hasilText && !dto.hasilText?.trim()) {
        throw new BadRequestException('Hasil text wajib diisi untuk mode TEKS');
      }
    }
  }

  private calculateWeighted(
    bobotSection: number,
    bobotIndikator: number,
    peringkat: number,
  ): number {
    // Formula: (bobotSection * bobotIndikator * peringkat) / 10000
    return (bobotSection * bobotIndikator * peringkat) / 10000;
  }

  async duplicateIndikatorToNewPeriod(
    sourceId: number,
    targetYear: number,
    targetQuarter: Quarter,
    createdBy?: string,
  ): Promise<Hukum> {
    const source = await this.findIndikatorById(sourceId);

    // Cek apakah sudah ada di periode target
    const existing = await this.hukumRepo.findOne({
      where: {
        year: targetYear,
        quarter: targetQuarter,
        sectionId: source.sectionId,
        subNo: source.subNo,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Indikator dengan subNo "${source.subNo}" sudah ada pada periode ${targetYear}-${targetQuarter}`,
      );
    }

    // Duplikasi dengan periode baru
    const newIndikatorData: Partial<Hukum> = {
      ...source,
      id: undefined,
      year: targetYear,
      quarter: targetQuarter,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      revisionNotes: `Duplikasi dari periode ${source.year}-${source.quarter}`,
      isDeleted: false,
    };

    if (createdBy) {
      newIndikatorData.createdBy = createdBy;
    }

    const newIndikator = this.hukumRepo.create(newIndikatorData);
    return await this.hukumRepo.save(newIndikator);
  }

  // ============ SECTION METHODS ============
  async createSection(
    createDto: CreateHukumSectionDto,
    createdBy?: string,
  ): Promise<HukumSection> {
    // cek untuk data apakah sudh di hapus
    const deletedSection = await this.sectionRepo.findOne({
      where: {
        no: createDto.no,
        parameter: createDto.parameter,
        year: createDto.year,
        quarter: createDto.quarter,
        isDeleted: true,
      },
    });

    if (deletedSection) {
      console.log(
        ` reactiving deleted section: ${deletedSection.no} - ${deletedSection.parameter}`,
      );
      deletedSection.isDeleted = false;
      deletedSection.isActive = createDto.isActive ?? true;
      deletedSection.description =
        createDto.description || deletedSection.description;
      deletedSection.sortOrder =
        createDto.sortOrder || deletedSection.sortOrder;

      if (createdBy) {
        deletedSection['updatedBy'] = createdBy;
        deletedSection['updatedAt'] = new Date();
      }

      return await this.sectionRepo.save(deletedSection);
    }

    const existingSection = await this.sectionRepo.findOne({
      where: {
        no: createDto.no,
        parameter: createDto.parameter,
        year: createDto.year,
        quarter: createDto.quarter,
        isDeleted: false,
      },
    });

    if (existingSection) {
      throw new ConflictException(
        `Section dengan nomor "${createDto.no}" dan nama "${createDto.parameter}" sudah ada pada periode ${createDto.year}-${createDto.quarter}`,
      );
    }

    const sectionData: Partial<HukumSection> = {
      no: createDto.no,
      parameter: createDto.parameter,
      bobotSection: createDto.bobotSection,
      description: createDto.description,
      sortOrder: createDto.sortOrder,
      year: createDto.year,
      quarter: createDto.quarter,
      isActive: createDto.isActive,
      isDeleted: false,
    };

    if (createdBy) {
      sectionData['createdBy'] = createdBy;
    }

    const section = this.sectionRepo.create(sectionData);
    return await this.sectionRepo.save(section);

    // if (existing) {
    //   // Jika data sudah ada dan aktif, throw error biasa
    //   if (!existing.isDeleted) {
    //     throw new BadRequestException(
    //       `Section dengan nomor "${data.no}" sudah ada`,
    //     );
    //   }

    //   // Jika data sudah di-delete, kita RESTORE dengan data baru
    //   existing.isDeleted = false;
    //   Object.assign(existing, data);
    //   return await this.sectionRepo.save(existing);
    // }

    // Jika tidak ada data dengan no yang sama, buat baru
  }

  async findAllSections(isActive?: boolean): Promise<HukumSection[]> {
    const where: any = { isDeleted: false }; // Hanya ambil yang tidak dihapus

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return await this.sectionRepo.find({
      where,
      order: { year: 'DESC', quarter: 'DESC', sortOrder: 'ASC', no: 'ASC' },
    });
  }

  async findSectionById(id: number): Promise<HukumSection> {
    try {
      console.log(`service finding by id: ${id}`);

      const section = await this.sectionRepo
        .createQueryBuilder('section')
        .where('section.id = :id', { id })
        .andWhere('section.is_deleted = false')
        .getOne();

      if (!section) {
        throw new NotFoundException(`section dengan ID ${id} tidak ditemukan`);
      }

      return section;
    } catch (error) {
      console.error(`error in find sectionByID service`, error);
      throw error;
    }
  }

  async findSectionsByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<HukumSection[]> {
    return await this.sectionRepo.find({
      where: {
        year,
        quarter,
        isDeleted: false, // Hanya ambil yang tidak dihapus
        isActive: true,
      },
      order: { sortOrder: 'ASC', no: 'ASC' },
    });
  }

  async updateSection(
    id: number,
    updateDto: UpdateHukumSectionDto,
    updatedBy?: string,
  ): Promise<HukumSection> {
    const section = await this.findSectionById(id);

    // Jika ada perubahan no/parameter/year/quarter, cek duplikasi
    const checkNo = updateDto.no || section.no;
    const checkParam = updateDto.parameter || section.parameter;
    const checkYear = updateDto.year || section.year;
    const checkQuarter = updateDto.quarter || section.quarter;

    // Cek apakah ada section lain dengan no+parameter+year+quarter yang sama
    const existing = await this.sectionRepo.findOne({
      where: {
        no: checkNo,
        parameter: checkParam,
        year: checkYear,
        quarter: checkQuarter,
        isDeleted: false,
        id: Not(id), // Exclude current section
      },
    });

    if (existing) {
      throw new ConflictException(
        `Section dengan nomor "${checkNo}" dan nama "${checkParam}" sudah ada pada periode ${checkYear}-${checkQuarter}`,
      );
    }

    // Update field
    if (updateDto.no !== undefined) section.no = updateDto.no;
    if (updateDto.parameter !== undefined)
      section.parameter = updateDto.parameter;
    if (updateDto.bobotSection !== undefined)
      section.bobotSection = updateDto.bobotSection;
    if (updateDto.description !== undefined)
      section.description = updateDto.description;
    if (updateDto.sortOrder !== undefined)
      section.sortOrder = updateDto.sortOrder;
    if (updateDto.isActive !== undefined) section.isActive = updateDto.isActive;
    if (updateDto.year !== undefined) section.year = updateDto.year;
    if (updateDto.quarter !== undefined) section.quarter = updateDto.quarter;

    if (updatedBy) {
      // Jika ada updatedBy field di entity
      section['updatedBy'] = updatedBy;
    }

    return await this.sectionRepo.save(section);
  }

  async deleteSection(id: number): Promise<void> {
    const section = await this.sectionRepo.findOne({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
    }

    const indikatorCount = await this.hukumRepo.count({
      where: { sectionId: id },
    });

    if (indikatorCount > 0) {
      throw new ConflictException(
        `Section tidak dapat dihapus karena masih digunakan oleh ${indikatorCount} indikator`,
      );
    }

    await this.sectionRepo.delete(id);
  }

  // ============ HUKUM METHODS (HUKUM INDIKATORS) SERVICES ============
  // async findAll(): Promise<Hukum[]> {
  //   return await this.hukumRepo.find({
  //     where: { isDeleted: false },
  //     relations: ['section'],
  //     order: { year: 'DESC', quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
  //   });
  // }

  // async findOne(id: number): Promise<Hukum> {
  //   const hukum = await this.hukumRepo.findOne({
  //     where: { id, isDeleted: false },
  //     relations: ['section'],
  //   });

  //   if (!hukum) {
  //     throw new NotFoundException(`Hukum with id ${id} not found`);
  //   }
  //   return hukum;
  // }

  // async remove(id: number): Promise<void> {
  //   const hukum = await this.findOne(id);
  //   hukum.isDeleted = true;
  //   hukum.deletedAt = new Date();
  //   await this.hukumRepo.save(hukum);
  // }

  // async findByPeriod(year: number, quarter: Quarter): Promise<Hukum[]> {
  //   return await this.hukumRepo.find({
  //     where: { year, quarter, isDeleted: false },
  //     relations: ['section'],
  //     order: { no: 'ASC', subNo: 'ASC' },
  //   });
  // }

  // async findById(id: number): Promise<Hukum> {
  //   return this.findOne(id);
  // }

  async findIndikatorsByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<Hukum[]> {
    return await this.hukumRepo.find({
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

  async findAllIndikators(): Promise<Hukum[]> {
    return await this.hukumRepo.find({
      where: { isDeleted: false },
      relations: ['section'],
      order: {
        year: 'DESC',
        quarter: 'DESC',
        no: 'ASC',
        subNo: 'ASC',
      },
    });
  }

  async findIndikatorById(id: number): Promise<Hukum> {
    const indikator = await this.hukumRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
      
    });

    if (!indikator) {
      throw new NotFoundException(`indikator id ${id} ga ada`);
    }

    return indikator;
  }

  async findByYear(year: number): Promise<Hukum[]> {
    return await this.hukumRepo.find({
      where: { year, isDeleted: false },
      relations: ['section'],
      order: { quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
    });
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

  // CREATE INDIKATORS HUKUM

  async createIndikator(
    createDto: CreateHukumDto,
    createdBy?: string,
  ): Promise<Hukum> {
    // 1. Validasi section exist
    const section = await this.findSectionById(createDto.sectionId);

    // 2. Cek apakah ada indikator yang sudah dihapus dengan data yang sama
    const deletedIndikator = await this.hukumRepo.findOne({
      where: {
        year: createDto.year,
        quarter: createDto.quarter,
        sectionId: createDto.sectionId,
        subNo: createDto.subNo,
        isDeleted: true, // Hanya cek yang sudah dihapus
      },
    });

    // 3. Jika ada data yang sudah dihapus, REACTIVATE
    if (deletedIndikator) {
      console.log(
        `🔄 Reactivating deleted indicator: ${deletedIndikator.subNo} - ${deletedIndikator.indikator}`,
      );

      // Update data dengan nilai baru
      deletedIndikator.isDeleted = false;
      deletedIndikator.indikator = createDto.indikator;
      deletedIndikator.bobotIndikator = createDto.bobotIndikator;
      deletedIndikator.sumberRisiko = createDto.sumberRisiko || null;
      deletedIndikator.dampak = createDto.dampak || null;
      deletedIndikator.mode = createDto.mode;
      deletedIndikator.formula = createDto.formula || null;
      deletedIndikator.isPercent = createDto.isPercent || false;
      deletedIndikator.pembilangLabel = createDto.pembilangLabel || null;
      deletedIndikator.pembilangValue = createDto.pembilangValue || null;
      deletedIndikator.penyebutLabel = createDto.penyebutLabel || null;
      deletedIndikator.penyebutValue = createDto.penyebutValue || null;
      deletedIndikator.hasil = createDto.hasil || null;
      deletedIndikator.hasilText = createDto.hasilText || null;
      deletedIndikator.peringkat = createDto.peringkat;

      // Hitung weighted baru
      deletedIndikator.weighted =
        createDto.weighted ||
        this.calculateWeighted(
          section.bobotSection,
          createDto.bobotIndikator,
          createDto.peringkat,
        );

      deletedIndikator.keterangan = createDto.keterangan || null;
      deletedIndikator.version += 1;

      if (createdBy) {
        deletedIndikator.updatedBy = createdBy;
      }

      return await this.hukumRepo.save(deletedIndikator);
    }

    // 4. Cek duplikasi hanya untuk data yang TIDAK dihapus
    const existingIndikator = await this.hukumRepo.findOne({
      where: {
        year: createDto.year,
        quarter: createDto.quarter,
        sectionId: createDto.sectionId,
        subNo: createDto.subNo,
        isDeleted: false, // Hanya cek yang tidak dihapus
      },
    });

    if (existingIndikator) {
      throw new ConflictException(
        `Indikator dengan subNo "${createDto.subNo}" sudah ada pada periode ${createDto.year}-${createDto.quarter} di section ini`,
      );
    }

    // 5. Validasi mode-specific fields
    this.validateModeSpecificFields(createDto);

    // 6. Hitung weighted jika belum diisi
    const weighted =
      createDto.weighted ||
      this.calculateWeighted(
        section.bobotSection,
        createDto.bobotIndikator,
        createDto.peringkat,
      );

    // 7. Handle nullable fields
    const strategikData: Partial<Hukum> = {
      year: createDto.year,
      quarter: createDto.quarter,
      sectionId: createDto.sectionId,
      no: section.no,
      sectionLabel: section.parameter,
      bobotSection: section.bobotSection,
      subNo: createDto.subNo,
      indikator: createDto.indikator,
      bobotIndikator: createDto.bobotIndikator,
      sumberRisiko: createDto.sumberRisiko || null,
      dampak: createDto.dampak || null,
      low: createDto.low || null,
      lowToModerate: createDto.lowToModerate || null,
      moderate: createDto.moderate || null,
      moderateToHigh: createDto.moderateToHigh || null,
      high: createDto.high || null,
      mode: createDto.mode,
      formula: createDto.formula || null,
      isPercent: createDto.isPercent || false,
      pembilangLabel: createDto.pembilangLabel || null,
      pembilangValue: createDto.pembilangValue || null,
      penyebutLabel: createDto.penyebutLabel || null,
      penyebutValue: createDto.penyebutValue || null,
      hasil: createDto.hasil || null,
      hasilText: createDto.hasilText || null,
      peringkat: createDto.peringkat,
      weighted: weighted,
      keterangan: createDto.keterangan || null,
      isValidated: false,
      version: 1,
      isDeleted: false,
    };

    if (createdBy) {
      strategikData.createdBy = createdBy;
    }

    const strategik = this.hukumRepo.create(strategikData);
    return await this.hukumRepo.save(strategik);
  }

  async updateIndikator(
    id: number,
    updateDto: UpdateHukumDto,
    updatedBy?: string,
  ): Promise<Hukum> {
    const indikator = await this.findIndikatorById(id);

    // 1. Validasi jika ada perubahan sectionId
    if (updateDto.sectionId && updateDto.sectionId !== indikator.sectionId) {
      const newSection = await this.findSectionById(updateDto.sectionId);

      // Update data section yang denormalized
      updateDto.no = newSection.no;
      updateDto.sectionLabel = newSection.parameter;
      updateDto.bobotSection = newSection.bobotSection;
    }

    // 2. Validasi jika ada perubahan periode atau subNo
    if (
      (updateDto.year && updateDto.year !== indikator.year) ||
      (updateDto.quarter && updateDto.quarter !== indikator.quarter) ||
      (updateDto.subNo && updateDto.subNo !== indikator.subNo)
    ) {
      const year = updateDto.year || indikator.year;
      const quarter = updateDto.quarter || indikator.quarter;
      const sectionId = updateDto.sectionId || indikator.sectionId;
      const subNo = updateDto.subNo || indikator.subNo;

      const existing = await this.hukumRepo.findOne({
        where: {
          year,
          quarter,
          sectionId,
          subNo,
          isDeleted: false,
          id: Not(id), // Exclude current
        },
      });

      if (existing) {
        throw new ConflictException(
          `Indikator dengan subNo "${subNo}" sudah ada pada periode ${year}-${quarter} di section ini`,
        );
      }
    }

    // 3. Validasi mode-specific fields
    if (updateDto.mode) {
      const validationDto: Partial<CreateHukumDto> = {
        mode: updateDto.mode,
        pembilangValue: updateDto.pembilangValue,
        penyebutValue: updateDto.penyebutValue,
        hasilText: updateDto.hasilText,
      };
      this.validateModeSpecificFields(validationDto);
    }

    // 4. Hitung weighted baru jika ada perubahan bobot/peringkat
    if (
      updateDto.bobotSection ||
      updateDto.bobotIndikator ||
      updateDto.peringkat
    ) {
      const bobotSection = updateDto.bobotSection || indikator.bobotSection;
      const bobotIndikator =
        updateDto.bobotIndikator || indikator.bobotIndikator;
      const peringkat = updateDto.peringkat || indikator.peringkat;

      updateDto.weighted = this.calculateWeighted(
        bobotSection,
        bobotIndikator,
        peringkat,
      );
    }

    // 5. Update field yang ada di updateDto
    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        indikator[key] = updateDto[key];
      }
    });

    if (updatedBy) {
      indikator.updatedBy = updatedBy;
      indikator.version += 1;
    }

    return await this.hukumRepo.save(indikator);
  }

  async deleteIndikator(id: number): Promise<void> {
    const indikator = await this.hukumRepo.findOne({
      where: { id },
    });

    if (!indikator) {
      throw new NotFoundException(`indikator id ${id} ga ada`);
    }

    indikator.isDeleted = true;
    await this.hukumRepo.delete(id);
  }

  async searchIndikators(
    query?: string,
    year?: number,
    quarter?: Quarter,
  ): Promise<Hukum[]> {
    const where: any = { isDeleted: false };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (year) where.year = year;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (quarter) where.quarter = quarter;

    if (query) {
      const searchConditions = [
        { subNo: Like(`%${query}%`), ...where },
        { indikator: Like(`%${query}%`), ...where },
        { sumberRisiko: Like(`%${query}%`), ...where },
        { dampak: Like(`%${query}%`), ...where },
        { keterangan: Like(`%${query}%`), ...where },
        { hasilText: Like(`%${query}%`), ...where },
      ];

      return await this.hukumRepo.find({
        where: searchConditions,
        relations: ['section'],
      });
    }

    return await this.hukumRepo.find({
      where,
      relations: ['section'],
    });
  }

  // async bulkCreate(data: CreateHukumDto[]): Promise<Hukum[]> {
  //   const createdItems: Hukum[] = [];

  //   for (const item of data) {
  //     try {
  //       const created = await this.create(item);
  //       createdItems.push(created);
  //     } catch (error) {
  //       // Jika ada error, batalkan semua yang sudah dibuat
  //       for (const created of createdItems) {
  //         await this.hukumRepo.remove(created);
  //       }
  //       throw error;
  //     }
  //   }

  //   return createdItems;
  // }

  async getTotalWeightedByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<number> {
    const result = await this.hukumRepo
      .createQueryBuilder('hukum')
      .select('SUM(hukum.weighted)', 'total')
      .where('hukum.year = :year', { year })
      .andWhere('hukum.quarter = :quarter', { quarter })
      .andWhere('hukum.is_deleted = false')
      .getRawOne();

    return parseFloat(result?.total || 0) || 0;
  }

  async getIndikatorCountByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<number> {
    try {
      const result = await this.hukumRepo
        .createQueryBuilder('hukum')
        .select('COUNT(hukum.id)', 'count')
        .where('hukum.year = :year', { year })
        .andWhere('hukum.quarter = :quarter', { quarter })
        .andWhere('hukum.is_deleted = false')
        .getRawOne();

      return parseInt(result?.count || 0) || 0;
    } catch (error) {
      console.error('Error in getIndikatorCountByPeriod:', error);
      return 0;
    }
  }

  // async findBySection(
  //   sectionId: number,
  //   year?: number,
  //   quarter?: Quarter,
  // ): Promise<Hukum[]> {
  //   const where: any = {
  //     sectionId,
  //     isDeleted: false,
  //   };

  //   if (year !== undefined) {
  //     where.year = year;
  //   }

  //   if (quarter !== undefined) {
  //     where.quarter = quarter;
  //   }

  //   return await this.hukumRepo.find({
  //     where,
  //     relations: ['section'],
  //     order: {
  //       year: 'DESC',
  //       quarter: 'ASC',
  //       subNo: 'ASC',
  //     },
  //   });
  // }

  async getSectionsWithIndicatorsByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<any> {
    try {
      console.log(
        `Loading sections with indicators for period: ${year}-${quarter}`,
      );

      // 1. Ambil sections untuk periode ini saja
      const sections = await this.sectionRepo.find({
        where: {
          year,
          quarter,
          isDeleted: false,
          isActive: true,
        },
        order: { sortOrder: 'ASC', no: 'ASC' },
      });

      console.log(
        `Total sections for period ${year}-${quarter}: ${sections.length}`,
      );

      const sectionsWithIndicators = await Promise.all(
        sections.map(async (section) => {
          const indicators = await this.hukumRepo.find({
            where: {
              sectionId: section.id,
              year,
              quarter,
              isDeleted: false,
            },
            order: { subNo: 'ASC' },
          });

          console.log(`Section ${section.no}: ${indicators.length} indicators`);

          const totalWeighted = indicators.reduce(
            (sum, indicator) => sum + (Number(indicator.weighted) || 0),
            0,
          );

          return {
            id: section.id,
            no: section.no,
            parameter: section.parameter,
            bobotSection: section.bobotSection,
            description: section.description,
            year: section.year,
            quarter: section.quarter,
            isActive: section.isActive,
            indicators: indicators.map((indicator) => ({
              id: indicator.id,
              subNo: indicator.subNo,
              indikator: indicator.indikator,
              bobotIndikator: indicator.bobotIndikator,
              mode: indicator.mode,
              hasil: indicator.hasil,
              hasilText: indicator.hasilText,
              peringkat: indicator.peringkat,
              weighted: indicator.weighted,
              sumberRisiko: indicator.sumberRisiko,
              dampak: indicator.dampak,
              keterangan: indicator.keterangan,
              isValidated: indicator.isValidated,
              pembilangLabel: indicator.pembilangLabel,
              pembilangValue: indicator.pembilangValue,
              penyebutLabel: indicator.penyebutLabel,
              penyebutValue: indicator.penyebutValue,
              formula: indicator.formula,
              isPercent: indicator.isPercent,
              low: indicator.low,
              lowToModerate: indicator.lowToModerate,
              moderate: indicator.moderate,
              moderateToHigh: indicator.moderateToHigh,
              high: indicator.high,
            })),
            totalWeighted,
            indicatorCount: indicators.length,
            hasIndicators: indicators.length > 0,
          };
        }),
      );

      // Filter hanya sections yang punya indikator
      const sectionsWithData = sectionsWithIndicators.filter(
        (s) => s.indicators.length > 0,
      );

      const overallTotalWeighted = sectionsWithData.reduce(
        (sum, section) => sum + (section.totalWeighted || 0),
        0,
      );

      return {
        success: true,
        year,
        quarter,
        sections: sectionsWithIndicators,
        sectionsWithIndicators: sectionsWithData,
        overallTotalWeighted,
        sectionCount: sectionsWithIndicators.length,
        totalIndicators: sectionsWithData.reduce(
          (sum, section) => sum + section.indicatorCount,
          0,
        ),
      };
    } catch (error) {
      console.error('Error in getSectionsWithIndicatorsByPeriod:', error);
      throw error;
    }
  }

  async deleteByPeriod(year: number, quarter: Quarter): Promise<number> {
    const result = await this.hukumRepo.update(
      { year, quarter },
      { isDeleted: true, deletedAt: new Date() },
    );
    return result.affected || 0;
  }

  async getPeriods(): Promise<Array<{ year: number; quarter: Quarter }>> {
    const periods = await this.hukumRepo
      .createQueryBuilder('hukum')
      .select(['hukum.year', 'hukum.quarter'])
      .where('hukum.is_deleted = false')
      .groupBy('hukum.year, hukum.quarter')
      .orderBy('hukum.year', 'DESC')
      .addOrderBy('hukum.quarter', 'DESC')
      .getRawMany();

    return periods.map((p) => ({
      year: p.hukum_year,
      quarter: p.hukum_quarter,
    }));
  }
}
