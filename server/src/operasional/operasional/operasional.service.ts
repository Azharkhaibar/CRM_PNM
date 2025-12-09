import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  Operational,
  Quarter,
  CalculationMode,
} from './entities/operasional.entity';
import { SectionOperational } from './entities/operasional-section.entity';
import {
  CreateSectionOperationalDto,
  CreateIndikatorOperationalDto,
} from './dto/create-operasional.dto';
import {
  UpdateSectionOperationalDto,
  UpdateIndikatorOperationalDto,
} from './dto/update-operasional.dto';

@Injectable()
export class OperationalService {
  // NAMA YANG BENAR: OperationalService (bukan OperasionalService)
  constructor(
    @InjectRepository(Operational)
    private readonly operationalRepository: Repository<Operational>,
    @InjectRepository(SectionOperational)
    private readonly sectionRepository: Repository<SectionOperational>,
  ) {}

  // SECTION OPERATIONS
  async createSection(createSectionDto: CreateSectionOperationalDto) {
    // Validasi bobot section (0-100)
    if (
      createSectionDto.bobotSection < 0 ||
      createSectionDto.bobotSection > 100
    ) {
      throw new ConflictException(
        'Bobot section harus antara 0 dan 100 persen',
      );
    }

    // Cek duplikasi - PERBAIKAN: tambah kondisi isDeleted: false
    const existingSection = await this.sectionRepository.findOne({
      where: {
        year: createSectionDto.year,
        quarter: createSectionDto.quarter,
        no: createSectionDto.no,
        isDeleted: false, // TAMBAHKAN INI
      },
    });

    if (existingSection) {
      throw new ConflictException(
        `Section dengan tahun ${createSectionDto.year}, quarter ${createSectionDto.quarter}, dan nomor ${createSectionDto.no} sudah ada`,
      );
    }

    // Validasi format nomor section (contoh: "1.1", "2.3.1")
    const noPattern = /^[0-9]+(\.[0-9]+)*$/;
    if (!noPattern.test(createSectionDto.no)) {
      throw new ConflictException(
        'Format nomor section tidak valid. Gunakan format seperti "1.1" atau "2.3.1"',
      );
    }

    const section = this.sectionRepository.create({
      no: createSectionDto.no,
      bobotSection: createSectionDto.bobotSection,
      parameter: createSectionDto.parameter.trim(),
      year: createSectionDto.year,
      quarter: createSectionDto.quarter,
      isDeleted: false,
    });

    return await this.sectionRepository.save(section);
  }

  async updateSection(
    id: number,
    updateSectionDto: UpdateSectionOperationalDto,
  ) {
    const section = await this.sectionRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!section) {
      throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
    }

    // Cek duplikasi (kecuali diri sendiri)
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
          id: Not(id),
        },
      });

      if (duplicate) {
        throw new ConflictException(
          `Section dengan tahun ${year}, quarter ${quarter}, dan nomor ${no} sudah ada`,
        );
      }
    }

    // Update section
    Object.assign(section, updateSectionDto);
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

  async getSectionsByPeriod(year: number, quarter: Quarter) {
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

  // INDICATOR OPERATIONS
  async createIndikator(createIndikatorDto: CreateIndikatorOperationalDto) {
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

    // Hitung hasil jika tidak disediakan
    const hasil =
      createIndikatorDto.hasil !== undefined
        ? createIndikatorDto.hasil
        : await this.calculateHasil(createIndikatorDto);

    // Hitung weighted jika tidak disediakan
    const weighted =
      createIndikatorDto.weighted !== undefined
        ? createIndikatorDto.weighted
        : await this.calculateWeighted(
            createIndikatorDto,
            section.bobotSection,
          );

    // Map mode ke enum
    let modeValue: CalculationMode;
    switch (createIndikatorDto.mode) {
      case 'RASIO':
        modeValue = CalculationMode.RASIO;
        break;
      case 'NILAI_TUNGGAL':
        modeValue = CalculationMode.NILAI_TUNGGAL;
        break;
      default:
        modeValue = CalculationMode.RASIO;
    }

    // Buat indikator
    const indikatorData: Partial<Operational> = {
      year: createIndikatorDto.year,
      quarter: createIndikatorDto.quarter,
      sectionId: createIndikatorDto.sectionId,
      subNo: createIndikatorDto.subNo,
      indikator: createIndikatorDto.indikator,
      bobotIndikator: createIndikatorDto.bobotIndikator,
      sumberRisiko: createIndikatorDto.sumberRisiko || null,
      dampak: createIndikatorDto.dampak || null,
      mode: modeValue,
      pembilangLabel: createIndikatorDto.pembilangLabel || null,
      pembilangValue: createIndikatorDto.pembilangValue || null,
      penyebutLabel: createIndikatorDto.penyebutLabel || null,
      penyebutValue: createIndikatorDto.penyebutValue || null,
      formula: createIndikatorDto.formula || null,
      isPercent: createIndikatorDto.isPercent || false,
      hasil: hasil,
      peringkat: createIndikatorDto.peringkat || 1,
      weighted: weighted,
      keterangan: createIndikatorDto.keterangan || null,
    };

    const indikator = this.operationalRepository.create(indikatorData);
    return await this.operationalRepository.save(indikator);
  }

  async updateIndikator(
    id: number,
    updateIndikatorDto: UpdateIndikatorOperationalDto,
  ) {
    const indikator = await this.operationalRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!indikator) {
      throw new NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
    }

    const updateData: Partial<Operational> = {};

    // Map semua field
    if (updateIndikatorDto.indikator !== undefined) {
      updateData.indikator = updateIndikatorDto.indikator;
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
    if (updateIndikatorDto.isPercent !== undefined) {
      updateData.isPercent = updateIndikatorDto.isPercent;
    }

    // Map mode
    if (updateIndikatorDto.mode !== undefined) {
      let modeValue: CalculationMode;
      switch (updateIndikatorDto.mode) {
        case 'RASIO':
          modeValue = CalculationMode.RASIO;
          break;
        case 'NILAI_TUNGGAL':
          modeValue = CalculationMode.NILAI_TUNGGAL;
          break;
        default:
          modeValue = CalculationMode.RASIO;
      }
      updateData.mode = modeValue;
    }

    // Hitung ulang jika perlu
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
    } else if (updateIndikatorDto.weighted !== undefined) {
      updateData.weighted = updateIndikatorDto.weighted;
    }

    // Apply updates
    Object.assign(indikator, updateData);
    indikator.updatedAt = new Date();

    return await this.operationalRepository.save(indikator);
  }

  async deleteIndikator(id: number): Promise<void> {
    const indikator = await this.operationalRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!indikator) {
      throw new NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
    }

    indikator.isDeleted = true;
    indikator.deletedAt = new Date();
    await this.operationalRepository.save(indikator);
  }

  // UTILITY FUNCTIONS
  private async calculateHasil(data: any): Promise<number | null> {
    const mode = data.mode || 'RASIO';
    const formula = data.formula;
    const pembilangValue = data.pembilangValue;
    const penyebutValue = data.penyebutValue;
    const isPercent = data.isPercent || false;

    try {
      let result: number;

      if (formula && formula.trim() !== '') {
        const expr = formula
          .replace(/\bpemb\b/g, 'pemb')
          .replace(/\bpeny\b/g, 'peny');
        const fn = new Function('pemb', 'peny', `return (${expr});`);
        const pemb = Number(pembilangValue) || 0;
        const peny = Number(penyebutValue) || 0;
        result = fn(pemb, peny);
      } else if (mode === 'RASIO') {
        if (!penyebutValue || penyebutValue === 0) return null;
        result = (Number(pembilangValue) || 0) / Number(penyebutValue);
      } else if (mode === 'NILAI_TUNGGAL') {
        if (!penyebutValue) return null;
        result = Number(penyebutValue);
      } else {
        return null;
      }

      if (!isFinite(result) || isNaN(result)) return null;

      if (isPercent) {
        result = result * 100;
      }

      return result;
    } catch (e) {
      console.warn('Error calculating hasil:', e);
      return null;
    }
  }

  private async calculateWeighted(
    data: any,
    sectionBobot: number,
  ): Promise<number> {
    const bobotInd = Number(data.bobotIndikator) || 0;
    const peringkat = Number(data.peringkat) || 1;
    const res = (sectionBobot * bobotInd * peringkat) / 10000;

    if (!isFinite(res) || isNaN(res)) return 0;
    return Number(res.toFixed(4));
  }

  // GET SUMMARY - PERBAIKAN: Definisikan tipe untuk sectionDetails
  async getSummaryByPeriod(year: number, quarter: Quarter) {
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

  // TAMBAHKAN METODE LAIN YANG DIBUTUHKAN
  async getIndikatorById(id: number): Promise<Operational> {
    const indikator = await this.operationalRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['section'],
    });

    if (!indikator) {
      throw new NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
    }

    return indikator;
  }

  async getSectionById(id: number): Promise<SectionOperational> {
    const section = await this.sectionRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['indikators'],
    });

    if (!section) {
      throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
    }

    return {
      ...section,
      indikators: section.indikators.filter((ind) => !ind.isDeleted),
    };
  }
}
