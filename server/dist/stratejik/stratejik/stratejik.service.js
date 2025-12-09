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
exports.StratejikService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const stratejik_entity_1 = require("./entities/stratejik.entity");
const typeorm_2 = require("@nestjs/typeorm");
const stratejik_section_entity_1 = require("./entities/stratejik-section.entity");
let StratejikService = class StratejikService {
    stratejikRepo;
    sectionRepo;
    constructor(stratejikRepo, sectionRepo) {
        this.stratejikRepo = stratejikRepo;
        this.sectionRepo = sectionRepo;
    }
    async createSection(data) {
        const existing = await this.sectionRepo.findOne({
            where: { no: data.no },
            withDeleted: true,
        });
        if (existing) {
            if (!existing.isDeleted) {
                throw new common_1.BadRequestException(`Section dengan nomor "${data.no}" sudah ada`);
            }
            existing.isDeleted = false;
            Object.assign(existing, data);
            return await this.sectionRepo.save(existing);
        }
        const section = this.sectionRepo.create(data);
        return await this.sectionRepo.save(section);
    }
    async findAllSection() {
        return await this.sectionRepo.find({
            where: { isDeleted: false },
            order: { no: 'ASC' },
        });
    }
    async findSectionById(id) {
        const section = await this.sectionRepo.findOne({
            where: { id, isDeleted: false },
        });
        if (!section) {
            throw new common_1.NotFoundException(`Section with ID ${id} not found`);
        }
        return section;
    }
    async updateSection(id, data) {
        const section = await this.findSectionById(id);
        if (data.no !== undefined && data.no !== section.no) {
            const existing = await this.sectionRepo.findOne({
                where: { no: data.no },
                withDeleted: true,
            });
            if (existing) {
                if (!existing.isDeleted && existing.id !== id) {
                    throw new common_1.BadRequestException(`Section dengan nomor "${data.no}" sudah ada`);
                }
                if (existing.isDeleted) {
                    await this.sectionRepo.remove(existing);
                }
            }
        }
        Object.assign(section, data);
        return await this.sectionRepo.save(section);
    }
    async deleteSection(id) {
        const section = await this.findSectionById(id);
        section.isDeleted = true;
        await this.sectionRepo.save(section);
    }
    async findAll() {
        return await this.stratejikRepo.find({
            where: { isDeleted: false },
            relations: ['section'],
            select: [
                'id',
                'year',
                'quarter',
                'no',
                'subNo',
                'indikator',
                'bobotSection',
                'bobotIndikator',
                'hasil',
                'peringkat',
                'weighted',
                'mode',
                'sectionLabel',
            ],
            order: { year: 'DESC', quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
        });
    }
    async findOne(id) {
        const stratejik = await this.stratejikRepo.findOne({
            where: { id, isDeleted: false },
            relations: ['section'],
        });
        if (!stratejik) {
            throw new common_1.NotFoundException(`Stratejik with id ${id} not found`);
        }
        return stratejik;
    }
    async remove(id) {
        const stratejik = await this.findOne(id);
        stratejik.isDeleted = true;
        stratejik.deletedAt = new Date();
        await this.stratejikRepo.save(stratejik);
    }
    async findByPeriod(year, quarter) {
        return await this.stratejikRepo.find({
            where: { year, quarter, isDeleted: false },
            relations: ['section'],
            order: { no: 'ASC', subNo: 'ASC' },
        });
    }
    async findById(id) {
        return this.findOne(id);
    }
    calculateHasil(data) {
        const mode = data.mode || stratejik_entity_1.CalculationMode.RASIO;
        if (mode === stratejik_entity_1.CalculationMode.TEKS) {
            return data.hasilText || null;
        }
        const pemb = data.pembilangValue || 0;
        const peny = data.penyebutValue || 0;
        if (mode === stratejik_entity_1.CalculationMode.NILAI_TUNGGAL) {
            return peny.toString();
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
    calculateWeight(data) {
        const sectionBobot = data.bobotSection || 0;
        const indicatorBobot = data.bobotIndikator || 0;
        const peringkat = data.peringkat || 1;
        return (sectionBobot * indicatorBobot * peringkat) / 10000;
    }
    async create(data) {
        const section = await this.findSectionById(data.sectionId);
        const existing = await this.stratejikRepo.findOne({
            where: {
                year: data.year,
                quarter: data.quarter,
                subNo: data.subNo,
                isDeleted: false,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Stratejik with subNo ${data.subNo} already exists for ${data.year} ${data.quarter}`);
        }
        const hasil = this.calculateHasil(data);
        const weighted = data.weighted || this.calculateWeight(data);
        const stratejikData = {
            ...data,
            sectionLabel: section.parameter,
            hasil,
            hasilText: data.mode === stratejik_entity_1.CalculationMode.TEKS ? data.hasilText : null,
            weighted,
            section,
            sumberRisiko: data.sumberRisiko || null,
            dampak: data.dampak || null,
            low: data.low || null,
            lowToModerate: data.lowToModerate || null,
            moderate: data.moderate || null,
            moderateToHigh: data.moderateToHigh || null,
            high: data.high || null,
            pembilangLabel: data.pembilangLabel || null,
            pembilangValue: data.pembilangValue !== undefined ? data.pembilangValue : null,
            penyebutLabel: data.penyebutLabel || null,
            penyebutValue: data.penyebutValue !== undefined ? data.penyebutValue : null,
            formula: data.formula || null,
            keterangan: data.keterangan || null,
        };
        const stratejik = this.stratejikRepo.create(stratejikData);
        return await this.stratejikRepo.save(stratejik);
    }
    async update(id, data) {
        const stratejik = await this.findOne(id);
        if (data.sectionId && data.sectionId !== stratejik.sectionId) {
            const newSection = await this.findSectionById(data.sectionId);
            stratejik.section = newSection;
            stratejik.sectionId = newSection.id;
            stratejik.sectionLabel = newSection.parameter;
        }
        if (data.no !== undefined)
            stratejik.no = data.no;
        if (data.sectionLabel !== undefined)
            stratejik.sectionLabel = data.sectionLabel;
        if (data.bobotSection !== undefined)
            stratejik.bobotSection = data.bobotSection;
        if (data.subNo !== undefined)
            stratejik.subNo = data.subNo;
        if (data.indikator !== undefined)
            stratejik.indikator = data.indikator;
        if (data.bobotIndikator !== undefined)
            stratejik.bobotIndikator = data.bobotIndikator;
        if (data.mode !== undefined)
            stratejik.mode = data.mode;
        if (data.peringkat !== undefined)
            stratejik.peringkat = data.peringkat;
        if (data.weighted !== undefined)
            stratejik.weighted = data.weighted;
        if (data.isPercent !== undefined)
            stratejik.isPercent = data.isPercent;
        if (data.hasilText !== undefined)
            stratejik.hasilText = data.hasilText || null;
        if (data.pembilangLabel !== undefined)
            stratejik.pembilangLabel = data.pembilangLabel || null;
        if (data.pembilangValue !== undefined)
            stratejik.pembilangValue = data.pembilangValue;
        if (data.penyebutLabel !== undefined)
            stratejik.penyebutLabel = data.penyebutLabel || null;
        if (data.penyebutValue !== undefined)
            stratejik.penyebutValue = data.penyebutValue;
        if (data.formula !== undefined)
            stratejik.formula = data.formula || null;
        if (data.sumberRisiko !== undefined)
            stratejik.sumberRisiko = data.sumberRisiko || null;
        if (data.dampak !== undefined)
            stratejik.dampak = data.dampak || null;
        if (data.keterangan !== undefined)
            stratejik.keterangan = data.keterangan || null;
        if (data.low !== undefined)
            stratejik.low = data.low || null;
        if (data.lowToModerate !== undefined)
            stratejik.lowToModerate = data.lowToModerate || null;
        if (data.moderate !== undefined)
            stratejik.moderate = data.moderate || null;
        if (data.moderateToHigh !== undefined)
            stratejik.moderateToHigh = data.moderateToHigh || null;
        if (data.high !== undefined)
            stratejik.high = data.high || null;
        const shouldRecalculateHasil = data.mode !== undefined ||
            data.pembilangValue !== undefined ||
            data.penyebutValue !== undefined ||
            data.formula !== undefined ||
            data.isPercent !== undefined;
        if (shouldRecalculateHasil) {
            const mode = data.mode !== undefined ? data.mode : stratejik.mode;
            const calculationData = {
                mode,
                pembilangValue: stratejik.pembilangValue,
                penyebutValue: stratejik.penyebutValue,
                formula: stratejik.formula,
                isPercent: stratejik.isPercent,
                hasilText: stratejik.hasilText,
            };
            stratejik.hasil = this.calculateHasil(calculationData);
        }
        const shouldRecalculateWeight = data.bobotSection !== undefined ||
            data.bobotIndikator !== undefined ||
            data.peringkat !== undefined;
        if (shouldRecalculateWeight && !data.weighted) {
            const weightData = {
                bobotSection: stratejik.bobotSection,
                bobotIndikator: stratejik.bobotIndikator,
                peringkat: stratejik.peringkat,
            };
            stratejik.weighted = this.calculateWeight(weightData);
        }
        return await this.stratejikRepo.save(stratejik);
    }
    async delete(id) {
        const stratejik = await this.findOne(id);
        stratejik.isDeleted = true;
        stratejik.deletedAt = new Date();
        await this.stratejikRepo.save(stratejik);
    }
    async bulkCreate(data) {
        if (!data || data.length === 0) {
            throw new common_1.BadRequestException('Data array tidak boleh kosong');
        }
        if (data.length > 100) {
            throw new common_1.BadRequestException('Maksimal 100 data per request');
        }
        const createdItems = [];
        const queryRunner = this.stratejikRepo.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of data) {
                const created = await this.create(item);
                createdItems.push(created);
            }
            await queryRunner.commitTransaction();
            return createdItems;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(`Gagal membuat data: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findByYear(year) {
        return await this.stratejikRepo.find({
            where: { year, isDeleted: false },
            relations: ['section'],
            order: { quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
        });
    }
    async getSummary(year, quarter) {
        const items = await this.findByPeriod(year, quarter);
        const totalWeighted = items.reduce((sum, item) => sum + (item.weighted || 0), 0);
        const sections = items.reduce((acc, item) => {
            const sectionId = item.sectionId;
            if (!acc[sectionId]) {
                acc[sectionId] = {
                    section: item.section,
                    items: [],
                    totalWeighted: 0,
                };
            }
            acc[sectionId].items.push(item);
            acc[sectionId].totalWeighted += item.weighted || 0;
            return acc;
        }, {});
        return {
            year,
            quarter,
            totalItems: items.length,
            totalWeighted,
            sections: Object.values(sections),
            items,
        };
    }
    async findBySection(sectionId, year, quarter) {
        const where = {
            sectionId,
            isDeleted: false,
        };
        if (year !== undefined) {
            where.year = year;
        }
        if (quarter !== undefined) {
            where.quarter = quarter;
        }
        return await this.stratejikRepo.find({
            where,
            relations: ['section'],
            order: {
                year: 'DESC',
                quarter: 'ASC',
                subNo: 'ASC',
            },
        });
    }
};
exports.StratejikService = StratejikService;
exports.StratejikService = StratejikService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(stratejik_entity_1.Stratejik)),
    __param(1, (0, typeorm_2.InjectRepository)(stratejik_section_entity_1.StratejikSection)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], StratejikService);
//# sourceMappingURL=stratejik.service.js.map