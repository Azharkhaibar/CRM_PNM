import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ReputasiOjk } from './entities/reputasi-ojk.entity';
import { ReputasiParameter } from './entities/reputasi-paramater.entity';
import { ReputasiNilai } from './entities/reputasi-nilai.entity';
import { ReputasiReference } from './entities/reputasi-inherent-references.entity';
// import {
//   CreateReputasiOjkDto,
//   UpdateReputasiOjkDto,
//   CreateParameterDto,
//   UpdateParameterDto,
//   CreateNilaiDto,
//   UpdateNilaiDto,
//   ReorderParametersDto,
//   ReorderNilaiDto,
//   UpdateSummaryDto,
//   KategoriModel,
//   KategoriPrinsip,
//   KategoriJenis,
//   JudulType,
// } from './dto/reputasi-ojk.dto';

import {
  CreateReputasiOjkDto,
  CreateParameterDto,
  CreateNilaiDto,
  UpdateNilaiDto,
  UpdateParameterDto,
  UpdateReputasiOjkDto,
  UpdateSummaryDto,
  ReorderNilaiDto,
  ReorderParametersDto,
  KategoriJenis,
  KategoriModel,
  KategoriPrinsip,
  JudulType,
} from './dto/reputasi-inherent.dto';

@Injectable()
export class ReputasiOjkService {
  private readonly logger = new Logger(ReputasiOjkService.name);

  constructor(
    @InjectRepository(ReputasiOjk)
    private reputasiRepository: Repository<ReputasiOjk>,
    @InjectRepository(ReputasiParameter)
    private parameterRepository: Repository<ReputasiParameter>,
    @InjectRepository(ReputasiNilai)
    private nilaiRepository: Repository<ReputasiNilai>,
    @InjectRepository(ReputasiReference)
    private referenceRepository: Repository<ReputasiReference>,
    private dataSource: DataSource,
  ) {}

  // === CRUD UTAMA (ReputasiOjk) ===

  async create(createDto: CreateReputasiOjkDto, userId: string) {
    try {
      const existing = await this.reputasiRepository.findOne({
        where: { year: createDto.year, quarter: createDto.quarter },
      });

      if (existing) {
        this.logger.warn(
          `create: Data sudah ada untuk year ${createDto.year} quarter ${createDto.quarter}`,
        );
        return existing;
      }

      const reputasi = this.reputasiRepository.create({
        year: createDto.year,
        quarter: createDto.quarter,
        isActive: createDto.isActive ?? true,
        createdBy: userId,
        updatedBy: userId,
        version: createDto.version || '1.0.0',
      });

      const saved = await this.reputasiRepository.save(reputasi);
      this.logger.log(`create: Data berhasil dibuat - ID: ${saved.id}`);

      return saved;
    } catch (error) {
      this.logger.error(
        `Error creating ReputasiOjk: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActive(): Promise<ReputasiOjk | null> {
    this.logger.debug('findActive: Mencari data aktif');

    try {
      const reputasi = await this.reputasiRepository.findOne({
        where: { isActive: true },
        relations: ['parameters', 'parameters.nilaiList'],
        order: {
          parameters: {
            orderIndex: 'ASC',
            nilaiList: {
              orderIndex: 'ASC',
            },
          },
        },
      });

      if (!reputasi) {
        this.logger.warn('findActive: Tidak ada data aktif ditemukan');
        return null;
      }

      this.logger.log(`findActive: Data ditemukan - ID: ${reputasi.id}`);
      return reputasi;
    } catch (error) {
      this.logger.error(`findActive: Error - ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByYearQuarter(
    year: number,
    quarter: number,
  ): Promise<ReputasiOjk | null> {
    this.logger.log(
      `findByYearQuarter: Mencari data - Year: ${year}, Quarter: ${quarter}`,
    );

    try {
      const reputasi = await this.reputasiRepository.findOne({
        where: { year, quarter },
        relations: ['parameters', 'parameters.nilaiList'],
        order: {
          parameters: {
            orderIndex: 'ASC',
            nilaiList: {
              orderIndex: 'ASC',
            },
          },
        },
      });

      if (!reputasi) {
        this.logger.warn(
          `findByYearQuarter: Data tidak ditemukan untuk Year: ${year}, Quarter: ${quarter}`,
        );
        return null;
      }

      this.logger.log(`findByYearQuarter: Data ditemukan - ID: ${reputasi.id}`);
      return reputasi;
    } catch (error) {
      this.logger.error(
        `findByYearQuarter: Error - ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getAll() {
    this.logger.debug('getAll: Mendapatkan semua data');
    return this.reputasiRepository.find({
      relations: ['parameters'],
      order: { year: 'DESC', quarter: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateReputasiOjkDto, userId: string) {
    this.logger.log(`update: Mengupdate data - ID: ${id}`);

    const reputasi = await this.reputasiRepository.findOne({
      where: { id },
    });

    if (!reputasi) {
      this.logger.error(`update: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    if (updateDto.year !== undefined) reputasi.year = updateDto.year;
    if (updateDto.quarter !== undefined) reputasi.quarter = updateDto.quarter;
    if (updateDto.isActive !== undefined)
      reputasi.isActive = updateDto.isActive;
    if (updateDto.summary !== undefined) reputasi.summary = updateDto.summary;
    if (updateDto.isLocked !== undefined)
      reputasi.isLocked = updateDto.isLocked;
    if (updateDto.lockedBy !== undefined)
      reputasi.lockedBy = updateDto.lockedBy;
    if (updateDto.lockedAt !== undefined)
      reputasi.lockedAt = updateDto.lockedAt;
    if (updateDto.notes !== undefined) reputasi.notes = updateDto.notes;

    reputasi.updatedBy = userId;

    const result = await this.reputasiRepository.save(reputasi);
    this.logger.log(`update: Data berhasil diupdate - ID: ${result.id}`);

    return result;
  }

  async updateSummary(
    id: number,
    summaryDto: UpdateSummaryDto,
    userId: string,
  ) {
    this.logger.log(`updateSummary: Mengupdate summary - ID: ${id}`);

    const reputasi = await this.reputasiRepository.findOne({
      where: { id },
    });

    if (!reputasi) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    reputasi.summary = {
      ...reputasi.summary,
      ...summaryDto,
      computedAt: new Date(),
    };
    reputasi.updatedBy = userId;

    const result = await this.reputasiRepository.save(reputasi);
    this.logger.log(
      `updateSummary: Summary berhasil diupdate - ID: ${result.id}`,
    );
    return result;
  }

  async updateActiveStatus(id: number, isActive: boolean, userId: string) {
    this.logger.log(
      `updateActiveStatus: Mengupdate status aktif - ID: ${id}, isActive: ${isActive}`,
    );

    const reputasi = await this.reputasiRepository.findOne({
      where: { id },
    });

    if (!reputasi) {
      this.logger.error(
        `updateActiveStatus: Data dengan ID ${id} tidak ditemukan`,
      );
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    if (isActive) {
      this.logger.debug('updateActiveStatus: Menonaktifkan data lain');
      await this.reputasiRepository
        .createQueryBuilder()
        .update(ReputasiOjk)
        .set({ isActive: false })
        .execute();
    }

    reputasi.isActive = isActive;
    reputasi.updatedBy = userId;

    const result = await this.reputasiRepository.save(reputasi);
    this.logger.log(
      `updateActiveStatus: Status berhasil diupdate - ID: ${result.id}`,
    );

    return result;
  }

  async remove(id: number) {
    this.logger.log(`remove: Menghapus data - ID: ${id}`);

    const reputasi = await this.reputasiRepository.findOne({
      where: { id },
      relations: ['parameters', 'parameters.nilaiList'],
    });

    if (!reputasi) {
      this.logger.error(`remove: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const parameter of reputasi.parameters || []) {
        await queryRunner.manager.delete(ReputasiNilai, {
          parameterId: parameter.id,
        });
      }

      await queryRunner.manager.delete(ReputasiParameter, {
        reputasiOjkId: id,
      });

      await queryRunner.manager.delete(ReputasiOjk, { id });

      await queryRunner.commitTransaction();
      this.logger.log(`remove: Data berhasil dihapus - ID: ${id}`);

      return { message: 'Data berhasil dihapus', id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`remove: Error - ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // === OPERASI PARAMETER ===

  async addParameter(
    reputasiId: number,
    createParamDto: CreateParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `addParameter: Menambahkan parameter - Reputasi ID: ${reputasiId}`,
    );

    const reputasi = await this.reputasiRepository.findOne({
      where: { id: reputasiId },
    });

    if (!reputasi) {
      throw new NotFoundException(
        `Data dengan ID ${reputasiId} tidak ditemukan`,
      );
    }

    if (createParamDto.kategori) {
      const kategori = createParamDto.kategori;

      if (kategori.model === KategoriModel.OPEN_END) {
        if (!kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "open_end", jenis reksa dana wajib dipilih',
          );
        }
        if (kategori.underlying && kategori.underlying.length > 0) {
          throw new BadRequestException(
            'Untuk model "open_end", aset dasar harus kosong',
          );
        }
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "open_end"',
          );
        }
      }

      if (kategori.model === KategoriModel.TERSTRUKTUR) {
        if (kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "terstruktur", jenis harus kosong',
          );
        }

        if (!kategori.underlying || kategori.underlying.length === 0) {
          this.logger.warn(
            `addParameter: Model "terstruktur" tanpa underlying untuk parameter "${createParamDto.judul}"`,
          );
        }

        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "terstruktur"',
          );
        }
      }

      if (kategori.model === KategoriModel.TANPA_MODEL) {
        if (
          kategori.prinsip ||
          kategori.jenis ||
          (kategori.underlying && kategori.underlying.length > 0)
        ) {
          throw new BadRequestException(
            'Untuk model "tanpa_model", prinsip, jenis, dan aset dasar harus kosong',
          );
        }
      }
    }

    const lastParam = await this.parameterRepository.findOne({
      where: { reputasiOjkId: reputasiId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndex = lastParam ? lastParam.orderIndex + 1 : 0;

    const kategoriFormatted = createParamDto.kategori
      ? {
          model: createParamDto.kategori.model,
          prinsip:
            createParamDto.kategori.model !== KategoriModel.TANPA_MODEL
              ? createParamDto.kategori.prinsip
              : undefined,
          jenis:
            createParamDto.kategori.model === KategoriModel.OPEN_END
              ? createParamDto.kategori.jenis
              : undefined,
          underlying:
            createParamDto.kategori.model === KategoriModel.TERSTRUKTUR
              ? createParamDto.kategori.underlying || []
              : [],
        }
      : undefined;

    try {
      const parameter = this.parameterRepository.create({
        nomor: createParamDto.nomor || '',
        judul: createParamDto.judul.trim(),
        bobot: createParamDto.bobot,
        kategori: kategoriFormatted,
        reputasiOjkId: reputasiId,
        orderIndex: createParamDto.orderIndex ?? orderIndex,
      });

      const savedParam = await this.parameterRepository.save(parameter);

      this.logger.log(
        `addParameter: Parameter berhasil ditambahkan - ID: ${savedParam.id}`,
      );

      await this.reputasiRepository.update(reputasiId, {
        updatedBy: userId,
        updatedAt: new Date(),
      });

      return savedParam;
    } catch (error: any) {
      this.logger.error('addParameter - Error saving parameter:', error);

      if (error.code === '23502' || error.message.includes('null value')) {
        throw new BadRequestException(
          'Error validasi: Pastikan semua field yang diperlukan terisi sesuai model yang dipilih',
        );
      }

      throw error;
    }
  }

  async updateParameter(
    reputasiId: number,
    parameterId: number,
    updateParamDto: UpdateParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `updateParameter: Mengupdate parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, reputasiOjkId: reputasiId },
    });

    if (!parameter) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    if (updateParamDto.nomor !== undefined)
      parameter.nomor = updateParamDto.nomor;
    if (updateParamDto.judul !== undefined)
      parameter.judul = updateParamDto.judul.trim();
    if (updateParamDto.bobot !== undefined)
      parameter.bobot = updateParamDto.bobot;
    if (updateParamDto.orderIndex !== undefined)
      parameter.orderIndex = updateParamDto.orderIndex;

    if (updateParamDto.kategori) {
      const kategori = updateParamDto.kategori;

      if (kategori.model === KategoriModel.TERSTRUKTUR) {
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "terstruktur"',
          );
        }

        if (!kategori.underlying || kategori.underlying.length === 0) {
          this.logger.warn(
            `updateParameter: Model "terstruktur" tanpa underlying untuk parameter "${parameter.judul}"`,
          );
        }

        if (kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "terstruktur", jenis harus kosong',
          );
        }
      }

      if (kategori.model === KategoriModel.OPEN_END) {
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "open_end"',
          );
        }
        if (!kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "open_end", jenis reksa dana wajib dipilih',
          );
        }
        if (kategori.underlying && kategori.underlying.length > 0) {
          throw new BadRequestException(
            'Untuk model "open_end", aset dasar harus kosong',
          );
        }
      }

      if (kategori.model === KategoriModel.TANPA_MODEL) {
        if (
          kategori.prinsip ||
          kategori.jenis ||
          (kategori.underlying && kategori.underlying.length > 0)
        ) {
          throw new BadRequestException(
            'Untuk model "tanpa_model", prinsip, jenis, dan aset dasar harus kosong',
          );
        }
      }

      parameter.kategori = {
        model: kategori.model,
        prinsip:
          kategori.model !== KategoriModel.TANPA_MODEL
            ? kategori.prinsip
            : undefined,
        jenis:
          kategori.model === KategoriModel.OPEN_END
            ? kategori.jenis
            : undefined,
        underlying:
          kategori.model === KategoriModel.TERSTRUKTUR
            ? kategori.underlying || []
            : [],
      };
    }

    try {
      const updated = await this.parameterRepository.save(parameter);

      await this.reputasiRepository.update(reputasiId, {
        updatedBy: userId,
        updatedAt: new Date(),
      });

      this.logger.log(
        `updateParameter: Parameter berhasil diupdate - ID: ${updated.id}`,
      );
      return updated;
    } catch (error: any) {
      this.logger.error('updateParameter - Error:', error);
      throw error;
    }
  }

  async reorderParameters(
    reputasiId: number,
    reorderDto: ReorderParametersDto,
  ) {
    this.logger.log(
      `reorderParameters: Mengurutkan parameter - Reputasi ID: ${reputasiId}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < reorderDto.parameterIds.length; i++) {
        const parameterId = reorderDto.parameterIds[i];
        await queryRunner.manager.update(
          ReputasiParameter,
          { id: parameterId, reputasiOjkId: reputasiId },
          { orderIndex: i },
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `reorderParameters: Parameter berhasil diurutkan - Reputasi ID: ${reputasiId}`,
      );

      return { message: 'Parameter berhasil diurutkan' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `reorderParameters: Error - ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async copyParameter(reputasiId: number, parameterId: number, userId: string) {
    this.logger.log(`copyParameter: Menyalin parameter - ID: ${parameterId}`);

    const originalParam = await this.parameterRepository.findOne({
      where: { id: parameterId, reputasiOjkId: reputasiId },
      relations: ['nilaiList'],
    });

    if (!originalParam) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    const lastParam = await this.parameterRepository.findOne({
      where: { reputasiOjkId: reputasiId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndex = lastParam ? lastParam.orderIndex + 1 : 0;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newParam = this.parameterRepository.create({
        nomor: originalParam.nomor,
        judul: `${originalParam.judul} (Copy)`,
        bobot: originalParam.bobot,
        kategori: originalParam.kategori,
        reputasiOjkId: reputasiId,
        orderIndex,
      });

      const savedParam = await queryRunner.manager.save(
        ReputasiParameter,
        newParam,
      );

      if (originalParam.nilaiList && originalParam.nilaiList.length > 0) {
        const nilaiPromises = originalParam.nilaiList.map(async (nilai) => {
          const newNilai = {
            nomor: nilai.nomor,
            judul: nilai.judul,
            bobot: nilai.bobot,
            portofolio: nilai.portofolio,
            keterangan: nilai.keterangan,
            riskindikator: nilai.riskindikator,
            parameterId: savedParam.id,
            orderIndex: nilai.orderIndex,
          };
          return queryRunner.manager.save(ReputasiNilai, newNilai);
        });

        await Promise.all(nilaiPromises);
      }

      await queryRunner.commitTransaction();

      await this.reputasiRepository.update(reputasiId, {
        updatedBy: userId,
        updatedAt: new Date(),
      });

      this.logger.log(
        `copyParameter: Parameter berhasil disalin - New ID: ${savedParam.id}`,
      );
      return savedParam;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`copyParameter: Error - ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removeParameter(
    reputasiId: number,
    parameterId: number,
    userId: string,
  ) {
    this.logger.log(
      `removeParameter: Menghapus parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, reputasiOjkId: reputasiId },
      relations: ['nilaiList'],
    });

    if (!parameter) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (parameter.nilaiList && parameter.nilaiList.length > 0) {
        await queryRunner.manager.delete(ReputasiNilai, {
          parameterId: parameterId,
        });
      }

      await queryRunner.manager.delete(ReputasiParameter, { id: parameterId });

      await queryRunner.commitTransaction();

      await this.reputasiRepository.update(reputasiId, {
        updatedBy: userId,
        updatedAt: new Date(),
      });

      this.logger.log(
        `removeParameter: Parameter berhasil dihapus - ID: ${parameterId}`,
      );
      return { message: 'Parameter berhasil dihapus', parameterId };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `removeParameter: Error - ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // === OPERASI NILAI ===

  async addNilai(
    reputasiId: number,
    parameterId: number,
    createNilaiDto: CreateNilaiDto,
    userId: string,
  ) {
    this.logger.log(
      `addNilai: Menambahkan nilai - Parameter ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, reputasiOjkId: reputasiId },
    });

    if (!parameter) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    const judulText = createNilaiDto.judul?.text;
    if (!judulText || judulText.trim() === '') {
      throw new BadRequestException('Judul nilai wajib diisi');
    }

    const lastNilai = await this.nilaiRepository.findOne({
      where: { parameterId: parameterId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndex = lastNilai ? lastNilai.orderIndex + 1 : 0;

    const nilai = {
      nomor: createNilaiDto.nomor || '',
      judul: {
        type: createNilaiDto.judul?.type || JudulType.TANPA_FAKTOR,
        text: judulText.trim(),
        value: createNilaiDto.judul?.value ?? null,
        pembilang: createNilaiDto.judul?.pembilang || '',
        valuePembilang: createNilaiDto.judul?.valuePembilang ?? null,
        penyebut: createNilaiDto.judul?.penyebut || '',
        valuePenyebut: createNilaiDto.judul?.valuePenyebut ?? null,
        formula: createNilaiDto.judul?.formula || '',
        percent: createNilaiDto.judul?.percent || false,
      },
      bobot: createNilaiDto.bobot,
      portofolio: createNilaiDto.portofolio || '',
      keterangan: createNilaiDto.keterangan || '',
      riskindikator: createNilaiDto.riskindikator || {
        low: '',
        lowToModerate: '',
        moderate: '',
        moderateToHigh: '',
        high: '',
      },
      parameterId: parameterId,
      orderIndex: createNilaiDto.orderIndex ?? orderIndex,
    };

    const savedNilai = await this.nilaiRepository.save(nilai);

    await this.reputasiRepository.update(reputasiId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `addNilai: Nilai berhasil ditambahkan - ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async updateNilai(
    reputasiId: number,
    parameterId: number,
    nilaiId: number,
    updateNilaiDto: UpdateNilaiDto,
    userId: string,
  ) {
    this.logger.log(`updateNilai: Mengupdate nilai - ID: ${nilaiId}`);

    const nilai = await this.nilaiRepository.findOne({
      where: { id: nilaiId, parameterId: parameterId },
      relations: ['parameter'],
    });

    if (!nilai) {
      throw new NotFoundException(`Nilai dengan ID ${nilaiId} tidak ditemukan`);
    }

    if (nilai.parameter.reputasiOjkId !== reputasiId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam reputasi yang dimaksud',
      );
    }

    if (updateNilaiDto.nomor !== undefined) nilai.nomor = updateNilaiDto.nomor;
    if (updateNilaiDto.bobot !== undefined) nilai.bobot = updateNilaiDto.bobot;
    if (updateNilaiDto.portofolio !== undefined)
      nilai.portofolio = updateNilaiDto.portofolio;
    if (updateNilaiDto.keterangan !== undefined)
      nilai.keterangan = updateNilaiDto.keterangan;
    if (updateNilaiDto.orderIndex !== undefined)
      nilai.orderIndex = updateNilaiDto.orderIndex;

    if (updateNilaiDto.riskindikator) {
      nilai.riskindikator = {
        ...nilai.riskindikator,
        ...updateNilaiDto.riskindikator,
      };
    }

    if (updateNilaiDto.judul) {
      nilai.judul = {
        ...nilai.judul,
        ...updateNilaiDto.judul,
        ...(updateNilaiDto.judul.text && {
          text: updateNilaiDto.judul.text.trim(),
        }),
      };
    }

    const updated = await this.nilaiRepository.save(nilai);

    await this.reputasiRepository.update(reputasiId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(`updateNilai: Nilai berhasil diupdate - ID: ${updated.id}`);
    return updated;
  }

  async reorderNilai(parameterId: number, reorderDto: ReorderNilaiDto) {
    this.logger.log(
      `reorderNilai: Mengurutkan nilai - Parameter ID: ${parameterId}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < reorderDto.nilaiIds.length; i++) {
        const nilaiId = reorderDto.nilaiIds[i];
        await queryRunner.manager.update(
          ReputasiNilai,
          { id: nilaiId, parameterId: parameterId },
          { orderIndex: i },
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `reorderNilai: Nilai berhasil diurutkan - Parameter ID: ${parameterId}`,
      );

      return { message: 'Nilai berhasil diurutkan' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`reorderNilai: Error - ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async copyNilai(
    reputasiId: number,
    parameterId: number,
    nilaiId: number,
    userId: string,
  ) {
    this.logger.log(`copyNilai: Menyalin nilai - ID: ${nilaiId}`);

    const originalNilai = await this.nilaiRepository.findOne({
      where: { id: nilaiId, parameterId: parameterId },
    });

    if (!originalNilai) {
      throw new NotFoundException(`Nilai dengan ID ${nilaiId} tidak ditemukan`);
    }

    const lastNilai = await this.nilaiRepository.findOne({
      where: { parameterId: parameterId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndex = lastNilai ? lastNilai.orderIndex + 1 : 0;

    const newNilai = {
      nomor: originalNilai.nomor,
      judul: {
        ...originalNilai.judul,
        text: `${originalNilai.judul?.text || ''} (Copy)`,
      },
      bobot: originalNilai.bobot,
      portofolio: originalNilai.portofolio,
      keterangan: originalNilai.keterangan,
      riskindikator: originalNilai.riskindikator,
      parameterId: parameterId,
      orderIndex,
    };

    const savedNilai = await this.nilaiRepository.save(newNilai);

    await this.reputasiRepository.update(reputasiId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `copyNilai: Nilai berhasil disalin - New ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async removeNilai(
    reputasiId: number,
    parameterId: number,
    nilaiId: number,
    userId: string,
  ) {
    this.logger.log(`removeNilai: Menghapus nilai - ID: ${nilaiId}`);

    const nilai = await this.nilaiRepository.findOne({
      where: { id: nilaiId, parameterId: parameterId },
      relations: ['parameter'],
    });

    if (!nilai) {
      throw new NotFoundException(`Nilai dengan ID ${nilaiId} tidak ditemukan`);
    }

    if (nilai.parameter.reputasiOjkId !== reputasiId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam reputasi yang dimaksud',
      );
    }

    await this.nilaiRepository.delete({ id: nilaiId });

    await this.reputasiRepository.update(reputasiId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(`removeNilai: Nilai berhasil dihapus - ID: ${nilaiId}`);
    return { message: 'Nilai berhasil dihapus', nilaiId };
  }

  // === REFERENCE DATA ===

  async getReferences(type?: string) {
    this.logger.debug(
      `getReferences: Mendapatkan referensi - Type: ${type || 'all'}`,
    );

    const query = this.referenceRepository
      .createQueryBuilder('ref')
      .where('ref.isActive = :isActive', { isActive: true });

    if (type) {
      query.andWhere('ref.type = :type', { type });
    }

    query.orderBy('ref.order', 'ASC');

    return query.getMany();
  }

  // === VALIDASI TAMBAHAN UNTUK MODEL TERSTRUKTUR ===
  async validateModelTerstruktur(reputasiId: number): Promise<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    const result = {
      isValid: true,
      warnings: [] as string[],
      errors: [] as string[],
    };

    const reputasi = await this.reputasiRepository.findOne({
      where: { id: reputasiId },
      relations: ['parameters'],
    });

    if (!reputasi) {
      result.errors.push(`Data dengan ID ${reputasiId} tidak ditemukan`);
      result.isValid = false;
      return result;
    }

    const terstrukturParams =
      reputasi.parameters?.filter(
        (param) => param.kategori?.model === KategoriModel.TERSTRUKTUR,
      ) || [];

    terstrukturParams.forEach((param) => {
      if (!param.kategori?.prinsip) {
        result.errors.push(
          `Parameter "${param.judul}" (model terstruktur) harus memiliki prinsip`,
        );
        result.isValid = false;
      }

      if (
        !param.kategori?.underlying ||
        param.kategori.underlying.length === 0
      ) {
        result.warnings.push(
          `Parameter "${param.judul}" (model terstruktur) tidak memiliki aset dasar`,
        );
      }

      if (param.kategori?.jenis) {
        result.errors.push(
          `Parameter "${param.judul}" (model terstruktur) seharusnya tidak memiliki jenis`,
        );
        result.isValid = false;
      }
    });

    this.logger.log(
      `validateModelTerstruktur: Validasi selesai - ${result.errors.length} errors, ${result.warnings.length} warnings`,
    );

    return result;
  }

  // === IMPORT/EXPORT ===

  async exportToExcel(reputasiId: number) {
    this.logger.log(`exportToExcel: Mengekspor ke Excel - ID: ${reputasiId}`);

    const reputasi = await this.reputasiRepository.findOne({
      where: { id: reputasiId },
      relations: ['parameters', 'parameters.nilaiList'],
      order: {
        parameters: {
          orderIndex: 'ASC',
          nilaiList: {
            orderIndex: 'ASC',
          },
        },
      },
    });

    if (!reputasi) {
      throw new NotFoundException(
        `Data dengan ID ${reputasiId} tidak ditemukan`,
      );
    }

    const exportData = {
      metadata: {
        year: reputasi.year,
        quarter: reputasi.quarter,
        exportedAt: new Date().toISOString(),
        totalParameters: reputasi.parameters?.length || 0,
        totalNilai:
          reputasi.parameters?.reduce(
            (total, param) => total + (param.nilaiList?.length || 0),
            0,
          ) || 0,
      },
      parameters:
        reputasi.parameters?.map((param) => ({
          id: param.id,
          nomor: param.nomor,
          judul: param.judul,
          bobot: Number(param.bobot),
          kategori: param.kategori,
          orderIndex: param.orderIndex,
          nilaiList:
            param.nilaiList?.map((nilai) => ({
              id: nilai.id,
              nomor: nilai.nomor,
              judul: nilai.judul,
              bobot: Number(nilai.bobot),
              portofolio: nilai.portofolio,
              keterangan: nilai.keterangan,
              riskindikator: nilai.riskindikator,
              orderIndex: nilai.orderIndex,
            })) || [],
        })) || [],
    };

    this.logger.log(
      `exportToExcel: Data berhasil diekspor - Jumlah parameter: ${exportData.metadata.totalParameters}`,
    );
    return exportData;
  }

  async importFromExcel(importData: any, userId: string) {
    this.logger.log('importFromExcel: Mengimpor data dari Excel');

    if (!importData.parameters || !Array.isArray(importData.parameters)) {
      throw new BadRequestException('Format data tidak valid');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        ReputasiOjk,
        { isActive: true },
        { isActive: false },
      );

      const reputasi = {
        year: importData.metadata?.year || new Date().getFullYear(),
        quarter: importData.metadata?.quarter || 1,
        summary: importData.summary,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
      };

      const savedReputasi = await queryRunner.manager.save(
        ReputasiOjk,
        reputasi,
      );

      for (let i = 0; i < importData.parameters.length; i++) {
        const paramData = importData.parameters[i];

        const parameter = {
          nomor: paramData.nomor || '',
          judul: paramData.judul || '',
          bobot: paramData.bobot || 0,
          kategori: paramData.kategori || {
            model: '' as KategoriModel,
            prinsip: '' as KategoriPrinsip,
            jenis: '' as KategoriJenis,
            underlying: [],
          },
          reputasiOjkId: savedReputasi.id,
          orderIndex: paramData.orderIndex || i,
        };

        const savedParam = await queryRunner.manager.save(
          ReputasiParameter,
          parameter,
        );

        if (paramData.nilaiList && Array.isArray(paramData.nilaiList)) {
          for (let j = 0; j < paramData.nilaiList.length; j++) {
            const nilaiData = paramData.nilaiList[j];

            const nilai = {
              nomor: nilaiData.nomor || '',
              judul: nilaiData.judul || {
                type: JudulType.TANPA_FAKTOR,
                text: '',
                value: null,
                pembilang: '',
                valuePembilang: null,
                penyebut: '',
                valuePenyebut: null,
                formula: '',
                percent: false,
              },
              bobot: nilaiData.bobot || 0,
              portofolio: nilaiData.portofolio || '',
              keterangan: nilaiData.keterangan || '',
              riskindikator: nilaiData.riskindikator || {
                low: '',
                lowToModerate: '',
                moderate: '',
                moderateToHigh: '',
                high: '',
              },
              parameterId: savedParam.id,
              orderIndex: nilaiData.orderIndex || j,
            };

            await queryRunner.manager.save(ReputasiNilai, nilai);
          }
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `importFromExcel: Data berhasil diimpor - ID: ${savedReputasi.id}, Jumlah parameter: ${importData.parameters.length}`,
      );
      return savedReputasi;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `importFromExcel: Error - ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
