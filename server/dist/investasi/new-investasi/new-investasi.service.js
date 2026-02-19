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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestasiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const new_investasi_section_entity_1 = require("./entities/new-investasi-section.entity");
const new_investasi_entity_1 = require("./entities/new-investasi.entity");
let InvestasiService = class InvestasiService {
    investasiSectionRepository;
    investasiRepository;
    constructor(investasiSectionRepository, investasiRepository) {
        this.investasiSectionRepository = investasiSectionRepository;
        this.investasiRepository = investasiRepository;
    }
    async createSection(createDto, createdBy) {
        const deletedSection = await this.investasiSectionRepository.findOne({
            where: {
                no: createDto.no,
                parameter: createDto.parameter,
                year: createDto.year,
                quarter: createDto.quarter,
                isDeleted: true,
            },
        });
        if (deletedSection) {
            console.log(`🔄 Reactivating deleted section: ${deletedSection.no} - ${deletedSection.parameter}`);
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
            return await this.investasiSectionRepository.save(deletedSection);
        }
        const existingSection = await this.investasiSectionRepository.findOne({
            where: {
                no: createDto.no,
                parameter: createDto.parameter,
                year: createDto.year,
                quarter: createDto.quarter,
                isDeleted: false,
            },
        });
        if (existingSection) {
            throw new common_1.ConflictException(`Section dengan nomor "${createDto.no}" dan nama "${createDto.parameter}" sudah ada pada periode ${createDto.year}-${createDto.quarter}`);
        }
        const sectionData = {
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
        const section = this.investasiSectionRepository.create(sectionData);
        return await this.investasiSectionRepository.save(section);
    }
    async findAllSections(isActive) {
        const where = { isDeleted: false };
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        return await this.investasiSectionRepository.find({
            where,
            order: { year: 'DESC', quarter: 'DESC', sortOrder: 'ASC', no: 'ASC' },
        });
    }
    async findSectionById(id) {
        try {
            console.log(`🔍 [SERVICE] Finding section by ID: ${id}`);
            const section = await this.investasiSectionRepository
                .createQueryBuilder('section')
                .where('section.id = :id', { id })
                .andWhere('section.is_deleted = false')
                .getOne();
            console.log(`🔍 [SERVICE] Found section:`, section);
            if (!section) {
                throw new common_1.NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
            }
            return section;
        }
        catch (error) {
            console.error(`❌ [SERVICE] Error in findSectionById:`, error);
            throw error;
        }
    }
    async findSectionsByPeriod(year, quarter) {
        return await this.investasiSectionRepository.find({
            where: {
                year,
                quarter,
                isDeleted: false,
                isActive: true,
            },
            order: { sortOrder: 'ASC', no: 'ASC' },
        });
    }
    async updateSection(id, updateDto, updatedBy) {
        const section = await this.findSectionById(id);
        const checkNo = updateDto.no || section.no;
        const checkParam = updateDto.parameter || section.parameter;
        const checkYear = updateDto.year || section.year;
        const checkQuarter = updateDto.quarter || section.quarter;
        const existing = await this.investasiSectionRepository.findOne({
            where: {
                no: checkNo,
                parameter: checkParam,
                year: checkYear,
                quarter: checkQuarter,
                isDeleted: false,
                id: (0, typeorm_2.Not)(id),
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Section dengan nomor "${checkNo}" dan nama "${checkParam}" sudah ada pada periode ${checkYear}-${checkQuarter}`);
        }
        if (updateDto.no !== undefined)
            section.no = updateDto.no;
        if (updateDto.parameter !== undefined)
            section.parameter = updateDto.parameter;
        if (updateDto.bobotSection !== undefined)
            section.bobotSection = updateDto.bobotSection;
        if (updateDto.description !== undefined)
            section.description = updateDto.description;
        if (updateDto.sortOrder !== undefined)
            section.sortOrder = updateDto.sortOrder;
        if (updateDto.isActive !== undefined)
            section.isActive = updateDto.isActive;
        if (updateDto.year !== undefined)
            section.year = updateDto.year;
        if (updateDto.quarter !== undefined)
            section.quarter = updateDto.quarter;
        if (updatedBy) {
            section['updatedBy'] = updatedBy;
        }
        return await this.investasiSectionRepository.save(section);
    }
    async deleteSection(id) {
        const section = await this.investasiSectionRepository.findOne({
            where: { id },
        });
        if (!section) {
            throw new common_1.NotFoundException(`tidak ditemukan id section ${id}`);
        }
        const countIndikator = await this.investasiRepository.count({
            where: { sectionId: id },
        });
        if (countIndikator > 0) {
            throw new common_1.ConflictException(`Section tidak dapat dihapus karena masih digunakan oleh ${countIndikator} indikator`);
        }
        await this.investasiSectionRepository.delete(id);
        return {
            success: true,
            message: `Section "${section.parameter}" berhasil dihapus`,
        };
    }
    async createIndikator(createDto, createdBy) {
        const section = await this.findSectionById(createDto.sectionId);
        const deletedIndikator = await this.investasiRepository.findOne({
            where: {
                year: createDto.year,
                quarter: createDto.quarter,
                sectionId: createDto.sectionId,
                subNo: createDto.subNo,
                isDeleted: true,
            },
        });
        if (deletedIndikator) {
            console.log(`🔄 Reactivating deleted indicator: ${deletedIndikator.subNo} - ${deletedIndikator.indikator}`);
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
            deletedIndikator.weighted =
                createDto.weighted ||
                    this.calculateWeighted(section.bobotSection, createDto.bobotIndikator, createDto.peringkat);
            deletedIndikator.keterangan = createDto.keterangan || null;
            deletedIndikator.version += 1;
            if (createdBy) {
                deletedIndikator.updatedBy = createdBy;
            }
            return await this.investasiRepository.save(deletedIndikator);
        }
        const existingIndikator = await this.investasiRepository.findOne({
            where: {
                year: createDto.year,
                quarter: createDto.quarter,
                sectionId: createDto.sectionId,
                subNo: createDto.subNo,
                isDeleted: false,
            },
        });
        if (existingIndikator) {
            throw new common_1.ConflictException(`Indikator dengan subNo "${createDto.subNo}" sudah ada pada periode ${createDto.year}-${createDto.quarter} di section ini`);
        }
        this.validateModeSpecificFields(createDto);
        const weighted = createDto.weighted ||
            this.calculateWeighted(section.bobotSection, createDto.bobotIndikator, createDto.peringkat);
        const investasiData = {
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
            investasiData.createdBy = createdBy;
        }
        const investasi = this.investasiRepository.create(investasiData);
        return await this.investasiRepository.save(investasi);
    }
    async findIndikatorsByPeriod(year, quarter) {
        return await this.investasiRepository.find({
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
    async findAllIndikators() {
        return await this.investasiRepository.find({
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
    async findIndikatorById(id) {
        const indikator = await this.investasiRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['section'],
        });
        if (!indikator) {
            throw new common_1.NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
        }
        return indikator;
    }
    async updateIndikator(id, updateDto, updatedBy) {
        const indikator = await this.findIndikatorById(id);
        if (updateDto.sectionId && updateDto.sectionId !== indikator.sectionId) {
            const newSection = await this.findSectionById(updateDto.sectionId);
            updateDto.no = newSection.no;
            updateDto.sectionLabel = newSection.parameter;
            updateDto.bobotSection = newSection.bobotSection;
        }
        if ((updateDto.year && updateDto.year !== indikator.year) ||
            (updateDto.quarter && updateDto.quarter !== indikator.quarter) ||
            (updateDto.subNo && updateDto.subNo !== indikator.subNo)) {
            const year = updateDto.year || indikator.year;
            const quarter = updateDto.quarter || indikator.quarter;
            const sectionId = updateDto.sectionId || indikator.sectionId;
            const subNo = updateDto.subNo || indikator.subNo;
            const existing = await this.investasiRepository.findOne({
                where: {
                    year,
                    quarter,
                    sectionId,
                    subNo,
                    isDeleted: false,
                    id: (0, typeorm_2.Not)(id),
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Indikator dengan subNo "${subNo}" sudah ada pada periode ${year}-${quarter} di section ini`);
            }
        }
        if (updateDto.mode) {
            const validationDto = {
                mode: updateDto.mode,
                pembilangValue: updateDto.pembilangValue,
                penyebutValue: updateDto.penyebutValue,
                hasilText: updateDto.hasilText,
            };
            this.validateModeSpecificFields(validationDto);
        }
        if (updateDto.bobotSection ||
            updateDto.bobotIndikator ||
            updateDto.peringkat) {
            const bobotSection = updateDto.bobotSection || indikator.bobotSection;
            const bobotIndikator = updateDto.bobotIndikator || indikator.bobotIndikator;
            const peringkat = updateDto.peringkat || indikator.peringkat;
            updateDto.weighted = this.calculateWeighted(bobotSection, bobotIndikator, peringkat);
        }
        Object.keys(updateDto).forEach((key) => {
            if (updateDto[key] !== undefined) {
                indikator[key] = updateDto[key];
            }
        });
        if (updatedBy) {
            indikator.updatedBy = updatedBy;
            indikator.version += 1;
        }
        return await this.investasiRepository.save(indikator);
    }
    async deleteIndikator(id) {
        const indikator = await this.investasiRepository.findOne({
            where: { id },
        });
        if (!indikator) {
            throw new common_1.NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
        }
        await this.investasiRepository.delete(id);
        return {
            success: true,
            message: `Indikator "${indikator.indikator}" (${indikator.subNo}) berhasil dihapus`,
        };
    }
    async searchIndikators(query, year, quarter) {
        const where = { isDeleted: false };
        if (year)
            where.year = year;
        if (quarter)
            where.quarter = quarter;
        if (query) {
            const searchConditions = [
                { subNo: (0, typeorm_2.Like)(`%${query}%`), ...where },
                { indikator: (0, typeorm_2.Like)(`%${query}%`), ...where },
                { sumberRisiko: (0, typeorm_2.Like)(`%${query}%`), ...where },
                { dampak: (0, typeorm_2.Like)(`%${query}%`), ...where },
                { keterangan: (0, typeorm_2.Like)(`%${query}%`), ...where },
                { hasilText: (0, typeorm_2.Like)(`%${query}%`), ...where },
            ];
            return await this.investasiRepository.find({
                where: searchConditions,
                relations: ['section'],
            });
        }
        return await this.investasiRepository.find({
            where,
            relations: ['section'],
        });
    }
    async getTotalWeightedByPeriod(year, quarter) {
        const result = await this.investasiRepository
            .createQueryBuilder('investasi')
            .select('SUM(investasi.weighted)', 'total')
            .where('investasi.year = :year', { year })
            .andWhere('investasi.quarter = :quarter', { quarter })
            .andWhere('investasi.is_deleted = false')
            .getRawOne();
        return parseFloat(result?.total || 0) || 0;
    }
    validateModeSpecificFields(dto) {
        const mode = dto.mode;
        if (mode === new_investasi_entity_1.CalculationMode.RASIO) {
            if (dto.pembilangValue !== undefined && dto.pembilangValue < 0) {
                throw new common_1.BadRequestException('Pembilang value tidak boleh negatif untuk mode RASIO');
            }
            if (dto.penyebutValue !== undefined && dto.penyebutValue <= 0) {
                throw new common_1.BadRequestException('Penyebut value harus lebih besar dari 0 untuk mode RASIO');
            }
        }
        else if (mode === new_investasi_entity_1.CalculationMode.NILAI_TUNGGAL) {
            if (dto.penyebutValue !== undefined && dto.penyebutValue < 0) {
                throw new common_1.BadRequestException('Nilai penyebut tidak boleh negatif untuk mode NILAI_TUNGGAL');
            }
        }
        else if (mode === new_investasi_entity_1.CalculationMode.TEKS) {
            if (!dto.hasilText && !dto.hasilText?.trim()) {
                throw new common_1.BadRequestException('Hasil text wajib diisi untuk mode TEKS');
            }
        }
    }
    calculateWeighted(bobotSection, bobotIndikator, peringkat) {
        return (bobotSection * bobotIndikator * peringkat) / 10000;
    }
    async duplicateIndikatorToNewPeriod(sourceId, targetYear, targetQuarter, createdBy) {
        const source = await this.findIndikatorById(sourceId);
        const existing = await this.investasiRepository.findOne({
            where: {
                year: targetYear,
                quarter: targetQuarter,
                sectionId: source.sectionId,
                subNo: source.subNo,
                isDeleted: false,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Indikator dengan subNo "${source.subNo}" sudah ada pada periode ${targetYear}-${targetQuarter}`);
        }
        const newIndikatorData = {
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
        const newIndikator = this.investasiRepository.create(newIndikatorData);
        return await this.investasiRepository.save(newIndikator);
    }
    async getIndikatorCountByPeriod(year, quarter) {
        try {
            const result = await this.investasiRepository
                .createQueryBuilder('investasi')
                .select('COUNT(investasi.id)', 'count')
                .where('investasi.year = :year', { year })
                .andWhere('investasi.quarter = :quarter', { quarter })
                .andWhere('investasi.is_deleted = false')
                .getRawOne();
            return parseInt(result?.count || 0) || 0;
        }
        catch (error) {
            console.error('Error in getIndikatorCountByPeriod:', error);
            return 0;
        }
    }
    async getSectionsWithIndicatorsByPeriod(year, quarter) {
        try {
            console.log(`Loading sections with indicators for period: ${year}-${quarter}`);
            const sections = await this.investasiSectionRepository.find({
                where: {
                    year,
                    quarter,
                    isDeleted: false,
                    isActive: true,
                },
                order: { sortOrder: 'ASC', no: 'ASC' },
            });
            console.log(`Total sections for period ${year}-${quarter}: ${sections.length}`);
            const sectionsWithIndicators = await Promise.all(sections.map(async (section) => {
                const indicators = await this.investasiRepository.find({
                    where: {
                        sectionId: section.id,
                        year,
                        quarter,
                        isDeleted: false,
                    },
                    order: { subNo: 'ASC' },
                });
                console.log(`Section ${section.no}: ${indicators.length} indicators`);
                const totalWeighted = indicators.reduce((sum, indicator) => sum + (Number(indicator.weighted) || 0), 0);
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
            }));
            const sectionsWithData = sectionsWithIndicators.filter((s) => s.indicators.length > 0);
            const overallTotalWeighted = sectionsWithData.reduce((sum, section) => sum + (section.totalWeighted || 0), 0);
            return {
                success: true,
                year,
                quarter,
                sections: sectionsWithIndicators,
                sectionsWithIndicators: sectionsWithData,
                overallTotalWeighted,
                sectionCount: sectionsWithIndicators.length,
                totalIndicators: sectionsWithData.reduce((sum, section) => sum + section.indicatorCount, 0),
            };
        }
        catch (error) {
            console.error('Error in getSectionsWithIndicatorsByPeriod:', error);
            throw error;
        }
    }
    async getPeriods() {
        const periods = await this.investasiRepository
            .createQueryBuilder('investasi')
            .select(['investasi.year', 'investasi.quarter'])
            .where('investasi.is_deleted = false')
            .groupBy('investasi.year, investasi.quarter')
            .orderBy('investasi.year', 'DESC')
            .addOrderBy('investasi.quarter', 'DESC')
            .getRawMany();
        return periods.map((p) => ({
            year: p.investasi_year,
            quarter: p.investasi_quarter,
        }));
    }
};
exports.InvestasiService = InvestasiService;
exports.InvestasiService = InvestasiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(new_investasi_section_entity_1.InvestasiSection)),
    __param(1, (0, typeorm_1.InjectRepository)(new_investasi_entity_1.Investasi)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InvestasiService);
//# sourceMappingURL=new-investasi.service.js.map