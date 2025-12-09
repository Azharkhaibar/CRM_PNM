import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  Likuiditas,
  Quarter,
  CalculationMode,
} from './entities/likuiditas.entity';
import { SectionLikuiditas } from './entities/section-likuiditas.entity';
import {
  CreateSectionLikuiditasDto,
  CreateIndikatorLikuiditasDto,
} from './dto/create-likuiditas.dto';
// import {
//   UpdateSectionLikuiditasDto,
//   UpdateIndikatorLikuiditasDto,
// } from './dto/update-likuiditas.dto';
import {
  UpdateSectionLikuiditasDto,
  UpdateIndikatorLikuiditasDto,
} from './dto/update-likuidita.dto';
@Injectable()
export class LikuiditasService {
  constructor(
    @InjectRepository(Likuiditas)
    private readonly likuiditasRepository: Repository<Likuiditas>,
    @InjectRepository(SectionLikuiditas)
    private readonly sectionRepository: Repository<SectionLikuiditas>,
  ) {}

  // ===================== SECTION OPERATIONS =====================
  async createSection(
    createSectionDto: CreateSectionLikuiditasDto,
  ): Promise<SectionLikuiditas> {
    // CEK DUPLIKASI SEBELUM CREATE
    const existingSection = await this.sectionRepository.findOne({
      where: {
        year: createSectionDto.year,
        quarter: createSectionDto.quarter,
        no: createSectionDto.no,
      },
    });

    if (existingSection) {
      throw new ConflictException(
        `Section dengan tahun ${createSectionDto.year}, quarter ${createSectionDto.quarter}, dan nomor ${createSectionDto.no} sudah ada`,
      );
    }

    const section = this.sectionRepository.create({
      no: createSectionDto.no,
      bobotSection: createSectionDto.bobotSection,
      parameter: createSectionDto.parameter,
      description: createSectionDto.description || null,
      year: createSectionDto.year,
      quarter: createSectionDto.quarter,
    });

    return await this.sectionRepository.save(section);
  }

  async updateSection(
    id: number,
    updateSectionDto: UpdateSectionLikuiditasDto,
  ): Promise<SectionLikuiditas> {
    const section = await this.sectionRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!section) {
      throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
    }

    if (
      updateSectionDto.year !== undefined ||
      updateSectionDto.quarter !== undefined ||
      updateSectionDto.no !== undefined
    ) {
      const year = updateSectionDto.year ?? section.year;
      const quarter = updateSectionDto.quarter ?? section.quarter;
      const no = updateSectionDto.no ?? section.no;

      const duplicate = await this.sectionRepository.findOne({
        where: {
          year,
          quarter,
          no,
          isDeleted: false,
          id: Not(id), // Kecualikan diri sendiri
        },
      });

      if (duplicate) {
        throw new ConflictException(
          `Section dengan tahun ${year}, quarter ${quarter}, dan nomor ${no} sudah ada`,
        );
      }
    }

    return await this.sectionRepository.save(section);
  }

  async deleteSection(id: number): Promise<void> {
    const section = await this.sectionRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!section) {
      throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
    }

    section.isDeleted = true;
    section.deletedAt = new Date();
    await this.sectionRepository.save(section);
  }

  async getSectionsByPeriod(
    year: number,
    quarter: Quarter,
  ): Promise<SectionLikuiditas[]> {
    const sections = await this.sectionRepository.find({
      where: {
        year,
        quarter,
        isDeleted: false,
      },
      relations: ['indikators'],
      order: {
        no: 'ASC',
        id: 'ASC',
      },
    });

    // Filter out deleted indicators
    return sections.map((section) => ({
      ...section,
      indikators: section.indikators.filter((ind) => !ind.isDeleted),
    }));
  }

  // ===================== INDICATOR OPERATIONS =====================
  async createIndikator(
    createIndikatorDto: CreateIndikatorLikuiditasDto,
  ): Promise<Likuiditas> {
    // Cek apakah section ada
    const section = await this.sectionRepository.findOne({
      where: {
        id: createIndikatorDto.sectionId,
        isDeleted: false,
      },
    });

    if (!section) {
      throw new NotFoundException(
        `Section dengan ID ${createIndikatorDto.sectionId} tidak ditemukan`,
      );
    }

    // **PERBAIKAN: Gunakan hasil dari DTO jika ada, jika tidak hitung otomatis**
    const hasil = createIndikatorDto.hasil
      ? createIndikatorDto.hasil
      : await this.calculateHasil(createIndikatorDto);

    // **PERBAIKAN: Gunakan weighted dari DTO jika ada, jika tidak hitung otomatis**
    const weighted =
      createIndikatorDto.weighted !== undefined
        ? createIndikatorDto.weighted
        : await this.calculateWeighted(
            createIndikatorDto,
            section.bobotSection,
          );

    // Map mode dari string ke enum
    let modeValue: CalculationMode;
    switch (createIndikatorDto.mode) {
      case 'RASIO':
        modeValue = CalculationMode.RASIO;
        break;
      case 'NILAI_TUNGGAL':
        modeValue = CalculationMode.NILAI_TUNGGAL;
        break;
      case 'TEKS':
        modeValue = CalculationMode.TEKS;
        break;
      default:
        modeValue = CalculationMode.RASIO;
    }

    // Buat object indikator dengan tipe yang benar
    const indikatorData: Partial<Likuiditas> = {
      year: createIndikatorDto.year,
      quarter: createIndikatorDto.quarter,
      sectionId: createIndikatorDto.sectionId,
      subNo: createIndikatorDto.subNo,
      namaIndikator: createIndikatorDto.namaIndikator,
      bobotIndikator: createIndikatorDto.bobotIndikator,
      sumberRisiko: createIndikatorDto.sumberRisiko || null,
      dampak: createIndikatorDto.dampak || null,
      low: createIndikatorDto.low || null,
      lowToModerate: createIndikatorDto.lowToModerate || null,
      moderate: createIndikatorDto.moderate || null,
      moderateToHigh: createIndikatorDto.moderateToHigh || null,
      high: createIndikatorDto.high || null,
      mode: modeValue,
      pembilangLabel: createIndikatorDto.pembilangLabel || null,
      pembilangValue: createIndikatorDto.pembilangValue || null,
      penyebutLabel: createIndikatorDto.penyebutLabel || null,
      penyebutValue: createIndikatorDto.penyebutValue || null,
      formula: createIndikatorDto.formula || null,
      isPercent: createIndikatorDto.isPercent || false,
      hasil: hasil,
      hasilText: createIndikatorDto.hasilText || null,
      peringkat: createIndikatorDto.peringkat || 1,
      weighted: weighted,
      keterangan: createIndikatorDto.keterangan || null,
    };

    console.log('🔢 [SERVICE] Creating indikator with:', {
      hasilFromDto: createIndikatorDto.hasil,
      hasilUsed: hasil,
      weightedFromDto: createIndikatorDto.weighted,
      weightedUsed: weighted,
    });

    const indikator = this.likuiditasRepository.create(indikatorData);
    return await this.likuiditasRepository.save(indikator);
  }

  async updateIndikator(
    id: number,
    updateIndikatorDto: UpdateIndikatorLikuiditasDto,
  ): Promise<Likuiditas> {
    console.log('🔄 [BACKEND SERVICE] Update request:', {
      id,
      dto: updateIndikatorDto,
    });

    const indikator = await this.likuiditasRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!indikator) {
      throw new NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
    }

    // **PERBAIKAN 1: MAP SEMUA FIELD DARI DTO KE ENTITY**
    const updateData: Partial<Likuiditas> = {};

    // Map string fields
    if (updateIndikatorDto.namaIndikator !== undefined) {
      updateData.namaIndikator = updateIndikatorDto.namaIndikator;
      console.log(
        '📝 [BACKEND SERVICE] Updating namaIndikator to:',
        updateIndikatorDto.namaIndikator,
      );
    }

    if (updateIndikatorDto.subNo !== undefined) {
      updateData.subNo = updateIndikatorDto.subNo;
    }

    if (updateIndikatorDto.sumberRisiko !== undefined) {
      updateData.sumberRisiko = updateIndikatorDto.sumberRisiko;
    }

    if (updateIndikatorDto.dampak !== undefined) {
      updateData.dampak = updateIndikatorDto.dampak;
    }

    if (updateIndikatorDto.keterangan !== undefined) {
      updateData.keterangan = updateIndikatorDto.keterangan;
    }

    if (updateIndikatorDto.pembilangLabel !== undefined) {
      updateData.pembilangLabel = updateIndikatorDto.pembilangLabel;
    }

    if (updateIndikatorDto.penyebutLabel !== undefined) {
      updateData.penyebutLabel = updateIndikatorDto.penyebutLabel;
    }

    if (updateIndikatorDto.formula !== undefined) {
      updateData.formula = updateIndikatorDto.formula;
    }

    if (updateIndikatorDto.hasilText !== undefined) {
      updateData.hasilText = updateIndikatorDto.hasilText;
    }

    // Map number fields
    if (updateIndikatorDto.bobotIndikator !== undefined) {
      updateData.bobotIndikator = updateIndikatorDto.bobotIndikator;
    }

    if (updateIndikatorDto.pembilangValue !== undefined) {
      updateData.pembilangValue = updateIndikatorDto.pembilangValue;
    }

    if (updateIndikatorDto.penyebutValue !== undefined) {
      updateData.penyebutValue = updateIndikatorDto.penyebutValue;
    }

    if (updateIndikatorDto.peringkat !== undefined) {
      updateData.peringkat = updateIndikatorDto.peringkat;
    }

    // Map boolean fields
    if (updateIndikatorDto.isPercent !== undefined) {
      updateData.isPercent = updateIndikatorDto.isPercent;
    }

    // Map mode (enum)
    if (updateIndikatorDto.mode !== undefined) {
      let modeValue: CalculationMode;
      switch (updateIndikatorDto.mode) {
        case 'RASIO':
          modeValue = CalculationMode.RASIO;
          break;
        case 'NILAI_TUNGGAL':
          modeValue = CalculationMode.NILAI_TUNGGAL;
          break;
        case 'TEKS':
          modeValue = CalculationMode.TEKS;
          break;
        default:
          modeValue = CalculationMode.RASIO;
      }
      updateData.mode = modeValue;
    }

    // Map threshold fields
    if (updateIndikatorDto.low !== undefined) {
      updateData.low = updateIndikatorDto.low;
    }

    if (updateIndikatorDto.lowToModerate !== undefined) {
      updateData.lowToModerate = updateIndikatorDto.lowToModerate;
    }

    if (updateIndikatorDto.moderate !== undefined) {
      updateData.moderate = updateIndikatorDto.moderate;
    }

    if (updateIndikatorDto.moderateToHigh !== undefined) {
      updateData.moderateToHigh = updateIndikatorDto.moderateToHigh;
    }

    if (updateIndikatorDto.high !== undefined) {
      updateData.high = updateIndikatorDto.high;
    }

    // **PERBAIKAN 2: Hitung ulang hasil dan weighted jika perlu**
    const shouldRecalculateHasil =
      (updateIndikatorDto.pembilangValue !== undefined ||
        updateIndikatorDto.penyebutValue !== undefined ||
        updateIndikatorDto.formula !== undefined ||
        updateIndikatorDto.mode !== undefined ||
        updateIndikatorDto.isPercent !== undefined) &&
      updateIndikatorDto.hasil === undefined;

    const shouldRecalculateWeighted =
      (updateIndikatorDto.bobotIndikator !== undefined ||
        updateIndikatorDto.peringkat !== undefined) &&
      updateIndikatorDto.weighted === undefined;

    if (shouldRecalculateHasil) {
      const dataForCalculation = {
        ...indikator,
        ...updateIndikatorDto,
        mode: updateIndikatorDto.mode || indikator.mode,
      };
      updateData.hasil = await this.calculateHasil(dataForCalculation);
      console.log('🧮 [BACKEND SERVICE] Recalculated hasil:', updateData.hasil);
    } else if (updateIndikatorDto.hasil !== undefined) {
      updateData.hasil = updateIndikatorDto.hasil;
    }

    if (shouldRecalculateWeighted) {
      const dataForWeighted = {
        ...indikator,
        ...updateIndikatorDto,
        bobotIndikator:
          updateIndikatorDto.bobotIndikator || indikator.bobotIndikator,
        peringkat: updateIndikatorDto.peringkat || indikator.peringkat,
      };
      updateData.weighted = await this.calculateWeighted(
        dataForWeighted,
        indikator.section.bobotSection,
      );
      console.log(
        '⚖️ [BACKEND SERVICE] Recalculated weighted:',
        updateData.weighted,
      );
    } else if (updateIndikatorDto.weighted !== undefined) {
      updateData.weighted = updateIndikatorDto.weighted;
    }

    // **PERBAIKAN 3: Apply updates ke entity**
    console.log('📋 [BACKEND SERVICE] Updates to apply:', updateData);
    Object.assign(indikator, updateData);

    // **PERBAIKAN 4: Set updatedAt timestamp**
    indikator.updatedAt = new Date();

    // **PERBAIKAN 5: Save dan log hasil**
    const saved = await this.likuiditasRepository.save(indikator);

    console.log('✅ [BACKEND SERVICE] Update successful:', {
      id: saved.id,
      namaIndikator: saved.namaIndikator,
      updatedAt: saved.updatedAt,
      before: indikator.namaIndikator,
      after: saved.namaIndikator,
    });

    return saved;
  }

  async deleteIndikator(id: number): Promise<void> {
    const indikator = await this.likuiditasRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!indikator) {
      throw new NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
    }

    indikator.isDeleted = true;
    indikator.deletedAt = new Date();
    await this.likuiditasRepository.save(indikator);
  }

  // ===================== UTILITY FUNCTIONS =====================
  private async calculateHasil(data: any): Promise<string | null> {
    const mode = data.mode || 'RASIO';
    const formula = data.formula;
    const pembilangValue = data.pembilangValue || data.pembilang_value;
    const penyebutValue = data.penyebutValue || data.penyebut_value;

    if (formula && formula.trim() !== '') {
      try {
        const expr = formula
          .replace(/\bpemb\b/g, 'pemb')
          .replace(/\bpeny\b/g, 'peny');
        const fn = new Function('pemb', 'peny', `return (${expr});`);
        const pemb = Number(pembilangValue) || 0;
        const peny = Number(penyebutValue) || 0;
        const res = fn(pemb, peny);

        if (!isFinite(res) || isNaN(res)) return null;
        return String(res);
      } catch (e) {
        console.warn('Invalid formula:', formula, e);
        return null;
      }
    }

    if (mode === 'RASIO') {
      if (!penyebutValue || penyebutValue === 0) return null;
      const result = (Number(pembilangValue) || 0) / Number(penyebutValue);
      if (!isFinite(result) || isNaN(result)) return null;
      return String(result);
    }

    if (mode === 'NILAI_TUNGGAL') {
      if (!penyebutValue) return null;
      return String(penyebutValue);
    }

    return null;
  }

  private async calculateWeighted(
    data: any,
    sectionBobot: number,
  ): Promise<number> {
    const bobotInd = Number(data.bobotIndikator || data.bobot_indikator) || 0;
    const peringkat = Number(data.peringkat) || 1;
    const res = (sectionBobot * bobotInd * peringkat) / 10000;

    if (!isFinite(res) || isNaN(res)) return 0;
    return Number(res.toFixed(4));
  }

  // ===================== SUMMARY & OTHERS =====================
  async getSummaryByPeriod(year: number, quarter: Quarter): Promise<any> {
    const sections = await this.getSectionsByPeriod(year, quarter);

    let totalWeighted = 0;
    const sectionDetails: Array<{
      sectionId: number;
      sectionNo: string;
      sectionName: string;
      bobotSection: number;
      totalWeighted: number;
      indicatorCount: number;
    }> = [];

    for (const section of sections) {
      const sectionTotal = section.indikators.reduce((sum, ind) => {
        return sum + (Number(ind.weighted) || 0);
      }, 0);

      sectionDetails.push({
        sectionId: section.id,
        sectionNo: section.no,
        sectionName: section.parameter,
        bobotSection: section.bobotSection,
        totalWeighted: sectionTotal,
        indicatorCount: section.indikators.length,
      });

      totalWeighted += sectionTotal;
    }

    return {
      year,
      quarter,
      totalWeighted: Number(totalWeighted.toFixed(4)),
      sectionCount: sections.length,
      sections: sectionDetails,
    };
  }

  async getIndikatorById(id: number): Promise<Likuiditas> {
    const indikator = await this.likuiditasRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!indikator) {
      throw new NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
    }

    return indikator;
  }
}
