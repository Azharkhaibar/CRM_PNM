// src/features/Dashboard/pages/RiskProfile/pages/Strategik/services/strategik.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikuiditasSection } from './entities/section-likuiditas.entity';
import { Repository, In, Like, Not } from 'typeorm';
// import { CalculationMode, Likuiditas, Quarter } from './entities/likuiditas.entity';
import {
  CalculationMode,
  Likuiditas,
  Quarter,
} from './entities/likuiditas.entity';
import { CreateLikuiditasSectionDto } from './dto/create-likuiditas-section.dto';
import { UpdateLikuiditasSectionDto } from './dto/update-likuiditas-section.dto';
import { CreateLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateLikuiditasDto } from './dto/update-likuiditas.dto';
// import { StrategikSection } from './entities/stratejik-section.entity';
// import {
//   Strategik,
//   CalculationMode,
//   Quarter,
// } from './entities/stratejik.entity';
// import { CreateStrategikSectionDto } from './dto/create-stratejik-section.dto';
// import { UpdateStrategikSectionDto } from './dto/update-stratejik-section.dto';
// import { CreateStrategikDto } from './dto/create-stratejik.dto';
// import { UpdateStrategikDto } from './dto/update-stratejik.dto';

@Injectable()
export class LikuiditasService {
  constructor(
    @InjectRepository(LikuiditasSection)
    private readonly likuiditasSectionRepository: Repository<LikuiditasSection>,

    @InjectRepository(Likuiditas)
    private readonly likuiditasRepository: Repository<Likuiditas>,
  ) {}

  // ========== SECTION SERVICES ==========

  async createSection(
    createDto: CreateLikuiditasSectionDto,
    createdBy?: string,
  ): Promise<LikuiditasSection> {
    // 1. Cek apakah ada data yang sudah dihapus dengan no+parameter+year+quarter yang sama
    const deletedSection = await this.likuiditasSectionRepository.findOne({
      where: {
        no: createDto.no,
        parameter: createDto.parameter,
        year: createDto.year,
        quarter: createDto.quarter,
        isDeleted: true, // Hanya cek yang sudah dihapus
      },
    });

    // 2. Jika ada data yang sudah dihapus, REACTIVATE data tersebut
    if (deletedSection) {
      console.log(
        `🔄 Reactivating deleted section: ${deletedSection.no} - ${deletedSection.parameter}`,
      );

      // Reactivate section yang sudah dihapus
      deletedSection.isDeleted = false;
      deletedSection.isActive = createDto.isActive ?? true;
      deletedSection.bobotSection =
        createDto.bobotSection || deletedSection.bobotSection;
      deletedSection.description =
        createDto.description || deletedSection.description;
      deletedSection.sortOrder =
        createDto.sortOrder || deletedSection.sortOrder;

      if (createdBy) {
        deletedSection['updatedBy'] = createdBy;
        deletedSection['updatedAt'] = new Date();
      }

      return await this.likuiditasSectionRepository.save(deletedSection);
    }

    // 3. Cek duplikasi hanya untuk data yang TIDAK dihapus
    const existingSection = await this.likuiditasSectionRepository.findOne({
      where: {
        no: createDto.no,
        parameter: createDto.parameter,
        year: createDto.year,
        quarter: createDto.quarter,
        isDeleted: false, // Hanya cek yang tidak dihapus
      },
    });

    if (existingSection) {
      throw new ConflictException(
        `Section dengan nomor "${createDto.no}" dan nama "${createDto.parameter}" sudah ada pada periode ${createDto.year}-${createDto.quarter}`,
      );
    }

    // 4. Jika tidak ada data sama sekali, buat baru
    const sectionData: Partial<LikuiditasSection> = {
      no: createDto.no,
      parameter: createDto.parameter,
      bobotSection: createDto.bobotSection || 100,
      description: createDto.description || null,
      sortOrder: createDto.sortOrder || 0,
      year: createDto.year,
      quarter: createDto.quarter,
      isActive: createDto.isActive ?? true,
      isDeleted: false,
    };

    if (createdBy) {
      sectionData['createdBy'] = createdBy;
    }

    const section = this.likuiditasSectionRepository.create(sectionData);
    return await this.likuiditasSectionRepository.save(section);
  }

  async findAllSections(isActive?: boolean): Promise<LikuiditasSection[]> {
    const where: any = { isDeleted: false }; // Hanya ambil yang tidak dihapus

    if (isActive !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.isActive = isActive;
    }

    return await this.likuiditasSectionRepository.find({
      where,
      order: { year: 'DESC', quarter: 'DESC', sortOrder: 'ASC', no: 'ASC' },
    });
  }

  // PERBAIKAN: Tambahkan method findSectionById yang hilang
  async findSectionById(id: number): Promise<LikuiditasSection> {
    try {
      console.log(`🔍 [SERVICE] Finding section by ID: ${id}`);

      // Cari dengan query builder untuk menghindari naming issues
      const section = await this.likuiditasSectionRepository
        .createQueryBuilder('section')
        .where('section.id = :id', { id })
        .andWhere('section.is_deleted = false')
        .getOne();

      console.log(`🔍 [SERVICE] Found section:`, section);

      if (!section) {
        throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
      }

      return section;
    } catch (error) {
      console.error(`❌ [SERVICE] Error in findSectionById:`, error);
      throw error;
    }
  }

  async findSectionsByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<LikuiditasSection[]> {
    return await this.likuiditasSectionRepository.find({
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
    updateDto: UpdateLikuiditasSectionDto,
    updatedBy?: string,
  ): Promise<LikuiditasSection> {
    const section = await this.findSectionById(id);

    // Jika ada perubahan no/parameter/year/quarter, cek duplikasi
    const checkNo = updateDto.no || section.no;
    const checkParam = updateDto.parameter || section.parameter;
    const checkYear = updateDto.year || section.year;

    const checkQuarter = updateDto.quarter || section.quarter;

    // Cek apakah ada section lain dengan no+parameter+year+quarter yang sama
    const existing = await this.likuiditasSectionRepository.findOne({
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

    return await this.likuiditasSectionRepository.save(section);
  }

  async deleteSection(id: number): Promise<void> {
    const section = await this.likuiditasSectionRepository.findOne({
      where: { id },
    });

    // Cek apakah section digunakan di indikator aktif
    // const hasActiveIndicators = await this.likuiditasRepository.count({
    //   where: {
    //     sectionId: id,
    //   },
    // });

    if (!section) {
      throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
    }

    const indikatorCount = await this.likuiditasRepository.count({
      where: { sectionId: id },
    });

    if (indikatorCount > 0) {
      throw new ConflictException(
        `Section tidak dapat dihapus karena masih digunakan oleh ${indikatorCount} indikator`,
      );
    }

    section.isDeleted = true;
    await this.likuiditasSectionRepository.delete(id);
  }

  // ========== STRATEGIK (INDIKATOR) SERVICES ==========

  async createIndikator(
    createDto: CreateLikuiditasDto,
    createdBy?: string,
  ): Promise<Likuiditas> {
    // 1. Validasi section exist
    const section = await this.findSectionById(createDto.sectionId);

    // 2. Cek apakah ada indikator yang sudah dihapus dengan data yang sama
    const deletedIndikator = await this.likuiditasRepository.findOne({
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

      return await this.likuiditasRepository.save(deletedIndikator);
    }

    // 4. Cek duplikasi hanya untuk data yang TIDAK dihapus
    const existingIndikator = await this.likuiditasRepository.findOne({
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
    const likuiditasData: Partial<Likuiditas> = {
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
      likuiditasData.createdBy = createdBy;
    }

    const likuiditas = this.likuiditasRepository.create(likuiditasData);
    return await this.likuiditasRepository.save(likuiditas);
  }

  async findIndikatorsByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<Likuiditas[]> {
    return await this.likuiditasRepository.find({
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

  async findAllIndikators(): Promise<Likuiditas[]> {
    return await this.likuiditasRepository.find({
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

  async findIndikatorById(id: number): Promise<Likuiditas> {
    const indikator = await this.likuiditasRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!indikator) {
      throw new NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
    }

    return indikator;
  }

  async updateIndikator(
    id: number,
    updateDto: UpdateLikuiditasDto,
    updatedBy?: string,
  ): Promise<Likuiditas> {
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

      const existing = await this.likuiditasRepository.findOne({
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
      const validationDto: Partial<CreateLikuiditasDto> = {
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

    return await this.likuiditasRepository.save(indikator);
  }

  async deleteIndikator(id: number): Promise<void> {
    const indikator = await this.likuiditasRepository.findOne({
      where: { id },
    });

    if (!indikator) {
      throw new NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
    }

    await this.likuiditasRepository.delete(id);
  }

  async searchIndikators(
    query?: string,
    year?: number,
    quarter?: Quarter,
  ): Promise<Likuiditas[]> {
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

      return await this.likuiditasRepository.find({
        where: searchConditions,
        relations: ['section'],
      });
    }

    return await this.likuiditasRepository.find({
      where,
      relations: ['section'],
    });
  }

  async getTotalWeightedByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.likuiditasRepository
      .createQueryBuilder('likuiditas')
      .select('SUM(likuiditas.weighted)', 'total')
      .where('likuiditas.year = :year', { year })
      .andWhere('likuiditas.quarter = :quarter', { quarter })
      .andWhere('likuiditas.is_deleted = false')
      .getRawOne();

    return parseFloat(result?.total || 0) || 0;
  }

  // ========== HELPER METHODS ==========

  private validateModeSpecificFields(dto: Partial<CreateLikuiditasDto>): void {
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
  ): Promise<Likuiditas> {
    const source = await this.findIndikatorById(sourceId);

    // Cek apakah sudah ada di periode target
    const existing = await this.likuiditasRepository.findOne({
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
    const newIndikatorData: Partial<Likuiditas> = {
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

    const newIndikator = this.likuiditasRepository.create(newIndikatorData);
    return await this.likuiditasRepository.save(newIndikator);
  }

  // ========== ADDITIONAL METHODS ==========

  // PERBAIKAN: Hapus deklarasi duplikat dan implementasi method
  async getIndikatorCountByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<number> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.likuiditasRepository
        .createQueryBuilder('likuiditas')
        .select('COUNT(likuiditas.id)', 'count')
        .where('likuiditas.year = :year', { year })
        .andWhere('likuiditas.quarter = :quarter', { quarter })
        .andWhere('likuiditas.is_deleted = false')
        .getRawOne();

      return parseInt(result?.count || 0) || 0;
    } catch (error) {
      console.error('Error in getIndikatorCountByPeriod:', error);
      return 0;
    }
  }

  async getSectionsWithIndicatorsByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<any> {
    try {
      console.log(
        `Loading sections with indicators for period: ${year}-${quarter}`,
      );

      // 1. Ambil sections untuk periode ini saja
      const sections = await this.likuiditasSectionRepository.find({
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
          const indicators = await this.likuiditasRepository.find({
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

  async getPeriods(): Promise<Array<{ year: number; quarter: Quarter }>> {
    const periods = await this.likuiditasRepository
      .createQueryBuilder('likuiditas')
      .select(['likuiditas.year', 'likuiditas.quarter'])
      .where('likuiditas.is_deleted = false')
      .groupBy('likuiditas.year, likuiditas.quarter')
      .orderBy('likuiditas.year', 'DESC')
      .addOrderBy('likuiditas.quarter', 'DESC')
      .getRawMany();

    return periods.map((p) => ({
      year: p.likuiditas_year,
      quarter: p.likuiditas_quarter,
    }));
  }
}
