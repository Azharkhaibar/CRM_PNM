import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Operasional } from './entities/operasional-ojk.entity';
import { OperasionalParameter } from './entities/operasional-produk-parameter.entity';
import { OperasionalNilai } from './entities/operasional-produk-nilai.entity';
import { OperasionalReference } from './entities/operasional-inherent-references.entity';
// import {
//   CreateOperasionalDto,
//   UpdateOperasionalDto,
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
// } from './dto/operasional.dto';

import {
  CreateOperasionalDto,
  CreateParameterDto,
  CreateNilaiDto,
  UpdateOperasionalDto,
  UpdateParameterDto,
  UpdateNilaiDto,
  ReorderNilaiDto,
  ReorderParametersDto,
  UpdateSummaryDto,
  KategoriModel,
  KategoriPrinsip,
  JudulType,
  KategoriJenis,
} from './dto/operasional-inherent.dto';

@Injectable()
export class OperasionalService {
  private readonly logger = new Logger(OperasionalService.name);

  constructor(
    @InjectRepository(Operasional)
    private operasionalRepository: Repository<Operasional>,
    @InjectRepository(OperasionalParameter)
    private parameterRepository: Repository<OperasionalParameter>,
    @InjectRepository(OperasionalNilai)
    private nilaiRepository: Repository<OperasionalNilai>,
    @InjectRepository(OperasionalReference)
    private referenceRepository: Repository<OperasionalReference>,
    private dataSource: DataSource,
  ) {}

  // === CRUD UTAMA (Operasional) ===

  async create(createDto: CreateOperasionalDto, userId: string) {
    try {
      const existing = await this.operasionalRepository.findOne({
        where: { year: createDto.year, quarter: createDto.quarter },
      });

      if (existing) {
        this.logger.warn(
          `create: Data sudah ada untuk year ${createDto.year} quarter ${createDto.quarter}`,
        );
        return existing;
      }

      const operasional = this.operasionalRepository.create({
        year: createDto.year,
        quarter: createDto.quarter,
        isActive: createDto.isActive ?? true,
        createdBy: userId,
        updatedBy: userId,
        version: createDto.version || '1.0.0',
      });

      const saved = await this.operasionalRepository.save(operasional);
      this.logger.log(`create: Data berhasil dibuat - ID: ${saved.id}`);

      return saved;
    } catch (error) {
      this.logger.error(
        `Error creating Operasional: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActive(): Promise<Operasional | null> {
    this.logger.debug('findActive: Mencari data aktif');

    try {
      const operasional = await this.operasionalRepository.findOne({
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

      if (!operasional) {
        this.logger.warn('findActive: Tidak ada data aktif ditemukan');
        return null;
      }

      this.logger.log(`findActive: Data ditemukan - ID: ${operasional.id}`);
      return operasional;
    } catch (error) {
      this.logger.error(`findActive: Error - ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByYearQuarter(
    year: number,
    quarter: number,
  ): Promise<Operasional | null> {
    this.logger.log(
      `findByYearQuarter: Mencari data - Year: ${year}, Quarter: ${quarter}`,
    );

    try {
      const operasional = await this.operasionalRepository.findOne({
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

      if (!operasional) {
        this.logger.warn(
          `findByYearQuarter: Data tidak ditemukan untuk Year: ${year}, Quarter: ${quarter}`,
        );
        return null;
      }

      this.logger.log(
        `findByYearQuarter: Data ditemukan - ID: ${operasional.id}`,
      );
      return operasional;
    } catch (error) {
      this.logger.error(
        `findByYearQuarter: Error - ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findById(id: number): Promise<Operasional | null> {
    this.logger.log(`findById: Mencari data - ID: ${id}`);

    try {
      const operasional = await this.operasionalRepository.findOne({
        where: { id },
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

      if (!operasional) {
        this.logger.warn(`findById: Data dengan ID ${id} tidak ditemukan`);
        return null;
      }

      this.logger.log(`findById: Data ditemukan - ID: ${operasional.id}`);
      return operasional;
    } catch (error) {
      this.logger.error(`findById: Error - ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAll() {
    this.logger.debug('getAll: Mendapatkan semua data');
    return this.operasionalRepository.find({
      relations: ['parameters'],
      order: { year: 'DESC', quarter: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateOperasionalDto, userId: string) {
    this.logger.log(`update: Mengupdate data - ID: ${id}`);

    const operasional = await this.operasionalRepository.findOne({
      where: { id },
    });

    if (!operasional) {
      this.logger.error(`update: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    if (updateDto.year !== undefined) operasional.year = updateDto.year;
    if (updateDto.quarter !== undefined)
      operasional.quarter = updateDto.quarter;
    if (updateDto.isActive !== undefined)
      operasional.isActive = updateDto.isActive;
    if (updateDto.summary !== undefined)
      operasional.summary = updateDto.summary;
    if (updateDto.isLocked !== undefined)
      operasional.isLocked = updateDto.isLocked;
    if (updateDto.lockedBy !== undefined)
      operasional.lockedBy = updateDto.lockedBy;
    if (updateDto.lockedAt !== undefined)
      operasional.lockedAt = updateDto.lockedAt;
    if (updateDto.notes !== undefined) operasional.notes = updateDto.notes;

    operasional.updatedBy = userId;

    const result = await this.operasionalRepository.save(operasional);
    this.logger.log(`update: Data berhasil diupdate - ID: ${result.id}`);

    return result;
  }

  async updateSummary(
    id: number,
    summaryDto: UpdateSummaryDto,
    userId: string,
  ) {
    this.logger.log(`updateSummary: Mengupdate summary - ID: ${id}`);

    const operasional = await this.operasionalRepository.findOne({
      where: { id },
    });

    if (!operasional) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    operasional.summary = {
      ...operasional.summary,
      ...summaryDto,
      computedAt: new Date(),
    };
    operasional.updatedBy = userId;

    const result = await this.operasionalRepository.save(operasional);
    this.logger.log(
      `updateSummary: Summary berhasil diupdate - ID: ${result.id}`,
    );
    return result;
  }

  async updateActiveStatus(id: number, isActive: boolean, userId: string) {
    this.logger.log(
      `updateActiveStatus: Mengupdate status aktif - ID: ${id}, isActive: ${isActive}`,
    );

    const operasional = await this.operasionalRepository.findOne({
      where: { id },
    });

    if (!operasional) {
      this.logger.error(
        `updateActiveStatus: Data dengan ID ${id} tidak ditemukan`,
      );
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    if (isActive) {
      this.logger.debug('updateActiveStatus: Menonaktifkan data lain');
      await this.operasionalRepository
        .createQueryBuilder()
        .update(Operasional)
        .set({ isActive: false })
        .execute();
    }

    operasional.isActive = isActive;
    operasional.updatedBy = userId;

    const result = await this.operasionalRepository.save(operasional);
    this.logger.log(
      `updateActiveStatus: Status berhasil diupdate - ID: ${result.id}`,
    );

    return result;
  }

  async remove(id: number) {
    this.logger.log(`remove: Menghapus data - ID: ${id}`);

    const operasional = await this.operasionalRepository.findOne({
      where: { id },
      relations: ['parameters', 'parameters.nilaiList'],
    });

    if (!operasional) {
      this.logger.error(`remove: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const parameter of operasional.parameters || []) {
        await queryRunner.manager.delete(OperasionalNilai, {
          parameterId: parameter.id,
        });
      }

      await queryRunner.manager.delete(OperasionalParameter, {
        operasionalId: id,
      });

      await queryRunner.manager.delete(Operasional, { id });

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
    operasionalId: number,
    createParamDto: CreateParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `addParameter: Menambahkan parameter - Operasional ID: ${operasionalId}`,
    );

    const operasional = await this.operasionalRepository.findOne({
      where: { id: operasionalId },
    });

    if (!operasional) {
      throw new NotFoundException(
        `Data dengan ID ${operasionalId} tidak ditemukan`,
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
      where: { operasionalId: operasionalId },
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
        operasionalId: operasionalId,
        orderIndex: createParamDto.orderIndex ?? orderIndex,
      });

      const savedParam = await this.parameterRepository.save(parameter);

      this.logger.log(
        `addParameter: Parameter berhasil ditambahkan - ID: ${savedParam.id}`,
      );

      await this.operasionalRepository.update(operasionalId, {
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
    operasionalId: number,
    parameterId: number,
    updateParamDto: UpdateParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `updateParameter: Mengupdate parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, operasionalId: operasionalId },
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

      await this.operasionalRepository.update(operasionalId, {
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
    operasionalId: number,
    reorderDto: ReorderParametersDto,
  ) {
    this.logger.log(
      `reorderParameters: Mengurutkan parameter - Operasional ID: ${operasionalId}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < reorderDto.parameterIds.length; i++) {
        const parameterId = reorderDto.parameterIds[i];
        await queryRunner.manager.update(
          OperasionalParameter,
          { id: parameterId, operasionalId: operasionalId },
          { orderIndex: i },
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `reorderParameters: Parameter berhasil diurutkan - Operasional ID: ${operasionalId}`,
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

  async copyParameter(
    operasionalId: number,
    parameterId: number,
    userId: string,
  ) {
    this.logger.log(`copyParameter: Menyalin parameter - ID: ${parameterId}`);

    const originalParam = await this.parameterRepository.findOne({
      where: { id: parameterId, operasionalId: operasionalId },
      relations: ['nilaiList'],
    });

    if (!originalParam) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    const lastParam = await this.parameterRepository.findOne({
      where: { operasionalId: operasionalId },
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
        operasionalId: operasionalId,
        orderIndex,
      });

      const savedParam = await queryRunner.manager.save(
        OperasionalParameter,
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
          return queryRunner.manager.save(OperasionalNilai, newNilai);
        });

        await Promise.all(nilaiPromises);
      }

      await queryRunner.commitTransaction();

      await this.operasionalRepository.update(operasionalId, {
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
    operasionalId: number,
    parameterId: number,
    userId: string,
  ) {
    this.logger.log(
      `removeParameter: Menghapus parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, operasionalId: operasionalId },
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
        await queryRunner.manager.delete(OperasionalNilai, {
          parameterId: parameterId,
        });
      }

      await queryRunner.manager.delete(OperasionalParameter, {
        id: parameterId,
      });

      await queryRunner.commitTransaction();

      await this.operasionalRepository.update(operasionalId, {
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
    operasionalId: number,
    parameterId: number,
    createNilaiDto: CreateNilaiDto,
    userId: string,
  ) {
    this.logger.log(
      `addNilai: Menambahkan nilai - Parameter ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, operasionalId: operasionalId },
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

    await this.operasionalRepository.update(operasionalId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `addNilai: Nilai berhasil ditambahkan - ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async updateNilai(
    operasionalId: number,
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

    if (nilai.parameter.operasionalId !== operasionalId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam operasional yang dimaksud',
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

    await this.operasionalRepository.update(operasionalId, {
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
          OperasionalNilai,
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
    operasionalId: number,
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

    await this.operasionalRepository.update(operasionalId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `copyNilai: Nilai berhasil disalin - New ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async removeNilai(
    operasionalId: number,
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

    if (nilai.parameter.operasionalId !== operasionalId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam operasional yang dimaksud',
      );
    }

    await this.nilaiRepository.delete({ id: nilaiId });

    await this.operasionalRepository.update(operasionalId, {
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
  async validateModelTerstruktur(operasionalId: number): Promise<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    const result = {
      isValid: true,
      warnings: [] as string[],
      errors: [] as string[],
    };

    const operasional = await this.operasionalRepository.findOne({
      where: { id: operasionalId },
      relations: ['parameters'],
    });

    if (!operasional) {
      result.errors.push(`Data dengan ID ${operasionalId} tidak ditemukan`);
      result.isValid = false;
      return result;
    }

    const terstrukturParams =
      operasional.parameters?.filter(
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

  async exportToExcel(operasionalId: number) {
    this.logger.log(
      `exportToExcel: Mengekspor ke Excel - ID: ${operasionalId}`,
    );

    const operasional = await this.operasionalRepository.findOne({
      where: { id: operasionalId },
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

    if (!operasional) {
      throw new NotFoundException(
        `Data dengan ID ${operasionalId} tidak ditemukan`,
      );
    }

    const exportData = {
      metadata: {
        year: operasional.year,
        quarter: operasional.quarter,
        exportedAt: new Date().toISOString(),
        totalParameters: operasional.parameters?.length || 0,
        totalNilai:
          operasional.parameters?.reduce(
            (total, param) => total + (param.nilaiList?.length || 0),
            0,
          ) || 0,
      },
      parameters:
        operasional.parameters?.map((param) => ({
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
        Operasional,
        { isActive: true },
        { isActive: false },
      );

      const operasional = {
        year: importData.metadata?.year || new Date().getFullYear(),
        quarter: importData.metadata?.quarter || 1,
        summary: importData.summary,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
      };

      const savedOperasional = await queryRunner.manager.save(
        Operasional,
        operasional,
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
          operasionalId: savedOperasional.id,
          orderIndex: paramData.orderIndex || i,
        };

        const savedParam = await queryRunner.manager.save(
          OperasionalParameter,
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

            await queryRunner.manager.save(OperasionalNilai, nilai);
          }
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `importFromExcel: Data berhasil diimpor - ID: ${savedOperasional.id}, Jumlah parameter: ${importData.parameters.length}`,
      );
      return savedOperasional;
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
