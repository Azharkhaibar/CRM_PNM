import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HukumOjk } from './entities/hukum-ojk.entity';
import { HukumParameter } from './entities/hukum-paramater.entity';
import { HukumNilai } from './entities/hukum-nilai.entity';
import { HukumReference } from './entities/hukum-inherent-references.entity';
import {
  CreateHukumDto,
  UpdateHukumDto,
  CreateParameterDto,
  UpdateParameterDto,
  CreateNilaiDto,
  UpdateNilaiDto,
  ReorderParametersDto,
  ReorderNilaiDto,
  UpdateSummaryDto,
  KategoriModel,
  KategoriPrinsip,
  KategoriJenis,
  JudulType,
} from './dto/hukum-inherent.dto';

@Injectable()
export class HukumOjkService {
  private readonly logger = new Logger(HukumOjkService.name);

  constructor(
    @InjectRepository(HukumOjk)
    private hukumRepository: Repository<HukumOjk>,
    @InjectRepository(HukumParameter)
    private parameterRepository: Repository<HukumParameter>,
    @InjectRepository(HukumNilai)
    private nilaiRepository: Repository<HukumNilai>,
    @InjectRepository(HukumReference)
    private referenceRepository: Repository<HukumReference>,
    private dataSource: DataSource,
  ) {}

  // === CRUD UTAMA (HukumOjk) ===

  async create(createDto: CreateHukumDto, userId: string) {
    try {
      const existing = await this.hukumRepository.findOne({
        where: { year: createDto.year, quarter: createDto.quarter },
      });

      if (existing) {
        this.logger.warn(
          `create: Data sudah ada untuk year ${createDto.year} quarter ${createDto.quarter}`,
        );
        return existing;
      }

      const hukum = this.hukumRepository.create({
        year: createDto.year,
        quarter: createDto.quarter,
        isActive: createDto.isActive ?? true,
        createdBy: userId,
        updatedBy: userId,
        version: createDto.version || '1.0.0',
      });

      const saved = await this.hukumRepository.save(hukum);
      this.logger.log(`create: Data berhasil dibuat - ID: ${saved.id}`);

      return saved;
    } catch (error) {
      this.logger.error(
        `Error creating HukumOjk: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActive(): Promise<HukumOjk | null> {
    this.logger.debug('findActive: Mencari data aktif');

    try {
      const hukum = await this.hukumRepository.findOne({
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

      if (!hukum) {
        this.logger.warn('findActive: Tidak ada data aktif ditemukan');
        return null;
      }

      this.logger.log(`findActive: Data ditemukan - ID: ${hukum.id}`);
      return hukum;
    } catch (error) {
      this.logger.error(`findActive: Error - ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByYearQuarter(
    year: number,
    quarter: number,
  ): Promise<HukumOjk | null> {
    this.logger.log(
      `findByYearQuarter: Mencari data - Year: ${year}, Quarter: ${quarter}`,
    );

    try {
      const hukum = await this.hukumRepository.findOne({
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

      if (!hukum) {
        this.logger.warn(
          `findByYearQuarter: Data tidak ditemukan untuk Year: ${year}, Quarter: ${quarter}`,
        );
        return null;
      }

      this.logger.log(`findByYearQuarter: Data ditemukan - ID: ${hukum.id}`);
      return hukum;
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
    return this.hukumRepository.find({
      relations: ['parameters'],
      order: { year: 'DESC', quarter: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateHukumDto, userId: string) {
    this.logger.log(`update: Mengupdate data - ID: ${id}`);

    const hukum = await this.hukumRepository.findOne({
      where: { id },
    });

    if (!hukum) {
      this.logger.error(`update: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Update field yang ada
    if (updateDto.year !== undefined) hukum.year = updateDto.year;
    if (updateDto.quarter !== undefined) hukum.quarter = updateDto.quarter;
    if (updateDto.isActive !== undefined)
      hukum.isActive = updateDto.isActive;
    if (updateDto.summary !== undefined) hukum.summary = updateDto.summary;
    if (updateDto.isLocked !== undefined)
      hukum.isLocked = updateDto.isLocked;
    if (updateDto.lockedBy !== undefined)
      hukum.lockedBy = updateDto.lockedBy;
    if (updateDto.lockedAt !== undefined)
      hukum.lockedAt = updateDto.lockedAt;
    if (updateDto.notes !== undefined) hukum.notes = updateDto.notes;

    hukum.updatedBy = userId;

    const result = await this.hukumRepository.save(hukum);
    this.logger.log(`update: Data berhasil diupdate - ID: ${result.id}`);

    return result;
  }

  async updateSummary(
    id: number,
    summaryDto: UpdateSummaryDto,
    userId: string,
  ) {
    this.logger.log(`updateSummary: Mengupdate summary - ID: ${id}`);

    const hukum = await this.hukumRepository.findOne({
      where: { id },
    });

    if (!hukum) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    hukum.summary = {
      ...hukum.summary,
      ...summaryDto,
      computedAt: new Date(),
    };
    hukum.updatedBy = userId;

    const result = await this.hukumRepository.save(hukum);
    this.logger.log(
      `updateSummary: Summary berhasil diupdate - ID: ${result.id}`,
    );
    return result;
  }

  async updateActiveStatus(id: number, isActive: boolean, userId: string) {
    this.logger.log(
      `updateActiveStatus: Mengupdate status aktif - ID: ${id}, isActive: ${isActive}`,
    );

    const hukum = await this.hukumRepository.findOne({
      where: { id },
    });

    if (!hukum) {
      this.logger.error(
        `updateActiveStatus: Data dengan ID ${id} tidak ditemukan`,
      );
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Jika mengaktifkan satu, nonaktifkan yang lain
    if (isActive) {
      this.logger.debug('updateActiveStatus: Menonaktifkan data lain');
      await this.hukumRepository
        .createQueryBuilder()
        .update(HukumOjk)
        .set({ isActive: false })
        .execute();
    }

    hukum.isActive = isActive;
    hukum.updatedBy = userId;

    const result = await this.hukumRepository.save(hukum);
    this.logger.log(
      `updateActiveStatus: Status berhasil diupdate - ID: ${result.id}`,
    );

    return result;
  }

  async remove(id: number) {
    this.logger.log(`remove: Menghapus data - ID: ${id}`);

    const hukum = await this.hukumRepository.findOne({
      where: { id },
      relations: ['parameters', 'parameters.nilaiList'],
    });

    if (!hukum) {
      this.logger.error(`remove: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Gunakan transaction untuk menghapus semua relasi
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Hapus semua nilai terlebih dahulu
      for (const parameter of hukumOjk.parameters || []) {
        await queryRunner.manager.delete(HukumNilai, {
          parameterId: parameter.id,
        });
      }

      // Hapus semua parameter
      await queryRunner.manager.delete(HukumParameter, {
        hukumId: id,
      });

      // Hapus hukumOjk
      await queryRunner.manager.delete(HukumOjk, { id });

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
    hukumId: number,
    createParamDto: CreateParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `addParameter: Menambahkan parameter - hukum ID: ${hukumId}`,
    );

    const hukum = await this.hukumRepository.findOne({
      where: { id: hukumId },
    });

    if (!hukum) {
      throw new NotFoundException(
        `Data dengan ID ${hukumId} tidak ditemukan`,
      );
    }

    // =========== VALIDASI YANG DIRELAKSASI UNTUK MODEL TERSTRUKTUR ===========
    if (createParamDto.kategori) {
      const kategori = createParamDto.kategori;

      // Validasi untuk model 'open_end'
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

      // Validasi untuk model 'terstruktur' - DIRELAKSASI
      if (kategori.model === KategoriModel.TERSTRUKTUR) {
        if (kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "terstruktur", jenis harus kosong',
          );
        }

        // VALIDASI DIRELAKSASI: Tidak memaksa underlying harus ada
        // Hanya warning jika tidak ada underlying
        if (!kategori.underlying || kategori.underlying.length === 0) {
          this.logger.warn(
            `addParameter: Model "terstruktur" tanpa underlying untuk parameter "${createParamDto.judul}"`,
          );
          // Tidak throw error, hanya log warning
        }

        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "terstruktur"',
          );
        }
      }

      // Validasi untuk model 'tanpa_model'
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

    // Cari orderIndex terakhir
    const lastParam = await this.parameterRepository.findOne({
      where: { hukumOjkId: hukumOjkId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndex = lastParam ? lastParam.orderIndex + 1 : 0;

    // Format kategori dengan validasi yang lebih fleksibel untuk terstruktur
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
        hukumId: hukumId,
        orderIndex: createParamDto.orderIndex ?? orderIndex,
      });

      const savedParam = await this.parameterRepository.save(parameter);

      this.logger.log(
        `addParameter: Parameter berhasil ditambahkan - ID: ${savedParam.id}`,
      );

      // Update timestamp hukum
      await this.hukumRepository.update(hukumId, {
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
    hukumId: number,
    parameterId: number,
    updateParamDto: UpdateParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `updateParameter: Mengupdate parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, hukumId: hukumId },
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

      // Validasi kategori untuk update dengan relaksasi untuk terstruktur
      if (kategori.model === KategoriModel.TERSTRUKTUR) {
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "terstruktur"',
          );
        }

        // VALIDASI DIRELAKSASI: Hanya warning jika tidak ada underlying
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

      // Update kategori dengan format yang benar
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

      // Update timestamp hukumOjk
      await this.hukumOjkRepository.update(hukumOjkId, {
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
    hukumId: number,
    reorderDto: ReorderParametersDto,
  ) {
    this.logger.log(
      `reorderParameters: Mengurutkan parameter - hukum ID: ${hukumId}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < reorderDto.parameterIds.length; i++) {
        const parameterId = reorderDto.parameterIds[i];
        await queryRunner.manager.update(
          HukumParameter,
          { id: parameterId, hukumId: hukumId },
          { orderIndex: i },
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `reorderParameters: Parameter berhasil diurutkan - hukum ID: ${hukumId}`,
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

  async copyParameter(hukumOjkId: number, parameterId: number, userId: string) {
    this.logger.log(`copyParameter: Menyalin parameter - ID: ${parameterId}`);

    const originalParam = await this.parameterRepository.findOne({
      where: { id: parameterId, hukumId: hukumId },
      relations: ['nilaiList'],
    });

    if (!originalParam) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    // Cari orderIndex terakhir
    const lastParam = await this.parameterRepository.findOne({
      where: { hukumOjkId: hukumOjkId },
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
        hukumId: hukumId,
        orderIndex,
      });

      const savedParam = await queryRunner.manager.save(
        HukumParameter,
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
          return queryRunner.manager.save(HukumNilai, newNilai);
        });

        await Promise.all(nilaiPromises);
      }

      await queryRunner.commitTransaction();

      // Update timestamp hukum
      await this.hukumRepository.update(hukumId, {
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
    hukumOjkId: number,
    parameterId: number,
    userId: string,
  ) {
    this.logger.log(
      `removeParameter: Menghapus parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, hukumId: hukumId },
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
        await queryRunner.manager.delete(HukumNilai, {
          parameterId: parameterId,
        });
      }

      // Hapus parameter
      await queryRunner.manager.delete(HukumParameter, { id: parameterId });

      await queryRunner.commitTransaction();

      // Update timestamp hukum
      await this.hukumRepository.update(hukumId, {
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
    hukumOjkId: number,
    parameterId: number,
    createNilaiDto: CreateNilaiDto,
    userId: string,
  ) {
    this.logger.log(
      `addNilai: Menambahkan nilai - Parameter ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, hukumOjkId: hukumOjkId },
    });

    if (!parameter) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    // Validasi judul.text - PERBAIKAN: handle optional
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

    // Update timestamp hukum
    await this.hukumRepository.update(hukumId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `addNilai: Nilai berhasil ditambahkan - ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async updateNilai(
    hukumId: number,
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

    // Cek apakah parameter milik hukum yang benar
    if (nilai.parameter.hukumId !== hukumId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam hukum yang dimaksud',
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
        // Handle text update dengan safety check
        ...(updateNilaiDto.judul.text && {
          text: updateNilaiDto.judul.text.trim(),
        }),
      };
    }

    const updated = await this.nilaiRepository.save(nilai);

    // Update timestamp hukum
    await this.hukumRepository.update(hukumId, {
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
          HukumNilai,
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
    hukumId: number,
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

    // Update timestamp hukum
    await this.hukumRepository.update(hukumId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `copyNilai: Nilai berhasil disalin - New ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async removeNilai(
    hukumId: number,
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

    // Cek apakah parameter milik hukum yang benar
    if (nilai.parameter.hukumId !== hukumId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam hukum yang dimaksud',
      );
    }

    await this.nilaiRepository.delete({ id: nilaiId });

    // Update timestamp hukum
    await this.hukumRepository.update(hukumId, {
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
  async validateModelTerstruktur(hukumId: number): Promise<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    const result = {
      isValid: true,
      warnings: [] as string[],
      errors: [] as string[],
    };

    const hukum = await this.hukumRepository.findOne({
      where: { id: hukumId },
      relations: ['parameters'],
    });

    if (!hukum) {
      result.errors.push(`Data dengan ID ${hukumId} tidak ditemukan`);
      result.isValid = false;
      return result;
    }

    // Cek parameter dengan model terstruktur
    const terstrukturParams =
      hukum.parameters?.filter(
        (param) => param.kategori?.model === KategoriModel.TERSTRUKTUR,
      ) || [];

    terstrukturParams.forEach((param, index) => {
      // Validasi prinsip
      if (!param.kategori?.prinsip) {
        result.errors.push(
          `Parameter "${param.judul}" (model terstruktur) harus memiliki prinsip`,
        );
        result.isValid = false;
      }

      // Validasi underlying - hanya warning jika kosong
      if (
        !param.kategori?.underlying ||
        param.kategori.underlying.length === 0
      ) {
        result.warnings.push(
          `Parameter "${param.judul}" (model terstruktur) tidak memiliki aset dasar`,
        );
      }

      // Validasi jenis - harus kosong
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

  async exportToExcel(hukumId: number) {
    this.logger.log(`exportToExcel: Mengekspor ke Excel - ID: ${hukumId}`);

    const hukum = await this.hukumRepository.findOne({
      where: { id: hukumId },
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

    if (!hukum) {
      throw new NotFoundException(
        `Data dengan ID ${hukumId} tidak ditemukan`,
      );
    }

    const exportData = {
      metadata: {
        year: hukum.year,
        quarter: hukum.quarter,
        exportedAt: new Date().toISOString(),
        totalParameters: hukum.parameters?.length || 0,
        totalNilai:
          hukum.parameters?.reduce(
            (total, param) => total + (param.nilaiList?.length || 0),
            0,
          ) || 0,
      },
      parameters:
        hukum.parameters?.map((param) => ({
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
        HukumOjk,
        { isActive: true },
        { isActive: false },
      );

      // Buat hukum baru
      const hukum = {
        year: importData.metadata?.year || new Date().getFullYear(),
        quarter: importData.metadata?.quarter || 1,
        summary: importData.summary,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
      };

      const savedHukum = await queryRunner.manager.save(HukumOjk, hukum);

      // Import parameters
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
          hukumId: savedHukum.id,
          orderIndex: paramData.orderIndex || i,
        };

        const savedParam = await queryRunner.manager.save(
          HukumParameter,
          parameter,
        );

        // Import nilai
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

            await queryRunner.manager.save(HukumNilai, nilai);
          }
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `importFromExcel: Data berhasil diimpor - ID: ${savedHukum.id}, Jumlah parameter: ${importData.parameters.length}`,
      );
      return savedHukum;
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
