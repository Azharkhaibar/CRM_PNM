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
exports.HukumService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const hukum_entity_1 = require("./entities/hukum.entity");
const typeorm_2 = require("@nestjs/typeorm");
const hukum_section_entity_1 = require("./entities/hukum-section.entity");
let HukumService = class HukumService {
    hukumRepo;
    sectionRepo;
    constructor(hukumRepo, sectionRepo) {
        this.hukumRepo = hukumRepo;
        this.sectionRepo = sectionRepo;
    }
    validateModeSpecificFields(dto) {
        const mode = dto.mode;
        if (mode === hukum_entity_1.CalculationMode.RASIO) {
            if (dto.pembilangValue !== undefined && dto.pembilangValue < 0) {
                throw new common_1.BadRequestException('Pembilang value tidak boleh negatif untuk mode RASIO');
            }
            if (dto.penyebutValue !== undefined && dto.penyebutValue <= 0) {
                throw new common_1.BadRequestException('Penyebut value harus lebih besar dari 0 untuk mode RASIO');
            }
        }
        else if (mode === hukum_entity_1.CalculationMode.NILAI_TUNGGAL) {
            if (dto.penyebutValue !== undefined && dto.penyebutValue < 0) {
                throw new common_1.BadRequestException('Nilai penyebut tidak boleh negatif untuk mode NILAI_TUNGGAL');
            }
        }
        else if (mode === hukum_entity_1.CalculationMode.TEKS) {
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
        const existing = await this.hukumRepo.findOne({
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
        const newIndikator = this.hukumRepo.create(newIndikatorData);
        return await this.hukumRepo.save(newIndikator);
    }
    async createSection(createDto, createdBy) {
        const deletedSection = await this.sectionRepo.findOne({
            where: {
                no: createDto.no,
                parameter: createDto.parameter,
                year: createDto.year,
                quarter: createDto.quarter,
                isDeleted: true,
            },
        });
        if (deletedSection) {
            console.log(` reactiving deleted section: ${deletedSection.no} - ${deletedSection.parameter}`);
            deletedSection.isDeleted = false;
            deletedSection.isActive = createDto.isActive ?? true;
            deletedSection.description =
                createDto.description || deletedSection.description;
            deletedSection.sortOrder =
                createDto.sortOrder || deletedSection.sortOrder;
            if (createdBy) {
                deletedSection['updatedBy'] = createdBy;
                deletedSection['updatedAt'] = new Date();
            }
            return await this.sectionRepo.save(deletedSection);
        }
        const existingSection = await this.sectionRepo.findOne({
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
            bobotSection: createDto.bobotSection,
            description: createDto.description,
            sortOrder: createDto.sortOrder,
            year: createDto.year,
            quarter: createDto.quarter,
            isActive: createDto.isActive,
            isDeleted: false,
        };
        if (createdBy) {
            sectionData['createdBy'] = createdBy;
        }
        const section = this.sectionRepo.create(sectionData);
        return await this.sectionRepo.save(section);
    }
    async findAllSections(isActive) {
        const where = { isDeleted: false };
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        return await this.sectionRepo.find({
            where,
            order: { year: 'DESC', quarter: 'DESC', sortOrder: 'ASC', no: 'ASC' },
        });
    }
    async findSectionById(id) {
        try {
            console.log(`service finding by id: ${id}`);
            const section = await this.sectionRepo
                .createQueryBuilder('section')
                .where('section.id = :id', { id })
                .andWhere('section.is_deleted = false')
                .getOne();
            if (!section) {
                throw new common_1.NotFoundException(`section dengan ID ${id} tidak ditemukan`);
            }
            return section;
        }
        catch (error) {
            console.error(`error in find sectionByID service`, error);
            throw error;
        }
    }
    async findSectionsByPeriod(year, quarter) {
        return await this.sectionRepo.find({
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
        const existing = await this.sectionRepo.findOne({
            where: {
                no: checkNo,
                parameter: checkParam,
                year: checkYear,
                quarter: checkQuarter,
                isDeleted: false,
                id: (0, typeorm_1.Not)(id),
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
        return await this.sectionRepo.save(section);
    }
    async deleteSection(id) {
        const section = await this.sectionRepo.findOne({
            where: { id },
        });
        if (!section) {
            throw new common_1.NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
        }
        const indikatorCount = await this.hukumRepo.count({
            where: { sectionId: id },
        });
        if (indikatorCount > 0) {
            throw new common_1.ConflictException(`Section tidak dapat dihapus karena masih digunakan oleh ${indikatorCount} indikator`);
        }
        await this.sectionRepo.delete(id);
    }
    async findIndikatorsByPeriod(year, quarter) {
        return await this.hukumRepo.find({
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
        return await this.hukumRepo.find({
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
        const indikator = await this.hukumRepo.findOne({
            where: { id, isDeleted: false },
            relations: ['section'],
        });
        if (!indikator) {
            throw new common_1.NotFoundException(`indikator id ${id} ga ada`);
        }
        return indikator;
    }
    async findByYear(year) {
        return await this.hukumRepo.find({
            where: { year, isDeleted: false },
            relations: ['section'],
            order: { quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
        });
    }
    calculateHasil(data) {
        const mode = data.mode || hukum_entity_1.CalculationMode.RASIO;
        if (mode === hukum_entity_1.CalculationMode.TEKS) {
            return data.hasilText || null;
        }
        const pemb = data.pembilangValue || 0;
        const peny = data.penyebutValue || 0;
        if (mode === hukum_entity_1.CalculationMode.NILAI_TUNGGAL) {
            return peny !== null && peny !== undefined ? peny.toString() : null;
        }
        if (data.formula && data.formula.trim() !== '') {
            try {
                const expr = data.formula
                    .replace(/\bpemb\b/g, 'pemb')
                    .replace(/\bpeny\b/g, 'peny');
                const fn = new Function('pemb', 'peny', `return (${expr});`);
                const result = fn(pemb, peny);
                if (isFinite(result) && !isNaN(result)) {
                    if (data.isPercent) {
                        return (result * 100).toFixed(2);
                    }
                    return result.toString();
                }
            }
            catch (error) {
                console.warn('Invalid formula:', data.formula, error);
            }
        }
        if (peny === 0) {
            return null;
        }
        const result = pemb / peny;
        if (data.isPercent) {
            return (result * 100).toFixed(2);
        }
        return result.toString();
    }
    async createIndikator(createDto, createdBy) {
        const section = await this.findSectionById(createDto.sectionId);
        const deletedIndikator = await this.hukumRepo.findOne({
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
            return await this.hukumRepo.save(deletedIndikator);
        }
        const existingIndikator = await this.hukumRepo.findOne({
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
        const strategikData = {
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
            strategikData.createdBy = createdBy;
        }
        const strategik = this.hukumRepo.create(strategikData);
        return await this.hukumRepo.save(strategik);
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
            const existing = await this.hukumRepo.findOne({
                where: {
                    year,
                    quarter,
                    sectionId,
                    subNo,
                    isDeleted: false,
                    id: (0, typeorm_1.Not)(id),
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
        return await this.hukumRepo.save(indikator);
    }
    async deleteIndikator(id) {
        const indikator = await this.hukumRepo.findOne({
            where: { id },
        });
        if (!indikator) {
            throw new common_1.NotFoundException(`indikator id ${id} ga ada`);
        }
        indikator.isDeleted = true;
        await this.hukumRepo.delete(id);
    }
    async searchIndikators(query, year, quarter) {
        const where = { isDeleted: false };
        if (year)
            where.year = year;
        if (quarter)
            where.quarter = quarter;
        if (query) {
            const searchConditions = [
                { subNo: (0, typeorm_1.Like)(`%${query}%`), ...where },
                { indikator: (0, typeorm_1.Like)(`%${query}%`), ...where },
                { sumberRisiko: (0, typeorm_1.Like)(`%${query}%`), ...where },
                { dampak: (0, typeorm_1.Like)(`%${query}%`), ...where },
                { keterangan: (0, typeorm_1.Like)(`%${query}%`), ...where },
                { hasilText: (0, typeorm_1.Like)(`%${query}%`), ...where },
            ];
            return await this.hukumRepo.find({
                where: searchConditions,
                relations: ['section'],
            });
        }
        return await this.hukumRepo.find({
            where,
            relations: ['section'],
        });
    }
    async getTotalWeightedByPeriod(year, quarter) {
        const result = await this.hukumRepo
            .createQueryBuilder('hukum')
            .select('SUM(hukum.weighted)', 'total')
            .where('hukum.year = :year', { year })
            .andWhere('hukum.quarter = :quarter', { quarter })
            .andWhere('hukum.is_deleted = false')
            .getRawOne();
        return parseFloat(result?.total || 0) || 0;
    }
    async getIndikatorCountByPeriod(year, quarter) {
        try {
            const result = await this.hukumRepo
                .createQueryBuilder('hukum')
                .select('COUNT(hukum.id)', 'count')
                .where('hukum.year = :year', { year })
                .andWhere('hukum.quarter = :quarter', { quarter })
                .andWhere('hukum.is_deleted = false')
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
            const sections = await this.sectionRepo.find({
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
                const indicators = await this.hukumRepo.find({
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
    async deleteByPeriod(year, quarter) {
        const result = await this.hukumRepo.update({ year, quarter }, { isDeleted: true, deletedAt: new Date() });
        return result.affected || 0;
    }
    async getPeriods() {
        const periods = await this.hukumRepo
            .createQueryBuilder('hukum')
            .select(['hukum.year', 'hukum.quarter'])
            .where('hukum.is_deleted = false')
            .groupBy('hukum.year, hukum.quarter')
            .orderBy('hukum.year', 'DESC')
            .addOrderBy('hukum.quarter', 'DESC')
            .getRawMany();
        return periods.map((p) => ({
            year: p.hukum_year,
            quarter: p.hukum_quarter,
        }));
    }
};
exports.HukumService = HukumService;
exports.HukumService = HukumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(hukum_entity_1.Hukum)),
    __param(1, (0, typeorm_2.InjectRepository)(hukum_section_entity_1.HukumSection)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], HukumService);
//# sourceMappingURL=hukum.service.js.map