"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StrategisOjkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategisOjkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const strategis_ojk_entity_1 = require("./entities/strategis-ojk.entity");
const strategis_paramater_entity_1 = require("./entities/strategis-paramater.entity");
const strategis_nilai_entity_1 = require("./entities/strategis-nilai.entity");
const strategis_inherent_references_entity_1 = require("./entities/strategis-inherent-references.entity");
const strategis_inherent_dto_1 = require("./dto/strategis-inherent.dto");
let StrategisOjkService = StrategisOjkService_1 = class StrategisOjkService {
    strategisRepository;
    parameterRepository;
    nilaiRepository;
    referenceRepository;
    dataSource;
    logger = new common_1.Logger(StrategisOjkService_1.name);
    constructor(strategisRepository, parameterRepository, nilaiRepository, referenceRepository, dataSource) {
        this.strategisRepository = strategisRepository;
        this.parameterRepository = parameterRepository;
        this.nilaiRepository = nilaiRepository;
        this.referenceRepository = referenceRepository;
        this.dataSource = dataSource;
    }
    async create(createDto, userId) {
        try {
            const existing = await this.strategisRepository.findOne({
                where: { year: createDto.year, quarter: createDto.quarter },
            });
            if (existing) {
                this.logger.warn(`create: Data sudah ada untuk year ${createDto.year} quarter ${createDto.quarter}`);
                return existing;
            }
            const strategis = this.strategisRepository.create({
                year: createDto.year,
                quarter: createDto.quarter,
                isActive: createDto.isActive ?? true,
                createdBy: userId,
                updatedBy: userId,
                version: createDto.version || '1.0.0',
            });
            const saved = await this.strategisRepository.save(strategis);
            this.logger.log(`create: Data berhasil dibuat - ID: ${saved.id}`);
            return saved;
        }
        catch (error) {
            this.logger.error(`Error creating StrategisOjk: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findActive() {
        this.logger.debug('findActive: Mencari data aktif');
        try {
            const strategis = await this.strategisRepository.findOne({
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
            if (!strategis) {
                this.logger.warn('findActive: Tidak ada data aktif ditemukan');
                return null;
            }
            this.logger.log(`findActive: Data ditemukan - ID: ${strategis.id}`);
            return strategis;
        }
        catch (error) {
            this.logger.error(`findActive: Error - ${error.message}`, error.stack);
            throw error;
        }
    }
    async findByYearQuarter(year, quarter) {
        this.logger.log(`findByYearQuarter: Mencari data - Year: ${year}, Quarter: ${quarter}`);
        try {
            const strategis = await this.strategisRepository.findOne({
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
            if (!strategis) {
                this.logger.warn(`findByYearQuarter: Data tidak ditemukan untuk Year: ${year}, Quarter: ${quarter}`);
                return null;
            }
            this.logger.log(`findByYearQuarter: Data ditemukan - ID: ${strategis.id}`);
            return strategis;
        }
        catch (error) {
            this.logger.error(`findByYearQuarter: Error - ${error.message}`, error.stack);
            throw error;
        }
    }
    async getAll() {
        this.logger.debug('getAll: Mendapatkan semua data');
        return this.strategisRepository.find({
            relations: ['parameters'],
            order: { year: 'DESC', quarter: 'DESC' },
        });
    }
    async update(id, updateDto, userId) {
        this.logger.log(`update: Mengupdate data - ID: ${id}`);
        const strategis = await this.strategisRepository.findOne({
            where: { id },
        });
        if (!strategis) {
            this.logger.error(`update: Data dengan ID ${id} tidak ditemukan`);
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
        }
        if (updateDto.year !== undefined)
            strategis.year = updateDto.year;
        if (updateDto.quarter !== undefined)
            strategis.quarter = updateDto.quarter;
        if (updateDto.isActive !== undefined)
            strategis.isActive = updateDto.isActive;
        if (updateDto.summary !== undefined)
            strategis.summary = updateDto.summary;
        if (updateDto.isLocked !== undefined)
            strategis.isLocked = updateDto.isLocked;
        if (updateDto.lockedBy !== undefined)
            strategis.lockedBy = updateDto.lockedBy;
        if (updateDto.lockedAt !== undefined)
            strategis.lockedAt = updateDto.lockedAt;
        if (updateDto.notes !== undefined)
            strategis.notes = updateDto.notes;
        strategis.updatedBy = userId;
        const result = await this.strategisRepository.save(strategis);
        this.logger.log(`update: Data berhasil diupdate - ID: ${result.id}`);
        return result;
    }
    async updateSummary(id, summaryDto, userId) {
        this.logger.log(`updateSummary: Mengupdate summary - ID: ${id}`);
        const strategis = await this.strategisRepository.findOne({
            where: { id },
        });
        if (!strategis) {
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
        }
        strategis.summary = {
            ...strategis.summary,
            ...summaryDto,
            computedAt: new Date(),
        };
        strategis.updatedBy = userId;
        const result = await this.strategisRepository.save(strategis);
        this.logger.log(`updateSummary: Summary berhasil diupdate - ID: ${result.id}`);
        return result;
    }
    async updateActiveStatus(id, isActive, userId) {
        this.logger.log(`updateActiveStatus: Mengupdate status aktif - ID: ${id}, isActive: ${isActive}`);
        const strategis = await this.strategisRepository.findOne({
            where: { id },
        });
        if (!strategis) {
            this.logger.error(`updateActiveStatus: Data dengan ID ${id} tidak ditemukan`);
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
        }
        if (isActive) {
            this.logger.debug('updateActiveStatus: Menonaktifkan data lain');
            await this.strategisRepository
                .createQueryBuilder()
                .update(strategis_ojk_entity_1.StrategisOjk)
                .set({ isActive: false })
                .execute();
        }
        strategis.isActive = isActive;
        strategis.updatedBy = userId;
        const result = await this.strategisRepository.save(strategis);
        this.logger.log(`updateActiveStatus: Status berhasil diupdate - ID: ${result.id}`);
        return result;
    }
    async remove(id) {
        this.logger.log(`remove: Menghapus data - ID: ${id}`);
        const strategis = await this.strategisRepository.findOne({
            where: { id },
            relations: ['parameters', 'parameters.nilaiList'],
        });
        if (!strategis) {
            this.logger.error(`remove: Data dengan ID ${id} tidak ditemukan`);
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const parameter of strategis.parameters || []) {
                await queryRunner.manager.delete(strategis_nilai_entity_1.StrategisNilai, {
                    parameterId: parameter.id,
                });
            }
            await queryRunner.manager.delete(strategis_paramater_entity_1.StrategisParameter, {
                strategisOjkId: id,
            });
            await queryRunner.manager.delete(strategis_ojk_entity_1.StrategisOjk, { id });
            await queryRunner.commitTransaction();
            this.logger.log(`remove: Data berhasil dihapus - ID: ${id}`);
            return { message: 'Data berhasil dihapus', id };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`remove: Error - ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async addParameter(strategisId, createParamDto, userId) {
        this.logger.log(`addParameter: Menambahkan parameter - Strategis ID: ${strategisId}`);
        const strategis = await this.strategisRepository.findOne({
            where: { id: strategisId },
        });
        if (!strategis) {
            throw new common_1.NotFoundException(`Data dengan ID ${strategisId} tidak ditemukan`);
        }
        if (createParamDto.kategori) {
            const kategori = createParamDto.kategori;
            if (kategori.model === strategis_inherent_dto_1.KategoriModel.OPEN_END) {
                if (!kategori.jenis) {
                    throw new common_1.BadRequestException('Untuk model "open_end", jenis reksa dana wajib dipilih');
                }
                if (kategori.underlying && kategori.underlying.length > 0) {
                    throw new common_1.BadRequestException('Untuk model "open_end", aset dasar harus kosong');
                }
                if (!kategori.prinsip) {
                    throw new common_1.BadRequestException('Prinsip (syariah/konvensional) wajib dipilih untuk model "open_end"');
                }
            }
            if (kategori.model === strategis_inherent_dto_1.KategoriModel.TERSTRUKTUR) {
                if (kategori.jenis) {
                    throw new common_1.BadRequestException('Untuk model "terstruktur", jenis harus kosong');
                }
                if (!kategori.underlying || kategori.underlying.length === 0) {
                    this.logger.warn(`addParameter: Model "terstruktur" tanpa underlying untuk parameter "${createParamDto.judul}"`);
                }
                if (!kategori.prinsip) {
                    throw new common_1.BadRequestException('Prinsip (syariah/konvensional) wajib dipilih untuk model "terstruktur"');
                }
            }
            if (kategori.model === strategis_inherent_dto_1.KategoriModel.TANPA_MODEL) {
                if (kategori.prinsip ||
                    kategori.jenis ||
                    (kategori.underlying && kategori.underlying.length > 0)) {
                    throw new common_1.BadRequestException('Untuk model "tanpa_model", prinsip, jenis, dan aset dasar harus kosong');
                }
            }
        }
        const lastParam = await this.parameterRepository.findOne({
            where: { strategisOjkId: strategisId },
            order: { orderIndex: 'DESC' },
        });
        const orderIndex = lastParam ? lastParam.orderIndex + 1 : 0;
        const kategoriFormatted = createParamDto.kategori
            ? {
                model: createParamDto.kategori.model,
                prinsip: createParamDto.kategori.model !== strategis_inherent_dto_1.KategoriModel.TANPA_MODEL
                    ? createParamDto.kategori.prinsip
                    : undefined,
                jenis: createParamDto.kategori.model === strategis_inherent_dto_1.KategoriModel.OPEN_END
                    ? createParamDto.kategori.jenis
                    : undefined,
                underlying: createParamDto.kategori.model === strategis_inherent_dto_1.KategoriModel.TERSTRUKTUR
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
                strategisOjkId: strategisId,
                orderIndex: createParamDto.orderIndex ?? orderIndex,
            });
            const savedParam = await this.parameterRepository.save(parameter);
            this.logger.log(`addParameter: Parameter berhasil ditambahkan - ID: ${savedParam.id}`);
            await this.strategisRepository.update(strategisId, {
                updatedBy: userId,
                updatedAt: new Date(),
            });
            return savedParam;
        }
        catch (error) {
            this.logger.error('addParameter - Error saving parameter:', error);
            if (error.code === '23502' || error.message.includes('null value')) {
                throw new common_1.BadRequestException('Error validasi: Pastikan semua field yang diperlukan terisi sesuai model yang dipilih');
            }
            throw error;
        }
    }
    async updateParameter(strategisId, parameterId, updateParamDto, userId) {
        this.logger.log(`updateParameter: Mengupdate parameter - ID: ${parameterId}`);
        const parameter = await this.parameterRepository.findOne({
            where: { id: parameterId, strategisOjkId: strategisId },
        });
        if (!parameter) {
            throw new common_1.NotFoundException(`Parameter dengan ID ${parameterId} tidak ditemukan`);
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
            if (kategori.model === strategis_inherent_dto_1.KategoriModel.TERSTRUKTUR) {
                if (!kategori.prinsip) {
                    throw new common_1.BadRequestException('Prinsip (syariah/konvensional) wajib dipilih untuk model "terstruktur"');
                }
                if (!kategori.underlying || kategori.underlying.length === 0) {
                    this.logger.warn(`updateParameter: Model "terstruktur" tanpa underlying untuk parameter "${parameter.judul}"`);
                }
                if (kategori.jenis) {
                    throw new common_1.BadRequestException('Untuk model "terstruktur", jenis harus kosong');
                }
            }
            if (kategori.model === strategis_inherent_dto_1.KategoriModel.OPEN_END) {
                if (!kategori.prinsip) {
                    throw new common_1.BadRequestException('Prinsip (syariah/konvensional) wajib dipilih untuk model "open_end"');
                }
                if (!kategori.jenis) {
                    throw new common_1.BadRequestException('Untuk model "open_end", jenis reksa dana wajib dipilih');
                }
                if (kategori.underlying && kategori.underlying.length > 0) {
                    throw new common_1.BadRequestException('Untuk model "open_end", aset dasar harus kosong');
                }
            }
            if (kategori.model === strategis_inherent_dto_1.KategoriModel.TANPA_MODEL) {
                if (kategori.prinsip ||
                    kategori.jenis ||
                    (kategori.underlying && kategori.underlying.length > 0)) {
                    throw new common_1.BadRequestException('Untuk model "tanpa_model", prinsip, jenis, dan aset dasar harus kosong');
                }
            }
            parameter.kategori = {
                model: kategori.model,
                prinsip: kategori.model !== strategis_inherent_dto_1.KategoriModel.TANPA_MODEL
                    ? kategori.prinsip
                    : undefined,
                jenis: kategori.model === strategis_inherent_dto_1.KategoriModel.OPEN_END
                    ? kategori.jenis
                    : undefined,
                underlying: kategori.model === strategis_inherent_dto_1.KategoriModel.TERSTRUKTUR
                    ? kategori.underlying || []
                    : [],
            };
        }
        try {
            const updated = await this.parameterRepository.save(parameter);
            await this.strategisRepository.update(strategisId, {
                updatedBy: userId,
                updatedAt: new Date(),
            });
            this.logger.log(`updateParameter: Parameter berhasil diupdate - ID: ${updated.id}`);
            return updated;
        }
        catch (error) {
            this.logger.error('updateParameter - Error:', error);
            throw error;
        }
    }
    async reorderParameters(strategisId, reorderDto) {
        this.logger.log(`reorderParameters: Mengurutkan parameter - Strategis ID: ${strategisId}`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (let i = 0; i < reorderDto.parameterIds.length; i++) {
                const parameterId = reorderDto.parameterIds[i];
                await queryRunner.manager.update(strategis_paramater_entity_1.StrategisParameter, { id: parameterId, strategisOjkId: strategisId }, { orderIndex: i });
            }
            await queryRunner.commitTransaction();
            this.logger.log(`reorderParameters: Parameter berhasil diurutkan - Strategis ID: ${strategisId}`);
            return { message: 'Parameter berhasil diurutkan' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`reorderParameters: Error - ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async copyParameter(strategisId, parameterId, userId) {
        this.logger.log(`copyParameter: Menyalin parameter - ID: ${parameterId}`);
        const originalParam = await this.parameterRepository.findOne({
            where: { id: parameterId, strategisOjkId: strategisId },
            relations: ['nilaiList'],
        });
        if (!originalParam) {
            throw new common_1.NotFoundException(`Parameter dengan ID ${parameterId} tidak ditemukan`);
        }
        const lastParam = await this.parameterRepository.findOne({
            where: { strategisOjkId: strategisId },
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
                strategisOjkId: strategisId,
                orderIndex,
            });
            const savedParam = await queryRunner.manager.save(strategis_paramater_entity_1.StrategisParameter, newParam);
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
                    return queryRunner.manager.save(strategis_nilai_entity_1.StrategisNilai, newNilai);
                });
                await Promise.all(nilaiPromises);
            }
            await queryRunner.commitTransaction();
            await this.strategisRepository.update(strategisId, {
                updatedBy: userId,
                updatedAt: new Date(),
            });
            this.logger.log(`copyParameter: Parameter berhasil disalin - New ID: ${savedParam.id}`);
            return savedParam;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`copyParameter: Error - ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async removeParameter(strategisId, parameterId, userId) {
        this.logger.log(`removeParameter: Menghapus parameter - ID: ${parameterId}`);
        const parameter = await this.parameterRepository.findOne({
            where: { id: parameterId, strategisOjkId: strategisId },
            relations: ['nilaiList'],
        });
        if (!parameter) {
            throw new common_1.NotFoundException(`Parameter dengan ID ${parameterId} tidak ditemukan`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (parameter.nilaiList && parameter.nilaiList.length > 0) {
                await queryRunner.manager.delete(strategis_nilai_entity_1.StrategisNilai, {
                    parameterId: parameterId,
                });
            }
            await queryRunner.manager.delete(strategis_paramater_entity_1.StrategisParameter, { id: parameterId });
            await queryRunner.commitTransaction();
            await this.strategisRepository.update(strategisId, {
                updatedBy: userId,
                updatedAt: new Date(),
            });
            this.logger.log(`removeParameter: Parameter berhasil dihapus - ID: ${parameterId}`);
            return { message: 'Parameter berhasil dihapus', parameterId };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`removeParameter: Error - ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async addNilai(strategisId, parameterId, createNilaiDto, userId) {
        this.logger.log(`addNilai: Menambahkan nilai - Parameter ID: ${parameterId}`);
        const parameter = await this.parameterRepository.findOne({
            where: { id: parameterId, strategisOjkId: strategisId },
        });
        if (!parameter) {
            throw new common_1.NotFoundException(`Parameter dengan ID ${parameterId} tidak ditemukan`);
        }
        const judulText = createNilaiDto.judul?.text;
        if (!judulText || judulText.trim() === '') {
            throw new common_1.BadRequestException('Judul nilai wajib diisi');
        }
        const lastNilai = await this.nilaiRepository.findOne({
            where: { parameterId: parameterId },
            order: { orderIndex: 'DESC' },
        });
        const orderIndex = lastNilai ? lastNilai.orderIndex + 1 : 0;
        const nilai = {
            nomor: createNilaiDto.nomor || '',
            judul: {
                type: createNilaiDto.judul?.type || strategis_inherent_dto_1.JudulType.TANPA_FAKTOR,
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
        await this.strategisRepository.update(strategisId, {
            updatedBy: userId,
            updatedAt: new Date(),
        });
        this.logger.log(`addNilai: Nilai berhasil ditambahkan - ID: ${savedNilai.id}`);
        return savedNilai;
    }
    async updateNilai(strategisId, parameterId, nilaiId, updateNilaiDto, userId) {
        this.logger.log(`updateNilai: Mengupdate nilai - ID: ${nilaiId}`);
        const nilai = await this.nilaiRepository.findOne({
            where: { id: nilaiId, parameterId: parameterId },
            relations: ['parameter'],
        });
        if (!nilai) {
            throw new common_1.NotFoundException(`Nilai dengan ID ${nilaiId} tidak ditemukan`);
        }
        if (nilai.parameter.strategisOjkId !== strategisId) {
            throw new common_1.BadRequestException('Nilai tidak termasuk dalam strategis yang dimaksud');
        }
        if (updateNilaiDto.nomor !== undefined)
            nilai.nomor = updateNilaiDto.nomor;
        if (updateNilaiDto.bobot !== undefined)
            nilai.bobot = updateNilaiDto.bobot;
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
        await this.strategisRepository.update(strategisId, {
            updatedBy: userId,
            updatedAt: new Date(),
        });
        this.logger.log(`updateNilai: Nilai berhasil diupdate - ID: ${updated.id}`);
        return updated;
    }
    async reorderNilai(parameterId, reorderDto) {
        this.logger.log(`reorderNilai: Mengurutkan nilai - Parameter ID: ${parameterId}`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (let i = 0; i < reorderDto.nilaiIds.length; i++) {
                const nilaiId = reorderDto.nilaiIds[i];
                await queryRunner.manager.update(strategis_nilai_entity_1.StrategisNilai, { id: nilaiId, parameterId: parameterId }, { orderIndex: i });
            }
            await queryRunner.commitTransaction();
            this.logger.log(`reorderNilai: Nilai berhasil diurutkan - Parameter ID: ${parameterId}`);
            return { message: 'Nilai berhasil diurutkan' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`reorderNilai: Error - ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async copyNilai(strategisId, parameterId, nilaiId, userId) {
        this.logger.log(`copyNilai: Menyalin nilai - ID: ${nilaiId}`);
        const originalNilai = await this.nilaiRepository.findOne({
            where: { id: nilaiId, parameterId: parameterId },
        });
        if (!originalNilai) {
            throw new common_1.NotFoundException(`Nilai dengan ID ${nilaiId} tidak ditemukan`);
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
        await this.strategisRepository.update(strategisId, {
            updatedBy: userId,
            updatedAt: new Date(),
        });
        this.logger.log(`copyNilai: Nilai berhasil disalin - New ID: ${savedNilai.id}`);
        return savedNilai;
    }
    async removeNilai(strategisId, parameterId, nilaiId, userId) {
        this.logger.log(`removeNilai: Menghapus nilai - ID: ${nilaiId}`);
        const nilai = await this.nilaiRepository.findOne({
            where: { id: nilaiId, parameterId: parameterId },
            relations: ['parameter'],
        });
        if (!nilai) {
            throw new common_1.NotFoundException(`Nilai dengan ID ${nilaiId} tidak ditemukan`);
        }
        if (nilai.parameter.strategisOjkId !== strategisId) {
            throw new common_1.BadRequestException('Nilai tidak termasuk dalam strategis yang dimaksud');
        }
        await this.nilaiRepository.delete({ id: nilaiId });
        await this.strategisRepository.update(strategisId, {
            updatedBy: userId,
            updatedAt: new Date(),
        });
        this.logger.log(`removeNilai: Nilai berhasil dihapus - ID: ${nilaiId}`);
        return { message: 'Nilai berhasil dihapus', nilaiId };
    }
    async getReferences(type) {
        this.logger.debug(`getReferences: Mendapatkan referensi - Type: ${type || 'all'}`);
        const query = this.referenceRepository
            .createQueryBuilder('ref')
            .where('ref.isActive = :isActive', { isActive: true });
        if (type) {
            query.andWhere('ref.type = :type', { type });
        }
        query.orderBy('ref.order', 'ASC');
        return query.getMany();
    }
    async validateModelTerstruktur(strategisId) {
        const result = {
            isValid: true,
            warnings: [],
            errors: [],
        };
        const strategis = await this.strategisRepository.findOne({
            where: { id: strategisId },
            relations: ['parameters'],
        });
        if (!strategis) {
            result.errors.push(`Data dengan ID ${strategisId} tidak ditemukan`);
            result.isValid = false;
            return result;
        }
        const terstrukturParams = strategis.parameters?.filter((param) => param.kategori?.model === strategis_inherent_dto_1.KategoriModel.TERSTRUKTUR) || [];
        terstrukturParams.forEach((param, index) => {
            if (!param.kategori?.prinsip) {
                result.errors.push(`Parameter "${param.judul}" (model terstruktur) harus memiliki prinsip`);
                result.isValid = false;
            }
            if (!param.kategori?.underlying ||
                param.kategori.underlying.length === 0) {
                result.warnings.push(`Parameter "${param.judul}" (model terstruktur) tidak memiliki aset dasar`);
            }
            if (param.kategori?.jenis) {
                result.errors.push(`Parameter "${param.judul}" (model terstruktur) seharusnya tidak memiliki jenis`);
                result.isValid = false;
            }
        });
        this.logger.log(`validateModelTerstruktur: Validasi selesai - ${result.errors.length} errors, ${result.warnings.length} warnings`);
        return result;
    }
    async exportToExcel(strategisId) {
        this.logger.log(`exportToExcel: Mengekspor ke Excel - ID: ${strategisId}`);
        const strategis = await this.strategisRepository.findOne({
            where: { id: strategisId },
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
        if (!strategis) {
            throw new common_1.NotFoundException(`Data dengan ID ${strategisId} tidak ditemukan`);
        }
        const exportData = {
            metadata: {
                year: strategis.year,
                quarter: strategis.quarter,
                exportedAt: new Date().toISOString(),
                totalParameters: strategis.parameters?.length || 0,
                totalNilai: strategis.parameters?.reduce((total, param) => total + (param.nilaiList?.length || 0), 0) || 0,
            },
            parameters: strategis.parameters?.map((param) => ({
                id: param.id,
                nomor: param.nomor,
                judul: param.judul,
                bobot: Number(param.bobot),
                kategori: param.kategori,
                orderIndex: param.orderIndex,
                nilaiList: param.nilaiList?.map((nilai) => ({
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
        this.logger.log(`exportToExcel: Data berhasil diekspor - Jumlah parameter: ${exportData.metadata.totalParameters}`);
        return exportData;
    }
    async importFromExcel(importData, userId) {
        this.logger.log('importFromExcel: Mengimpor data dari Excel');
        if (!importData.parameters || !Array.isArray(importData.parameters)) {
            throw new common_1.BadRequestException('Format data tidak valid');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(strategis_ojk_entity_1.StrategisOjk, { isActive: true }, { isActive: false });
            const strategis = {
                year: importData.metadata?.year || new Date().getFullYear(),
                quarter: importData.metadata?.quarter || 1,
                summary: importData.summary,
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
            };
            const savedStrategis = await queryRunner.manager.save(strategis_ojk_entity_1.StrategisOjk, strategis);
            for (let i = 0; i < importData.parameters.length; i++) {
                const paramData = importData.parameters[i];
                const parameter = {
                    nomor: paramData.nomor || '',
                    judul: paramData.judul || '',
                    bobot: paramData.bobot || 0,
                    kategori: paramData.kategori || {
                        model: '',
                        prinsip: '',
                        jenis: '',
                        underlying: [],
                    },
                    strategisOjkId: savedStrategis.id,
                    orderIndex: paramData.orderIndex || i,
                };
                const savedParam = await queryRunner.manager.save(strategis_paramater_entity_1.StrategisParameter, parameter);
                if (paramData.nilaiList && Array.isArray(paramData.nilaiList)) {
                    for (let j = 0; j < paramData.nilaiList.length; j++) {
                        const nilaiData = paramData.nilaiList[j];
                        const nilai = {
                            nomor: nilaiData.nomor || '',
                            judul: nilaiData.judul || {
                                type: strategis_inherent_dto_1.JudulType.TANPA_FAKTOR,
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
                        await queryRunner.manager.save(strategis_nilai_entity_1.StrategisNilai, nilai);
                    }
                }
            }
            await queryRunner.commitTransaction();
            this.logger.log(`importFromExcel: Data berhasil diimpor - ID: ${savedStrategis.id}, Jumlah parameter: ${importData.parameters.length}`);
            return savedStrategis;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`importFromExcel: Error - ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.StrategisOjkService = StrategisOjkService;
exports.StrategisOjkService = StrategisOjkService = StrategisOjkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(strategis_ojk_entity_1.StrategisOjk)),
    __param(1, (0, typeorm_1.InjectRepository)(strategis_paramater_entity_1.StrategisParameter)),
    __param(2, (0, typeorm_1.InjectRepository)(strategis_nilai_entity_1.StrategisNilai)),
    __param(3, (0, typeorm_1.InjectRepository)(strategis_inherent_references_entity_1.StrategisReference)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], StrategisOjkService);
//# sourceMappingURL=strategis-ojk.service.js.map