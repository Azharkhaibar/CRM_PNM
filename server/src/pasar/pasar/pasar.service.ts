import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateSectionDto } from './dto/create-pasar-section.dto';
import { UpdatePasarSectionDto } from './dto/update-pasar-section.dto';
import { CreateIndikatorDto } from './dto/create-pasar-indikator.dto';
import { UpdateIndikatorDto } from './dto/update-pasar.dto';
import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionPasar } from './entities/section.entity';
import { IndikatorPasar } from './entities/indikator.entity';

@Injectable()
export class PasarService {
  private readonly logger = new Logger(PasarService.name);

  constructor(
    @InjectRepository(SectionPasar)
    private sectionRepository: Repository<SectionPasar>,
    @InjectRepository(IndikatorPasar)
    private indikatorRepository: Repository<IndikatorPasar>,
  ) {}

  // ============ SECTION METHODS ============

  async getSections(): Promise<SectionPasar[]> {
    try {
      return await this.sectionRepository.find({
        relations: ['indikators'],
        order: { no_sec: 'ASC' },
      });
    } catch (error) {
      this.logger.error(`Error getting all sections: ${error.message}`);
      throw new InternalServerErrorException('Gagal mengambil data sections');
    }
  }

  async getSectionsByPeriod(
    tahun: number,
    triwulan: string,
  ): Promise<SectionPasar[]> {
    try {
      return await this.sectionRepository.find({
        where: { tahun, triwulan },
        relations: ['indikators'],
        order: { no_sec: 'ASC' },
      });
    } catch (error) {
      this.logger.error(`Error getting sections by period: ${error.message}`);
      throw new InternalServerErrorException('Gagal mengambil data sections');
    }
  }

  async getSectionById(id: number): Promise<SectionPasar> {
    try {
      const section = await this.sectionRepository.findOne({
        where: { id },
        relations: ['indikators'],
      });

      if (!section) {
        throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
      }

      return section;
    } catch (error) {
      this.logger.error(`Error getting section by id: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal mengambil data section');
    }
  }

  async createSection(data: CreateSectionDto): Promise<SectionPasar> {
    try {
      // Cek duplicate
      const existing = await this.sectionRepository.findOne({
        where: {
          no_sec: data.no_sec,
          tahun: data.tahun,
          triwulan: data.triwulan,
        },
      });

      if (existing) {
        throw new BadRequestException(
          `Section dengan nomor "${data.no_sec}" sudah ada untuk periode ${data.tahun} ${data.triwulan}`,
        );
      }

      const section = this.sectionRepository.create({
        ...data,
        total_weighted: 0,
      });

      return await this.sectionRepository.save(section);
    } catch (error) {
      this.logger.error(`Error creating section: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal membuat section');
    }
  }

  async updateSection(
    id: number,
    data: UpdatePasarSectionDto,
  ): Promise<SectionPasar> {
    try {
      const section = await this.sectionRepository.findOne({
        where: { id },
        relations: ['indikators'],
      });

      if (!section) {
        throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
      }

      // Jika no_sec diubah, cek duplicate
      if (data.no_sec && data.no_sec !== section.no_sec) {
        const existing = await this.sectionRepository.findOne({
          where: {
            no_sec: data.no_sec,
            tahun: section.tahun,
            triwulan: section.triwulan,
            id: Not(id),
          },
        });

        if (existing) {
          throw new BadRequestException(
            `Section dengan nomor "${data.no_sec}" sudah ada`,
          );
        }
      }

      Object.assign(section, data);
      return await this.sectionRepository.save(section);
    } catch (error) {
      this.logger.error(`Error updating section: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal update section');
    }
  }

  async deleteSection(id: number): Promise<void> {
    try {
      const section = await this.sectionRepository.findOne({
        where: { id },
        relations: ['indikators'],
      });

      if (!section) {
        throw new NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
      }

      // Hapus semua indikator terkait terlebih dahulu
      if (section.indikators && section.indikators.length > 0) {
        await this.indikatorRepository.remove(section.indikators);
      }

      await this.sectionRepository.remove(section);
    } catch (error) {
      this.logger.error(`Error deleting section: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal menghapus section');
    }
  }

  // ============ INDIKATOR METHODS ============

  async getAllIndikators(): Promise<IndikatorPasar[]> {
    try {
      return await this.indikatorRepository.find({
        relations: ['section'],
        order: { id: 'ASC' },
      });
    } catch (error) {
      this.logger.error(`Error getting all indikators: ${error.message}`);
      throw new InternalServerErrorException('Gagal mengambil data indikator');
    }
  }

  async getIndikatorsBySection(sectionId: number): Promise<IndikatorPasar[]> {
    try {
      return await this.indikatorRepository.find({
        where: { section: { id: sectionId } },
        relations: ['section'],
        order: { id: 'ASC' },
      });
    } catch (error) {
      this.logger.error(
        `Error getting indikators by section: ${error.message}`,
      );
      throw new InternalServerErrorException('Gagal mengambil data indikator');
    }
  }

  async getIndikatorById(id: number): Promise<IndikatorPasar> {
    try {
      const indikator = await this.indikatorRepository.findOne({
        where: { id },
        relations: ['section'],
      });

      if (!indikator) {
        throw new NotFoundException(
          `Indikator dengan ID ${id} tidak ditemukan`,
        );
      }

      return indikator;
    } catch (error) {
      this.logger.error(`Error getting indikator by id: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal mengambil data indikator');
    }
  }

  async createIndikator(data: any): Promise<IndikatorPasar> {
    try {
      console.log('🔧 [PASAR SERVICE] Creating indikator with data:', data);

      // Cek section exists
      const section = await this.sectionRepository.findOne({
        where: { id: data.sectionId },
      });

      if (!section) {
        throw new NotFoundException('Section tidak ditemukan');
      }

      console.log('🔧 [PASAR SERVICE] Section found:', section);

      // Hitung hasil dan weighted
      const hasil = this.calculateHasil(data);
      const weighted = this.calculateWeighted(
        section.bobot_par,
        data.bobot_indikator || 0,
        data.peringkat || 1,
      );

      console.log(
        '🔧 [PASAR SERVICE] Calculations - hasil:',
        hasil,
        'weighted:',
        weighted,
      );

      // **PERBAIKAN: Buat object indikator secara manual tanpa menggunakan create()**
      const indikator = new IndikatorPasar();

      // Assign properties satu per satu
      indikator.section = section;
      indikator.nama_indikator = data.nama_indikator || '';
      indikator.bobot_indikator = data.bobot_indikator || 0;
      indikator.sumber_risiko = data.sumber_risiko || '';
      indikator.dampak = data.dampak || '';
      indikator.low = data.low || '';
      indikator.low_to_moderate = data.low_to_moderate || '';
      indikator.moderate = data.moderate || '';
      indikator.moderate_to_high = data.moderate_to_high || '';
      indikator.high = data.high || '';
      indikator.peringkat = data.peringkat || 1;
      indikator.hasil = hasil !== null ? hasil : 0;
      indikator.weighted = weighted;
      indikator.mode = data.mode || 'RASIO';
      indikator.is_percent = Boolean(data.is_percent) || false;

      // Optional fields
      if (data.pembilang_label !== undefined)
        indikator.pembilang_label = data.pembilang_label;
      if (data.pembilang_value !== undefined)
        indikator.pembilang_value = data.pembilang_value;
      if (data.penyebut_label !== undefined)
        indikator.penyebut_label = data.penyebut_label;
      if (data.penyebut_value !== undefined)
        indikator.penyebut_value = data.penyebut_value;
      if (data.keterangan !== undefined) indikator.keterangan = data.keterangan;
      if (data.formula !== undefined) indikator.formula = data.formula;

      console.log('🔧 [PASAR SERVICE] Indikator object created:', indikator);

      // **PERBAIKAN: Simpan menggunakan repository save() dengan type yang jelas**
      const savedIndikator = await this.indikatorRepository.save(indikator);

      console.log(
        '✅ [PASAR SERVICE] Indikator saved successfully:',
        savedIndikator,
      );

      // Update section total_weighted
      await this.updateSectionTotalWeighted(section.id);

      // **PERBAIKAN: Return dengan type assertion yang eksplisit**
      return savedIndikator;
    } catch (error) {
      console.error('❌ [PASAR SERVICE] Error creating indikator:', error);
      this.logger.error(`Error creating indikator: ${error.message}`);
      throw new InternalServerErrorException(
        `Gagal membuat indikator: ${error.message}`,
      );
    }
  }

  async updateIndikator(
    id: number,
    data: UpdateIndikatorDto,
  ): Promise<IndikatorPasar> {
    try {
      const indikator = await this.indikatorRepository.findOne({
        where: { id },
        relations: ['section'],
      });

      if (!indikator) {
        throw new NotFoundException(
          `Indikator dengan ID ${id} tidak ditemukan`,
        );
      }

      // Hitung ulang jika ada perubahan
      let hasil = indikator.hasil;
      let weighted = indikator.weighted;

      const shouldRecalculateHasil =
        data.pembilang_value !== undefined ||
        data.penyebut_value !== undefined ||
        data.mode !== undefined ||
        data.formula !== undefined ||
        data.is_percent !== undefined;

      const shouldRecalculateWeighted =
        data.bobot_indikator !== undefined || data.peringkat !== undefined;

      if (shouldRecalculateHasil) {
        const calculationData = {
          ...indikator,
          ...data,
        };
        const newHasil = this.calculateHasil(calculationData);
        hasil = newHasil !== null ? newHasil : 0;
      }

      if (shouldRecalculateWeighted) {
        const sectionBobot = indikator.section.bobot_par;
        const bobotIndikator =
          data.bobot_indikator || indikator.bobot_indikator;
        const peringkat = data.peringkat || indikator.peringkat;
        weighted = this.calculateWeighted(
          sectionBobot,
          bobotIndikator,
          peringkat,
        );
      }

      Object.assign(indikator, data);

      if (shouldRecalculateHasil) indikator.hasil = hasil;
      if (shouldRecalculateWeighted) indikator.weighted = weighted;

      // Handle nullable fields
      const nullableFields = [
        'pembilang_label',
        'pembilang_value',
        'penyebut_label',
        'penyebut_value',
        'keterangan',
        'formula',
      ];

      nullableFields.forEach((field) => {
        if (data[field] === '') {
          indikator[field] = null;
        }
      });

      const updatedIndikator = await this.indikatorRepository.save(indikator);

      // Update section total_weighted
      await this.updateSectionTotalWeighted(indikator.section.id);

      return updatedIndikator;
    } catch (error) {
      this.logger.error(`Error updating indikator: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal update indikator');
    }
  }

  async deleteIndikator(id: number): Promise<void> {
    try {
      const indikator = await this.indikatorRepository.findOne({
        where: { id },
        relations: ['section'],
      });

      if (!indikator) {
        throw new NotFoundException(
          `Indikator dengan ID ${id} tidak ditemukan`,
        );
      }

      const sectionId = indikator.section.id;

      await this.indikatorRepository.remove(indikator);

      // Update section total_weighted
      await this.updateSectionTotalWeighted(sectionId);
    } catch (error) {
      this.logger.error(`Error deleting indikator: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal menghapus indikator');
    }
  }

  // ============ SUMMARY METHOD ============

  async getOverallSummary(tahun: number, triwulan: string): Promise<any> {
    try {
      const sections = await this.getSectionsByPeriod(tahun, triwulan);

      let totalWeighted = 0;
      let totalIndicators = 0;

      for (const section of sections) {
        const sectionWeighted = section.total_weighted;

        if (typeof sectionWeighted === 'number' && !isNaN(sectionWeighted)) {
          totalWeighted += sectionWeighted;
        } else if (sectionWeighted !== null && sectionWeighted !== undefined) {
          const parsed = parseFloat(sectionWeighted as any);
          if (!isNaN(parsed)) {
            totalWeighted += parsed;
          }
        }

        if (section.indikators && Array.isArray(section.indikators)) {
          totalIndicators += section.indikators.length;
        }
      }

      const safeTotalWeighted =
        typeof totalWeighted === 'number' ? totalWeighted : 0;

      return {
        total_weighted: parseFloat(safeTotalWeighted.toFixed(2)),
        total_sections: sections.length,
        total_indicators: totalIndicators,
        risk_level: this.determineOverallRiskLevel(safeTotalWeighted),
        year: tahun,
        quarter: triwulan,
      };
    } catch (error) {
      this.logger.error(`Error in getOverallSummary: ${error.message}`);
      return {
        total_weighted: 0,
        total_sections: 0,
        total_indicators: 0,
        risk_level: 'LOW',
        year: tahun,
        quarter: triwulan,
      };
    }
  }

  // ============ PRIVATE HELPER METHODS ============

  private async updateSectionTotalWeighted(sectionId: number): Promise<void> {
    try {
      // PERBAIKAN: Gunakan createQueryBuilder untuk menghindari masalah tipe
      const section = await this.sectionRepository
        .createQueryBuilder('section')
        .leftJoinAndSelect('section.indikators', 'indikator')
        .where('section.id = :id', { id: sectionId })
        .getOne();

      if (!section) {
        throw new NotFoundException(
          `Section dengan ID ${sectionId} tidak ditemukan`,
        );
      }

      // Hitung total weighted
      const totalWeighted = section.indikators.reduce((sum, indikator) => {
        const weighted = indikator.weighted;
        return (
          sum +
          (typeof weighted === 'number' && !isNaN(weighted) ? weighted : 0)
        );
      }, 0);

      // Update section
      section.total_weighted = totalWeighted;
      await this.sectionRepository.save(section);
    } catch (error) {
      this.logger.error(
        `Error updating section total weighted: ${error.message}`,
      );
    }
  }

  private calculateHasil(data: any): number | null {
    try {
      const mode = data.mode || 'RASIO';
      const pemb = data.pembilang_value || 0;
      const peny = data.penyebut_value || 0;

      if (mode === 'NILAI_TUNGGAL') {
        return peny;
      }

      if (data.formula && data.formula.trim() !== '') {
        try {
          const expr = data.formula
            .replace(/\bpemb\b/g, 'pemb')
            .replace(/\bpeny\b/g, 'peny');

          const fn = new Function('pemb', 'peny', `return (${expr});`);
          const result = fn(pemb, peny);

          if (
            typeof result === 'number' &&
            !isNaN(result) &&
            isFinite(result)
          ) {
            return data.is_percent ? result * 100 : result;
          }
        } catch (error) {
          this.logger.warn(`Invalid formula: ${data.formula}`, error);
        }
      }

      if (peny === 0) {
        return null;
      }

      const result = pemb / peny;
      return data.is_percent ? result * 100 : result;
    } catch (error) {
      this.logger.error(`Error calculating hasil: ${error.message}`);
      return null;
    }
  }

  private calculateWeighted(
    bobotSection: number,
    bobotIndikator: number,
    peringkat: number,
  ): number {
    try {
      const sectionBobot =
        typeof bobotSection === 'number'
          ? bobotSection
          : parseFloat(bobotSection || '0');
      const indicatorBobot =
        typeof bobotIndikator === 'number'
          ? bobotIndikator
          : parseFloat(bobotIndikator || '0');
      const rating =
        typeof peringkat === 'number' ? peringkat : parseInt(peringkat || '1');

      if (isNaN(sectionBobot) || isNaN(indicatorBobot) || isNaN(rating)) {
        return 0;
      }

      const weighted = (sectionBobot * indicatorBobot * rating) / 10000;
      return parseFloat(weighted.toFixed(2));
    } catch (error) {
      this.logger.error(`Error calculating weighted: ${error.message}`);
      return 0;
    }
  }

  private determineOverallRiskLevel(totalWeighted: number): string {
    if (totalWeighted <= 1) return 'LOW';
    if (totalWeighted <= 2) return 'LOW_TO_MODERATE';
    if (totalWeighted <= 3) return 'MODERATE';
    if (totalWeighted <= 4) return 'MODERATE_TO_HIGH';
    return 'HIGH';
  }

  // ============ OPTIONAL METHODS (jika diperlukan) ============

  async searchIndikators(query: string): Promise<IndikatorPasar[]> {
    try {
      return await this.indikatorRepository
        .createQueryBuilder('indikator')
        .leftJoinAndSelect('indikator.section', 'section')
        .where('indikator.nama_indikator LIKE :query', { query: `%${query}%` })
        .orWhere('indikator.sumber_risiko LIKE :query', { query: `%${query}%` })
        .orWhere('indikator.dampak LIKE :query', { query: `%${query}%` })
        .orWhere('indikator.keterangan LIKE :query', { query: `%${query}%` })
        .orderBy('indikator.id', 'ASC')
        .getMany();
    } catch (error) {
      this.logger.error(`Error searching indikators: ${error.message}`);
      return [];
    }
  }

  async getAvailablePeriods(): Promise<{ year: number; quarter: string }[]> {
    try {
      const periods = await this.sectionRepository
        .createQueryBuilder('section')
        .select('DISTINCT section.tahun, section.triwulan')
        .orderBy('section.tahun', 'DESC')
        .addOrderBy('section.triwulan', 'ASC')
        .getRawMany();

      return periods.map((p) => ({
        year: p.section_tahun,
        quarter: p.section_triwulan,
      }));
    } catch (error) {
      this.logger.error(`Error getting available periods: ${error.message}`);
      return [];
    }
  }

  async createSectionWithIndikators(
    section: CreateSectionDto,
    indikators: CreateIndikatorDto[],
  ): Promise<SectionPasar> {
    try {
      // Buat section terlebih dahulu
      const newSection = await this.createSection(section);

      // Buat indikator satu per satu
      for (const indikatorData of indikators) {
        await this.createIndikator({
          ...indikatorData,
          sectionId: newSection.id,
        });
      }

      // Ambil section dengan indikator yang baru dibuat
      return await this.getSectionById(newSection.id);
    } catch (error) {
      this.logger.error(`Error in bulk create: ${error.message}`);
      throw new InternalServerErrorException(
        'Gagal membuat section dengan indikator',
      );
    }
  }
}
