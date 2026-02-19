import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { KreditProdukOjk } from './entities/kredit-produk-ojk.entity';
import { KreditParameter } from './entities/kredit-produk-parameter.entity';
import { KreditNilai } from './entities/kredit-produk-nilai.entity';
// import { InherentReferenceKredit } from './entities/kredit-produk-references.entity';
import { InherentReferenceKredit } from './entities/kredit-inherent-references.entity';
// import {
//   CreateKreditProdukDto,
//   UpdateKreditProdukDto,
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
// } from './dto/kredit-produk.dto';

import {
  CreateKreditProdukDto,
  UpdateKreditProdukDto,
  CreateParameterDto,
  UpdateParameterDto,
  CreateNilaiDto,
  UpdateNilaiDto,
  ReorderNilaiDto,
  ReorderParametersDto,
  UpdateSummaryDto,
  KategoriJenis,
  KategoriPrinsip,
  JudulType,
  KategoriModel,
} from './dto/kredit-produk-inherent.dto';

@Injectable()
export class KreditProdukOjkService {
  private readonly logger = new Logger(KreditProdukOjkService.name);

  constructor(
    @InjectRepository(KreditProdukOjk)
    private kreditRepository: Repository<KreditProdukOjk>,
    @InjectRepository(KreditParameter)
    private parameterRepository: Repository<KreditParameter>,
    @InjectRepository(KreditNilai)
    private nilaiRepository: Repository<KreditNilai>,
    @InjectRepository(InherentReferenceKredit)
    private referenceRepository: Repository<InherentReferenceKredit>,
    private dataSource: DataSource,
  ) {}

  // === CRUD UTAMA (KreditProdukOjk) ===

  async create(createDto: CreateKreditProdukDto, userId: string) {
    try {
      const existing = await this.kreditRepository.findOne({
        where: { year: createDto.year, quarter: createDto.quarter },
      });

      if (existing) {
        this.logger.warn(
          `create: Data sudah ada untuk year ${createDto.year} quarter ${createDto.quarter}`,
        );
        return existing;
      }

      const kredit = this.kreditRepository.create({
        year: createDto.year,
        quarter: createDto.quarter,
        isActive: createDto.isActive ?? true,
        createdBy: userId,
        updatedBy: userId,
        version: createDto.version || '1.0.0',
      });

      const saved = await this.kreditRepository.save(kredit);
      this.logger.log(`create: Data berhasil dibuat - ID: ${saved.id}`);

      return saved;
    } catch (error) {
      this.logger.error(
        `Error creating KreditProdukOjk: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActive(): Promise<KreditProdukOjk | null> {
    this.logger.debug('findActive: Mencari data aktif');

    try {
      const kredit = await this.kreditRepository.findOne({
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

      if (!kredit) {
        this.logger.warn('findActive: Tidak ada data aktif ditemukan');
        return null;
      }

      this.logger.log(`findActive: Data ditemukan - ID: ${kredit.id}`);
      return kredit;
    } catch (error) {
      this.logger.error(`findActive: Error - ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByYearQuarter(
    year: number,
    quarter: number,
  ): Promise<KreditProdukOjk | null> {
    this.logger.log(
      `findByYearQuarter: Mencari data - Year: ${year}, Quarter: ${quarter}`,
    );

    try {
      const kredit = await this.kreditRepository.findOne({
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

      if (!kredit) {
        this.logger.warn(
          `findByYearQuarter: Data tidak ditemukan untuk Year: ${year}, Quarter: ${quarter}`,
        );
        return null;
      }

      this.logger.log(`findByYearQuarter: Data ditemukan - ID: ${kredit.id}`);
      return kredit;
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
    return this.kreditRepository.find({
      relations: ['parameters'],
      order: { year: 'DESC', quarter: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateKreditProdukDto, userId: string) {
    this.logger.log(`update: Mengupdate data - ID: ${id}`);

    const kredit = await this.kreditRepository.findOne({
      where: { id },
    });

    if (!kredit) {
      this.logger.error(`update: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Update field yang ada
    if (updateDto.year !== undefined) kredit.year = updateDto.year;
    if (updateDto.quarter !== undefined) kredit.quarter = updateDto.quarter;
    if (updateDto.isActive !== undefined) kredit.isActive = updateDto.isActive;
    if (updateDto.summary !== undefined) kredit.summary = updateDto.summary;
    if (updateDto.isLocked !== undefined) kredit.isLocked = updateDto.isLocked;
    if (updateDto.lockedBy !== undefined) kredit.lockedBy = updateDto.lockedBy;
    if (updateDto.lockedAt !== undefined) kredit.lockedAt = updateDto.lockedAt;
    if (updateDto.notes !== undefined) kredit.notes = updateDto.notes;

    kredit.updatedBy = userId;

    const result = await this.kreditRepository.save(kredit);
    this.logger.log(`update: Data berhasil diupdate - ID: ${result.id}`);

    return result;
  }

  async updateSummary(
    id: number,
    summaryDto: UpdateSummaryDto,
    userId: string,
  ) {
    this.logger.log(`updateSummary: Mengupdate summary - ID: ${id}`);

    const kredit = await this.kreditRepository.findOne({
      where: { id },
    });

    if (!kredit) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    kredit.summary = {
      ...kredit.summary,
      ...summaryDto,
      computedAt: new Date(),
    };
    kredit.updatedBy = userId;

    const result = await this.kreditRepository.save(kredit);
    this.logger.log(
      `updateSummary: Summary berhasil diupdate - ID: ${result.id}`,
    );
    return result;
  }

  async updateActiveStatus(id: number, isActive: boolean, userId: string) {
    this.logger.log(
      `updateActiveStatus: Mengupdate status aktif - ID: ${id}, isActive: ${isActive}`,
    );

    const kredit = await this.kreditRepository.findOne({
      where: { id },
    });

    if (!kredit) {
      this.logger.error(
        `updateActiveStatus: Data dengan ID ${id} tidak ditemukan`,
      );
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Jika mengaktifkan satu, nonaktifkan yang lain
    if (isActive) {
      this.logger.debug('updateActiveStatus: Menonaktifkan data lain');
      await this.kreditRepository
        .createQueryBuilder()
        .update(KreditProdukOjk)
        .set({ isActive: false })
        .execute();
    }

    kredit.isActive = isActive;
    kredit.updatedBy = userId;

    const result = await this.kreditRepository.save(kredit);
    this.logger.log(
      `updateActiveStatus: Status berhasil diupdate - ID: ${result.id}`,
    );

    return result;
  }

  async remove(id: number) {
    this.logger.log(`remove: Menghapus data - ID: ${id}`);

    const kredit = await this.kreditRepository.findOne({
      where: { id },
      relations: ['parameters', 'parameters.nilaiList'],
    });

    if (!kredit) {
      this.logger.error(`remove: Data dengan ID ${id} tidak ditemukan`);
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Gunakan transaction untuk menghapus semua relasi
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Hapus semua nilai terlebih dahulu
      for (const parameter of kredit.parameters || []) {
        await queryRunner.manager.delete(KreditNilai, {
          parameterId: parameter.id,
        });
      }

      // Hapus semua parameter
      await queryRunner.manager.delete(KreditParameter, {
        kreditProdukOjkId: id,
      });

      // Hapus kredit
      await queryRunner.manager.delete(KreditProdukOjk, { id });

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
    kreditId: number,
    createParamDto: CreateParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `addParameter: Menambahkan parameter - Kredit ID: ${kreditId}`,
    );

    const kredit = await this.kreditRepository.findOne({
      where: { id: kreditId },
    });

    if (!kredit) {
      throw new NotFoundException(`Data dengan ID ${kreditId} tidak ditemukan`);
    }

    // =========== VALIDASI UNTUK MODEL KREDIT ===========
    if (createParamDto.kategori) {
      const kategori = createParamDto.kategori;

      // Validasi untuk model konvensional
      if (kategori.model === KategoriModel.KONVENSIONAL) {
        if (!kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "konvensional", jenis kredit wajib dipilih',
          );
        }
        if (
          !kategori.prinsip ||
          kategori.prinsip !== KategoriPrinsip.KONVENSIONAL
        ) {
          throw new BadRequestException(
            'Prinsip harus "konvensional" untuk model konvensional',
          );
        }
      }

      // Validasi untuk model syariah
      if (kategori.model === KategoriModel.SYARIAH) {
        if (!kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "syariah", jenis kredit wajib dipilih',
          );
        }
        if (!kategori.prinsip || kategori.prinsip !== KategoriPrinsip.SYARIAH) {
          throw new BadRequestException(
            'Prinsip harus "syariah" untuk model syariah',
          );
        }
      }

      // Validasi untuk model kombinasi
      if (kategori.model === KategoriModel.KOMBINASI) {
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "kombinasi"',
          );
        }
        // Hanya warning jika tidak ada underlying
        if (!kategori.underlying || kategori.underlying.length === 0) {
          this.logger.warn(
            `addParameter: Model "kombinasi" tanpa underlying untuk parameter "${createParamDto.judul}"`,
          );
        }
      }

      // Validasi untuk model lainnya
      if (kategori.model === KategoriModel.LAINNYA) {
        if (
          kategori.prinsip ||
          kategori.jenis ||
          (kategori.underlying && kategori.underlying.length > 0)
        ) {
          throw new BadRequestException(
            'Untuk model "lainnya", prinsip, jenis, dan aset dasar harus kosong',
          );
        }
      }
    }

    // Cari orderIndex terakhir
    const lastParam = await this.parameterRepository.findOne({
      where: { kreditProdukOjkId: kreditId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndex = lastParam ? lastParam.orderIndex + 1 : 0;

    // Format kategori dengan validasi yang lebih fleksibel
    const kategoriFormatted = createParamDto.kategori
      ? {
          model: createParamDto.kategori.model,
          prinsip: createParamDto.kategori.prinsip,
          jenis: createParamDto.kategori.jenis,
          underlying: createParamDto.kategori.underlying || [],
        }
      : undefined;

    try {
      const parameter = this.parameterRepository.create({
        nomor: createParamDto.nomor || '',
        judul: createParamDto.judul.trim(),
        bobot: createParamDto.bobot,
        kategori: kategoriFormatted,
        kreditProdukOjkId: kreditId,
        orderIndex: createParamDto.orderIndex ?? orderIndex,
      });

      const savedParam = await this.parameterRepository.save(parameter);

      this.logger.log(
        `addParameter: Parameter berhasil ditambahkan - ID: ${savedParam.id}`,
      );

      // Update timestamp kredit
      await this.kreditRepository.update(kreditId, {
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
    kreditId: number,
    parameterId: number,
    updateParamDto: UpdateParameterDto,
    userId: string,
  ) {
    this.logger.log(
      `updateParameter: Mengupdate parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, kreditProdukOjkId: kreditId },
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

      // Validasi kategori untuk update
      if (kategori.model === KategoriModel.KONVENSIONAL) {
        if (!kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "konvensional", jenis kredit wajib dipilih',
          );
        }
        if (
          !kategori.prinsip ||
          kategori.prinsip !== KategoriPrinsip.KONVENSIONAL
        ) {
          throw new BadRequestException(
            'Prinsip harus "konvensional" untuk model konvensional',
          );
        }
      }

      if (kategori.model === KategoriModel.SYARIAH) {
        if (!kategori.jenis) {
          throw new BadRequestException(
            'Untuk model "syariah", jenis kredit wajib dipilih',
          );
        }
        if (!kategori.prinsip || kategori.prinsip !== KategoriPrinsip.SYARIAH) {
          throw new BadRequestException(
            'Prinsip harus "syariah" untuk model syariah',
          );
        }
      }

      if (kategori.model === KategoriModel.KOMBINASI) {
        if (!kategori.prinsip) {
          throw new BadRequestException(
            'Prinsip (syariah/konvensional) wajib dipilih untuk model "kombinasi"',
          );
        }
        if (!kategori.underlying || kategori.underlying.length === 0) {
          this.logger.warn(
            `updateParameter: Model "kombinasi" tanpa underlying untuk parameter "${parameter.judul}"`,
          );
        }
      }

      if (kategori.model === KategoriModel.LAINNYA) {
        if (
          kategori.prinsip ||
          kategori.jenis ||
          (kategori.underlying && kategori.underlying.length > 0)
        ) {
          throw new BadRequestException(
            'Untuk model "lainnya", prinsip, jenis, dan aset dasar harus kosong',
          );
        }
      }

      // Update kategori
      parameter.kategori = {
        model: kategori.model,
        prinsip: kategori.prinsip,
        jenis: kategori.jenis,
        underlying: kategori.underlying || [],
      };
    }

    try {
      const updated = await this.parameterRepository.save(parameter);

      // Update timestamp kredit
      await this.kreditRepository.update(kreditId, {
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

  async reorderParameters(kreditId: number, reorderDto: ReorderParametersDto) {
    this.logger.log(
      `reorderParameters: Mengurutkan parameter - Kredit ID: ${kreditId}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < reorderDto.parameterIds.length; i++) {
        const parameterId = reorderDto.parameterIds[i];
        await queryRunner.manager.update(
          KreditParameter,
          { id: parameterId, kreditProdukOjkId: kreditId },
          { orderIndex: i },
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `reorderParameters: Parameter berhasil diurutkan - Kredit ID: ${kreditId}`,
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

  async copyParameter(kreditId: number, parameterId: number, userId: string) {
    this.logger.log(`copyParameter: Menyalin parameter - ID: ${parameterId}`);

    const originalParam = await this.parameterRepository.findOne({
      where: { id: parameterId, kreditProdukOjkId: kreditId },
      relations: ['nilaiList'],
    });

    if (!originalParam) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }

    // Cari orderIndex terakhir
    const lastParam = await this.parameterRepository.findOne({
      where: { kreditProdukOjkId: kreditId },
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
        kreditProdukOjkId: kreditId,
        orderIndex,
      });

      const savedParam = await queryRunner.manager.save(
        KreditParameter,
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
          return queryRunner.manager.save(KreditNilai, newNilai);
        });

        await Promise.all(nilaiPromises);
      }

      await queryRunner.commitTransaction();

      // Update timestamp kredit
      await this.kreditRepository.update(kreditId, {
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

  async removeParameter(kreditId: number, parameterId: number, userId: string) {
    this.logger.log(
      `removeParameter: Menghapus parameter - ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, kreditProdukOjkId: kreditId },
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
        await queryRunner.manager.delete(KreditNilai, {
          parameterId: parameterId,
        });
      }

      // Hapus parameter
      await queryRunner.manager.delete(KreditParameter, { id: parameterId });

      await queryRunner.commitTransaction();

      // Update timestamp kredit
      await this.kreditRepository.update(kreditId, {
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
    kreditId: number,
    parameterId: number,
    createNilaiDto: CreateNilaiDto,
    userId: string,
  ) {
    this.logger.log(
      `addNilai: Menambahkan nilai - Parameter ID: ${parameterId}`,
    );

    const parameter = await this.parameterRepository.findOne({
      where: { id: parameterId, kreditProdukOjkId: kreditId },
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

    // Update timestamp kredit
    await this.kreditRepository.update(kreditId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `addNilai: Nilai berhasil ditambahkan - ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async updateNilai(
    kreditId: number,
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

    // Cek apakah parameter milik kredit yang benar
    if (nilai.parameter.kreditProdukOjkId !== kreditId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam kredit yang dimaksud',
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

    // Update timestamp kredit
    await this.kreditRepository.update(kreditId, {
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
          KreditNilai,
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
    kreditId: number,
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

    // Update timestamp kredit
    await this.kreditRepository.update(kreditId, {
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(
      `copyNilai: Nilai berhasil disalin - New ID: ${savedNilai.id}`,
    );
    return savedNilai;
  }

  async removeNilai(
    kreditId: number,
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

    // Cek apakah parameter milik kredit yang benar
    if (nilai.parameter.kreditProdukOjkId !== kreditId) {
      throw new BadRequestException(
        'Nilai tidak termasuk dalam kredit yang dimaksud',
      );
    }

    await this.nilaiRepository.delete({ id: nilaiId });

    // Update timestamp kredit
    await this.kreditRepository.update(kreditId, {
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

  // === VALIDASI TAMBAHAN UNTUK MODEL KREDIT ===
  async validateModelKredit(kreditId: number): Promise<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    const result = {
      isValid: true,
      warnings: [] as string[],
      errors: [] as string[],
    };

    const kredit = await this.kreditRepository.findOne({
      where: { id: kreditId },
      relations: ['parameters'],
    });

    if (!kredit) {
      result.errors.push(`Data dengan ID ${kreditId} tidak ditemukan`);
      result.isValid = false;
      return result;
    }

    // Cek parameter dengan model kombinasi
    const kombinasiParams =
      kredit.parameters?.filter(
        (param) => param.kategori?.model === KategoriModel.KOMBINASI,
      ) || [];

    kombinasiParams.forEach((param, index) => {
      // Validasi prinsip
      if (!param.kategori?.prinsip) {
        result.errors.push(
          `Parameter "${param.judul}" (model kombinasi) harus memiliki prinsip`,
        );
        result.isValid = false;
      }

      // Validasi underlying - hanya warning jika kosong
      if (
        !param.kategori?.underlying ||
        param.kategori.underlying.length === 0
      ) {
        result.warnings.push(
          `Parameter "${param.judul}" (model kombinasi) tidak memiliki aset dasar`,
        );
      }
    });

    // Cek parameter dengan model konvensional
    const konvensionalParams =
      kredit.parameters?.filter(
        (param) => param.kategori?.model === KategoriModel.KONVENSIONAL,
      ) || [];

    konvensionalParams.forEach((param, index) => {
      if (!param.kategori?.jenis) {
        result.errors.push(
          `Parameter "${param.judul}" (model konvensional) harus memiliki jenis kredit`,
        );
        result.isValid = false;
      }
      if (
        !param.kategori?.prinsip ||
        param.kategori.prinsip !== KategoriPrinsip.KONVENSIONAL
      ) {
        result.errors.push(
          `Parameter "${param.judul}" (model konvensional) harus memiliki prinsip konvensional`,
        );
        result.isValid = false;
      }
    });

    // Cek parameter dengan model syariah
    const syariahParams =
      kredit.parameters?.filter(
        (param) => param.kategori?.model === KategoriModel.SYARIAH,
      ) || [];

    syariahParams.forEach((param, index) => {
      if (!param.kategori?.jenis) {
        result.errors.push(
          `Parameter "${param.judul}" (model syariah) harus memiliki jenis kredit`,
        );
        result.isValid = false;
      }
      if (
        !param.kategori?.prinsip ||
        param.kategori.prinsip !== KategoriPrinsip.SYARIAH
      ) {
        result.errors.push(
          `Parameter "${param.judul}" (model syariah) harus memiliki prinsip syariah`,
        );
        result.isValid = false;
      }
    });

    this.logger.log(
      `validateModelKredit: Validasi selesai - ${result.errors.length} errors, ${result.warnings.length} warnings`,
    );

    return result;
  }

  // === IMPORT/EXPORT ===

  async exportToExcel(kreditId: number) {
    this.logger.log(`exportToExcel: Mengekspor ke Excel - ID: ${kreditId}`);

    const kredit = await this.kreditRepository.findOne({
      where: { id: kreditId },
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

    if (!kredit) {
      throw new NotFoundException(`Data dengan ID ${kreditId} tidak ditemukan`);
    }

    const exportData = {
      metadata: {
        year: kredit.year,
        quarter: kredit.quarter,
        exportedAt: new Date().toISOString(),
        totalParameters: kredit.parameters?.length || 0,
        totalNilai:
          kredit.parameters?.reduce(
            (total, param) => total + (param.nilaiList?.length || 0),
            0,
          ) || 0,
      },
      parameters:
        kredit.parameters?.map((param) => ({
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
        KreditProdukOjk,
        { isActive: true },
        { isActive: false },
      );

      // Buat kredit baru
      const kredit = {
        year: importData.metadata?.year || new Date().getFullYear(),
        quarter: importData.metadata?.quarter || 1,
        summary: importData.summary,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
      };

      const savedKredit = await queryRunner.manager.save(
        KreditProdukOjk,
        kredit,
      );

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
          kreditProdukOjkId: savedKredit.id,
          orderIndex: paramData.orderIndex || i,
        };

        const savedParam = await queryRunner.manager.save(
          KreditParameter,
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

            await queryRunner.manager.save(KreditNilai, nilai);
          }
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `importFromExcel: Data berhasil diimpor - ID: ${savedKredit.id}, Jumlah parameter: ${importData.parameters.length}`,
      );
      return savedKredit;
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
