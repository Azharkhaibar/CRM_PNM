// src/ojk/likuiditas-produk/likuiditas-produk-ojk/likuiditas-produk-ojk.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LikuiditasProdukOjk } from './entities/likuiditas-produk-ojk.entity';
import { LikuiditasParameter } from './entities/likuiditas-parameter.entity';
import { LikuiditasNilai } from './entities/likuditas-nilai.entity';
import { InherentReferenceLikuiditas } from './entities/likuditas-inherent-refrences.entity';
// import {
//   CreateLikuiditasProdukInherentDto,
//   UpdateLikuiditasProdukInherentDto,
//   CreateLikuiditasParameterDto,
//   UpdateLikuiditasParameterDto,
//   CreateLikuiditasNilaiDto,
//   UpdateLikuiditasNilaiDto,
//   ReorderLikuiditasParametersDto,
//   ReorderLikuiditasNilaiDto,
//   UpdateLikuiditasSummaryDto,
//   LikuiditasKategoriModel,
//   LikuiditasKategoriPrinsip,
//   LikuiditasKategoriJenis,
//   LikuiditasJudulType,
// } from './dto/likuiditas-produk-inherent.dto';

import {
  CreateLikuiditasProdukInherentDto,
  UpdateLikuiditasProdukInherentDto,
  CreateLikuiditasParameterDto,
  UpdateLikuiditasParameterDto,
  CreateLikuiditasNilaiDto,
  UpdateLikuiditasNilaiDto,
  ReorderLikuiditasNilaiDto,
  ReorderLikuiditasParametersDto,
  UpdateLikuiditasSummaryDto,
  LikuiditasKategoriModel,
  LikuiditasKategoriJenis,
  LikuiditasKategoriPrinsip,
  LikuiditasJudulType,
} from './dto/likuditas-produk-inherent.dto';

@Injectable()
export class LikuiditasProdukOjkService {
  private readonly logger = new Logger(LikuiditasProdukOjkService.name);

  constructor(
    @InjectRepository(LikuiditasProdukOjk)
    private inherentRepository: Repository<LikuiditasProdukOjk>,
    @InjectRepository(LikuiditasParameter)
    private parameterRepository: Repository<LikuiditasParameter>,
    @InjectRepository(LikuiditasNilai)
    private nilaiRepository: Repository<LikuiditasNilai>,
    @InjectRepository(InherentReferenceLikuiditas)
    private referenceRepository: Repository<InherentReferenceLikuiditas>,
    private dataSource: DataSource,
  ) {}

  // === CRUD UTAMA (LikuiditasProdukOjk) ===

  async create(createDto: CreateLikuiditasProdukInherentDto, userId: string) {
    try {
      const existing = await this.inherentRepository.findOne({
        where: { year: createDto.year, quarter: createDto.quarter },
      });

      if (existing) {
        this.logger.warn(
          `create: Data sudah ada untuk year ${createDto.year} quarter ${createDto.quarter}`,
        );
        return existing;
      }

      const inherent = this.inherentRepository.create({
        year: createDto.year,
        quarter: createDto.quarter,
        isActive: createDto.isActive ?? true,
        createdBy: userId,
        updatedBy: userId,
        version: createDto.version || '1.0.0',
      });

      const saved = await this.inherentRepository.save(inherent);
      this.logger.log(`create: Data berhasil dibuat - ID: ${saved.id}`);

      return saved;
    } catch (error) {
      this.logger.error(
        `Error creating LikuiditasProdukOjk: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActive(): Promise<LikuiditasProdukOjk | null> {
    this.logger.debug('findActive: Mencari data aktif');

    try {
      const inherent = await this.inherentRepository.findOne({
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

      if (!inherent) {
        this.logger.warn('findActive: Tidak ada data aktif ditemukan');
        return null;
      }

      this.logger.log(`findActive: Data ditemukan - ID: ${inherent.id}`);
      return inherent;
    } catch (error) {
      this.logger.error(`findActive: Error - ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByYearQuarter(
    year: number,
    quarter: number,
  ): Promise<LikuiditasProdukOjk | null> {
    this.logger.log(
      `findByYearQuarter: Mencari data - Year: ${year}, Quarter: ${quarter}`,
    );

    try {
      const inherent = await this.inherentRepository.findOne({
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

      if (!inherent) {
        this.logger.warn(
          `findByYearQuarter: Data tidak ditemukan untuk Year: ${year}, Quarter: ${quarter}`,
        );
        return null;
      }

      this.logger.log(`findByYearQuarter: Data ditemukan - ID: ${inherent.id}`);
      return inherent;
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
    return this.inherentRepository.find({
      relations: ['parameters'],
      order: { year: 'DESC', quarter: 'DESC' },
    });
  }

  async update(
    id: number,
    updateDto: UpdateLikuiditasProdukInherentDto,
    userId: string,
  ) {
    this.logger.log(`update: Mengupdate data - ID: ${id}`);

    const inherent = await this.inherentRepository.findOne({
      where: { id },
    });

    if (!inherent) {
      this.logger.error(`update: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Update field yang ada
    if (updateDto.year !== undefined) inherent.year = updateDto.year;
    if (updateDto.quarter !== undefined) inherent.quarter = updateDto.quarter;
    if (updateDto.isActive !== undefined)
      inherent.isActive = updateDto.isActive;
    if (updateDto.summary !== undefined) inherent.summary = updateDto.summary;
    if (updateDto.isLocked !== undefined)
      inherent.isLocked = updateDto.isLocked;
    if (updateDto.lockedBy !== undefined)
      inherent.lockedBy = updateDto.lockedBy;
    if (updateDto.lockedAt !== undefined)
      inherent.lockedAt = updateDto.lockedAt;
    if (updateDto.notes !== undefined) inherent.notes = updateDto.notes;

    inherent.updatedBy = userId;

    const result = await this.inherentRepository.save(inherent);
    this.logger.log(`update: Data berhasil diupdate - ID: ${result.id}`);

    return result;
  }

  async updateSummary(
    id: number,
    summaryDto: UpdateLikuiditasSummaryDto,
    userId: string,
  ) {
    this.logger.log(`updateSummary: Mengupdate summary - ID: ${id}`);

    const inherent = await this.inherentRepository.findOne({
      where: { id },
    });

    if (!inherent) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    inherent.summary = {
      ...inherent.summary,
      ...summaryDto,
      computedAt: new Date(),
    };
    inherent.updatedBy = userId;

    const result = await this.inherentRepository.save(inherent);
    this.logger.log(
      `updateSummary: Summary berhasil diupdate - ID: ${result.id}`,
    );
    return result;
  }

  async updateActiveStatus(id: number, isActive: boolean, userId: string) {
    this.logger.log(
      `updateActiveStatus: Mengupdate status aktif - ID: ${id}, isActive: ${isActive}`,
    );

    const inherent = await this.inherentRepository.findOne({
      where: { id },
    });

    if (!inherent) {
      this.logger.error(
        `updateActiveStatus: Data dengan ID ${id} tidak ditemukan`,
      );
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Jika mengaktifkan satu, nonaktifkan yang lain
    if (isActive) {
      this.logger.debug('updateActiveStatus: Menonaktifkan data lain');
      await this.inherentRepository
        .createQueryBuilder()
        .update(LikuiditasProdukOjk)
        .set({ isActive: false })
        .execute();
    }

    inherent.isActive = isActive;
    inherent.updatedBy = userId;

    const result = await this.inherentRepository.save(inherent);
    this.logger.log(
      `updateActiveStatus: Status berhasil diupdate - ID: ${result.id}`,
    );

    return result;
  }

  async remove(id: number) {
    this.logger.log(`remove: Menghapus data - ID: ${id}`);

    const inherent = await this.inherentRepository.findOne({
      where: { id },
      relations: ['parameters', 'parameters.nilaiList'],
    });

    if (!inherent) {
      this.logger.error(`remove: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Gunakan transaction untuk menghapus semua relasi
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Hapus semua nilai terlebih dahulu
      for (const parameter of inherent.parameters || []) {
        await queryRunner.manager.delete(LikuiditasNilai, {
          parameterId: parameter.id,
        });
      }

      // Hapus semua parameter
      await queryRunner.manager.delete(LikuiditasParameter, {
        likuiditasProdukOjkId: id,
      });

      // Hapus inherent
      await queryRunner.manager.delete(LikuiditasProdukOjk, { id });

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
    inherentId: number,
    createParamDto: CreateLikuiditasParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `addParameter: Menambahkan parameter - Inherent ID: ${inherentId}`,
    );

    const inherent = await this.inherentRepository.findOne({
      where: { id: inherentId },
    });

    if (!inherent) {
      throw new NotFoundException(
        `Data dengan ID ${inherentId} tidak ditemukan`,
      );
    }

    // =========== VALIDASI YANG DIRELAKSASI UNTUK MODEL KOMPREHENSIF ===========
    if (createParamDto.kategori) {
      const kategori = createParamDto.kategori;

      // Validasi untuk model 'standar'
      if (kategori.model === LikuiditasKategoriModel.STANDAR) {
        if (!kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "standar", jenis likuiditas wajib dipilih',
          );
        }
        if (kategori.underlying && kategori.underlying.length > 0) {
          throw new BadRequestException(
            'Untuk model "standar", underlying harus kosong',
          );
        }
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "standar"',
          );
        }
      }

      // Validasi untuk model 'komprehensif' - DIRELAKSASI
      if (kategori.model === LikuiditasKategoriModel.KOMPREHENSIF) {
        if (kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "komprehensif", jenis harus kosong',
          );
        }

        // VALIDASI DIRELAKSASI: Tidak memaksa underlying harus ada
        if (!kategori.underlying || kategori.underlying.length === 0) {
          this.logger.warn(
            `addParameter: Model "komprehensif" tanpa underlying untuk parameter "${createParamDto.judul}"`,
          );
        }

        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "komprehensif"',
          );
        }
      }

      // Validasi untuk model 'tanpa_model'
      if (kategori.model === LikuiditasKategoriModel.TANPA_MODEL) {
        if (
          kategori.prinsip ||
          kategori.jenis ||
          (kategori.underlying && kategori.underlying.length > 0)
        ) {
          throw new BadRequestException(
            'Untuk model "tanpa_model", prinsip, jenis, dan underlying harus kosong',
          );
        }
      }
    }

    // Cari orderIndex terakhir
    const lastParam = await this.parameterRepository.findOne({
      where: { likuiditasProdukOjkId: inherentId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndex = lastParam ? lastParam.orderIndex + 1 : 0;

    // Format kategori dengan validasi yang lebih fleksibel untuk komprehensif
    const kategoriFormatted = createParamDto.kategori
      ? {
          model: createParamDto.kategori.model,
          prinsip:
            createParamDto.kategori.model !==
            LikuiditasKategoriModel.TANPA_MODEL
              ? createParamDto.kategori.prinsip
              : undefined,
          jenis:
            createParamDto.kategori.model === LikuiditasKategoriModel.STANDAR
              ? createParamDto.kategori.jenis
              : undefined,
          underlying:
            createParamDto.kategori.model ===
            LikuiditasKategoriModel.KOMPREHENSIF
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
        likuiditasProdukOjkId: inherentId,
        orderIndex: createParamDto.orderIndex ?? orderIndex,
      });

      const savedParam = await this.parameterRepository.save(parameter);

      this.logger.log(
        `addParameter: Parameter berhasil ditambahkan - ID: ${savedParam.id}`,
      );

      // Update timestamp inherent
      await this.inherentRepository.update(inherentId, {
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
    inherentId: number,
    parameterId: number,
    updateParamDto: UpdateLikuiditasParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `updateParameter: Mengupdate parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, likuiditasProdukOjkId: inherentId },
    });

    if (!parameter) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    // Update field yang ada
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

      // Validasi kategori untuk update dengan relaksasi untuk komprehensif
      if (kategori.model === LikuiditasKategoriModel.KOMPREHENSIF) {
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "komprehensif"',
          );
        }

        // VALIDASI DIRELAKSASI: Hanya warning jika tidak ada underlying
        if (!kategori.underlying || kategori.underlying.length === 0) {
          this.logger.warn(
            `updateParameter: Model "komprehensif" tanpa underlying untuk parameter "${parameter.judul}"`,
          );
        }

        if (kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "komprehensif", jenis harus kosong',
          );
        }
      }

      if (kategori.model === LikuiditasKategoriModel.STANDAR) {
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "standar"',
          );
        }
        if (!kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "standar", jenis likuiditas wajib dipilih',
          );
        }
        if (kategori.underlying && kategori.underlying.length > 0) {
          throw new BadRequestException(
            'Untuk model "standar", underlying harus kosong',
          );
        }
      }

      if (kategori.model === LikuiditasKategoriModel.TANPA_MODEL) {
        if (
          kategori.prinsip ||
          kategori.jenis ||
          (kategori.underlying && kategori.underlying.length > 0)
        ) {
          throw new BadRequestException(
            'Untuk model "tanpa_model", prinsip, jenis, dan underlying harus kosong',
          );
        }
      }

      // Update kategori dengan format yang benar
      parameter.kategori = {
        model: kategori.model,
        prinsip:
          kategori.model !== LikuiditasKategoriModel.TANPA_MODEL
            ? kategori.prinsip
            : undefined,
        jenis:
          kategori.model === LikuiditasKategoriModel.STANDAR
            ? kategori.jenis
            : undefined,
        underlying:
          kategori.model === LikuiditasKategoriModel.KOMPREHENSIF
            ? kategori.underlying || []
            : [],
      };
    }

    try {
      const updated = await this.parameterRepository.save(parameter);

      // Update timestamp inherent
      await this.inherentRepository.update(inherentId, {
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
    inherentId: number,
    reorderDto: ReorderLikuiditasParametersDto,
  ) {
    this.logger.log(
      `reorderParameters: Mengurutkan parameter - Inherent ID: ${inherentId}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < reorderDto.parameterIds.length; i++) {
        const parameterId = reorderDto.parameterIds[i];
        await queryRunner.manager.update(
          LikuiditasParameter,
          { id: parameterId, likuiditasProdukOjkId: inherentId },
          { orderIndex: i },
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `reorderParameters: Parameter berhasil diurutkan - Inherent ID: ${inherentId}`,
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

  async copyParameter(inherentId: number, parameterId: number, userId: string) {
    this.logger.log(`copyParameter: Menyalin parameter - ID: ${parameterId}`);

    const originalParam = await this.parameterRepository.findOne({
      where: { id: parameterId, likuiditasProdukOjkId: inherentId },
      relations: ['nilaiList'],
    });

    if (!originalParam) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    // Cari orderIndex terakhir
    const lastParam = await this.parameterRepository.findOne({
      where: { likuiditasProdukOjkId: inherentId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndex = lastParam ? lastParam.orderIndex + 1 : 0;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buat parameter baru
      const newParam = this.parameterRepository.create({
        nomor: originalParam.nomor,
        judul: `${originalParam.judul} (Copy)`,
        bobot: originalParam.bobot,
        kategori: originalParam.kategori,
        likuiditasProdukOjkId: inherentId,
        orderIndex,
      });

      const savedParam = await queryRunner.manager.save(
        LikuiditasParameter,
        newParam,
      );

      // Copy semua nilai jika ada
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
          return queryRunner.manager.save(LikuiditasNilai, newNilai);
        });

        await Promise.all(nilaiPromises);
      }

      await queryRunner.commitTransaction();

      // Update timestamp inherent
      await this.inherentRepository.update(inherentId, {
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
    inherentId: number,
    parameterId: number,
    userId: string,
  ) {
    this.logger.log(
      `removeParameter: Menghapus parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, likuiditasProdukOjkId: inherentId },
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
      // Hapus semua nilai terlebih dahulu
      if (parameter.nilaiList && parameter.nilaiList.length > 0) {
        await queryRunner.manager.delete(LikuiditasNilai, {
          parameterId: parameterId,
        });
      }

      // Hapus parameter
      await queryRunner.manager.delete(LikuiditasParameter, {
        id: parameterId,
      });

      await queryRunner.commitTransaction();

      // Update timestamp inherent
      await this.inherentRepository.update(inherentId, {
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
    inherentId: number,
    parameterId: number,
    createNilaiDto: CreateLikuiditasNilaiDto,
    userId: string,
  ) {
    this.logger.log(
      `addNilai: Menambahkan nilai - Parameter ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, likuiditasProdukOjkId: inherentId },
    });

    if (!parameter) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    // Validasi judul.text
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
        type: createNilaiDto.judul?.type || LikuiditasJudulType.TANPA_FAKTOR,
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

    // Update timestamp inherent
    await this.inherentRepository.update(inherentId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `addNilai: Nilai berhasil ditambahkan - ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async updateNilai(
    inherentId: number,
    parameterId: number,
    nilaiId: number,
    updateNilaiDto: UpdateLikuiditasNilaiDto,
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

    // Cek apakah parameter milik inherent yang benar
    if (nilai.parameter.likuiditasProdukOjkId !== inherentId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam inherent yang dimaksud',
      );
    }

    // Update field yang ada
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

    // Update judul object secara parsial
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

    // Update timestamp inherent
    await this.inherentRepository.update(inherentId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(`updateNilai: Nilai berhasil diupdate - ID: ${updated.id}`);
    return updated;
  }

  async reorderNilai(
    parameterId: number,
    reorderDto: ReorderLikuiditasNilaiDto,
  ) {
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
          LikuiditasNilai,
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
    inherentId: number,
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

    // Update timestamp inherent
    await this.inherentRepository.update(inherentId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `copyNilai: Nilai berhasil disalin - New ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async removeNilai(
    inherentId: number,
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

    // Cek apakah parameter milik inherent yang benar
    if (nilai.parameter.likuiditasProdukOjkId !== inherentId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam inherent yang dimaksud',
      );
    }

    await this.nilaiRepository.delete({ id: nilaiId });

    // Update timestamp inherent
    await this.inherentRepository.update(inherentId, {
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

  // === VALIDASI UNTUK MODEL KOMPREHENSIF ===
  async validateModelLikuiditas(id: number): Promise<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    const result = {
      isValid: true,
      warnings: [] as string[],
      errors: [] as string[],
    };

    const inherent = await this.inherentRepository.findOne({
      where: { id },
      relations: ['parameters'],
    });

    if (!inherent) {
      result.errors.push(`Data dengan ID ${id} tidak ditemukan`);
      result.isValid = false;
      return result;
    }

    // Cek parameter dengan model komprehensif
    const komprehensifParams =
      inherent.parameters?.filter(
        (param) =>
          param.kategori?.model === LikuiditasKategoriModel.KOMPREHENSIF,
      ) || [];

    komprehensifParams.forEach((param, index) => {
      // Validasi prinsip
      if (!param.kategori?.prinsip) {
        result.errors.push(
          `Parameter "${param.judul}" (model komprehensif) harus memiliki prinsip`,
        );
        result.isValid = false;
      }

      // Validasi underlying - hanya warning jika kosong
      if (
        !param.kategori?.underlying ||
        param.kategori.underlying.length === 0
      ) {
        result.warnings.push(
          `Parameter "${param.judul}" (model komprehensif) tidak memiliki underlying`,
        );
      }

      // Validasi jenis - harus kosong
      if (param.kategori?.jenis) {
        result.errors.push(
          `Parameter "${param.judul}" (model komprehensif) seharusnya tidak memiliki jenis`,
        );
        result.isValid = false;
      }
    });

    this.logger.log(
      `validateModelLikuiditas: Validasi selesai - ${result.errors.length} errors, ${result.warnings.length} warnings`,
    );

    return result;
  }

  // === STATISTICS ===

  async getStatistics(id: number) {
    this.logger.log(`getStatistics: Mendapatkan statistik - ID: ${id}`);

    const inherent = await this.inherentRepository.findOne({
      where: { id },
      relations: ['parameters', 'parameters.nilaiList'],
    });

    if (!inherent) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    let totalQuestions = 0;
    let totalWeighted = 0;

    inherent.parameters?.forEach((param) => {
      const paramBobot = Number(param.bobot) / 100;
      param.nilaiList?.forEach((nilai) => {
        totalQuestions++;
        totalWeighted += Number(nilai.bobot) * paramBobot;
      });
    });

    return {
      totalQuestions,
      aspekCount: inherent.parameters?.length || 0,
      averageScore: totalWeighted,
      rating: this.getRating(totalWeighted),
    };
  }

  private getRating(score: number): string {
    if (score >= 4.5) return 'Strong';
    if (score >= 3.5) return 'Satisfactory';
    if (score >= 2.5) return 'Fair';
    if (score >= 1.5) return 'Marginal';
    return 'Unsatisfactory';
  }

  // === IMPORT/EXPORT ===

  async exportToExcel(inherentId: number) {
    this.logger.log(`exportToExcel: Mengekspor ke Excel - ID: ${inherentId}`);

    const inherent = await this.inherentRepository.findOne({
      where: { id: inherentId },
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

    if (!inherent) {
      throw new NotFoundException(
        `Data dengan ID ${inherentId} tidak ditemukan`,
      );
    }

    const exportData = {
      metadata: {
        year: inherent.year,
        quarter: inherent.quarter,
        exportedAt: new Date().toISOString(),
        totalParameters: inherent.parameters?.length || 0,
        totalNilai:
          inherent.parameters?.reduce(
            (total, param) => total + (param.nilaiList?.length || 0),
            0,
          ) || 0,
      },
      parameters:
        inherent.parameters?.map((param) => ({
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
      // Deactivate semua data sebelumnya
      await queryRunner.manager.update(
        LikuiditasProdukOjk,
        { isActive: true },
        { isActive: false },
      );

      // Buat inherent baru
      const inherent = {
        year: importData.metadata?.year || new Date().getFullYear(),
        quarter: importData.metadata?.quarter || 1,
        summary: importData.summary,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
      };

      const savedInherent = await queryRunner.manager.save(
        LikuiditasProdukOjk,
        inherent,
      );

      // Import parameters
      for (let i = 0; i < importData.parameters.length; i++) {
        const paramData = importData.parameters[i];

        const parameter = {
          nomor: paramData.nomor || '',
          judul: paramData.judul || '',
          bobot: paramData.bobot || 0,
          kategori: paramData.kategori || {
            model: '' as LikuiditasKategoriModel,
            prinsip: '' as LikuiditasKategoriPrinsip,
            jenis: '' as LikuiditasKategoriJenis,
            underlying: [],
          },
          likuiditasProdukOjkId: savedInherent.id,
          orderIndex: paramData.orderIndex || i,
        };

        const savedParam = await queryRunner.manager.save(
          LikuiditasParameter,
          parameter,
        );

        // Import nilai
        if (paramData.nilaiList && Array.isArray(paramData.nilaiList)) {
          for (let j = 0; j < paramData.nilaiList.length; j++) {
            const nilaiData = paramData.nilaiList[j];

            const nilai = {
              nomor: nilaiData.nomor || '',
              judul: nilaiData.judul || {
                type: LikuiditasJudulType.TANPA_FAKTOR,
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

            await queryRunner.manager.save(LikuiditasNilai, nilai);
          }
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `importFromExcel: Data berhasil diimpor - ID: ${savedInherent.id}, Jumlah parameter: ${importData.parameters.length}`,
      );
      return savedInherent;
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
