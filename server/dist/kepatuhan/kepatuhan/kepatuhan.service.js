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
exports.KepatuhanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const kepatuhan_entity_1 = require("./entities/kepatuhan.entity");
const typeorm_2 = require("@nestjs/typeorm");
const kepatuhan_section_entity_1 = require("./entities/kepatuhan-section.entity");
let KepatuhanService = class KepatuhanService {
    kepatuhanRepo;
    sectionRepo;
    constructor(kepatuhanRepo, sectionRepo) {
        this.kepatuhanRepo = kepatuhanRepo;
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
            order: { sortOrder: 'ASC', no: 'ASC' },
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
        return await this.kepatuhanRepo.find({
            where: { isDeleted: false },
            relations: ['section'],
            order: { year: 'DESC', quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
        });
    }
    async findOne(id) {
        const kepatuhan = await this.kepatuhanRepo.findOne({
            where: { id, isDeleted: false },
            relations: ['section'],
        });
        if (!kepatuhan) {
            throw new common_1.NotFoundException(`Kepatuhan with id ${id} not found`);
        }
        return kepatuhan;
    }
    async remove(id) {
        const kepatuhan = await this.findOne(id);
        kepatuhan.isDeleted = true;
        kepatuhan.deletedAt = new Date();
        await this.kepatuhanRepo.save(kepatuhan);
    }
    async findByPeriod(year, quarter) {
        return await this.kepatuhanRepo.find({
            where: { year, quarter, isDeleted: false },
            relations: ['section'],
            order: { no: 'ASC', subNo: 'ASC' },
        });
    }
    async findById(id) {
        return this.findOne(id);
    }
    calculateHasil(data) {
        const mode = data.mode || kepatuhan_entity_1.CalculationMode.RASIO;
        if (mode === kepatuhan_entity_1.CalculationMode.TEKS) {
            return data.hasilText || null;
        }
        const pemb = data.pembilangValue || 0;
        const peny = data.penyebutValue || 0;
        if (mode === kepatuhan_entity_1.CalculationMode.NILAI_TUNGGAL) {
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
        if (pemb === 0) {
            return null;
        }
        const result = peny / pemb;
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
        const existing = await this.kepatuhanRepo.findOne({
            where: {
                year: data.year,
                quarter: data.quarter,
                subNo: data.subNo,
                isDeleted: false,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Kepatuhan dengan subNo ${data.subNo} sudah ada untuk periode ${data.year} ${data.quarter}`);
        }
        const hasil = this.calculateHasil(data);
        const weighted = data.weighted || this.calculateWeight(data);
        const kepatuhanData = {
            ...data,
            sectionLabel: section.parameter,
            hasil,
            hasilText: data.mode === kepatuhan_entity_1.CalculationMode.TEKS ? data.hasilText : null,
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
        const kepatuhan = this.kepatuhanRepo.create(kepatuhanData);
        return await this.kepatuhanRepo.save(kepatuhan);
    }
    async update(id, data) {
        const kepatuhan = await this.findOne(id);
        if (data.sectionId && data.sectionId !== kepatuhan.sectionId) {
            const newSection = await this.findSectionById(data.sectionId);
            kepatuhan.section = newSection;
            kepatuhan.sectionId = newSection.id;
            kepatuhan.sectionLabel = newSection.parameter;
        }
        if (data.no !== undefined)
            kepatuhan.no = data.no;
        if (data.sectionLabel !== undefined)
            kepatuhan.sectionLabel = data.sectionLabel;
        if (data.bobotSection !== undefined)
            kepatuhan.bobotSection = data.bobotSection;
        if (data.subNo !== undefined)
            kepatuhan.subNo = data.subNo;
        if (data.indikator !== undefined)
            kepatuhan.indikator = data.indikator;
        if (data.bobotIndikator !== undefined)
            kepatuhan.bobotIndikator = data.bobotIndikator;
        if (data.mode !== undefined)
            kepatuhan.mode = data.mode;
        if (data.peringkat !== undefined)
            kepatuhan.peringkat = data.peringkat;
        if (data.weighted !== undefined)
            kepatuhan.weighted = data.weighted;
        if (data.isPercent !== undefined)
            kepatuhan.isPercent = data.isPercent;
        if (data.hasilText !== undefined)
            kepatuhan.hasilText = data.hasilText || null;
        if (data.pembilangLabel !== undefined)
            kepatuhan.pembilangLabel = data.pembilangLabel || null;
        if (data.pembilangValue !== undefined)
            kepatuhan.pembilangValue = data.pembilangValue;
        if (data.penyebutLabel !== undefined)
            kepatuhan.penyebutLabel = data.penyebutLabel || null;
        if (data.penyebutValue !== undefined)
            kepatuhan.penyebutValue = data.penyebutValue;
        if (data.formula !== undefined)
            kepatuhan.formula = data.formula || null;
        if (data.sumberRisiko !== undefined)
            kepatuhan.sumberRisiko = data.sumberRisiko || null;
        if (data.dampak !== undefined)
            kepatuhan.dampak = data.dampak || null;
        if (data.keterangan !== undefined)
            kepatuhan.keterangan = data.keterangan || null;
        if (data.low !== undefined)
            kepatuhan.low = data.low || null;
        if (data.lowToModerate !== undefined)
            kepatuhan.lowToModerate = data.lowToModerate || null;
        if (data.moderate !== undefined)
            kepatuhan.moderate = data.moderate || null;
        if (data.moderateToHigh !== undefined)
            kepatuhan.moderateToHigh = data.moderateToHigh || null;
        if (data.high !== undefined)
            kepatuhan.high = data.high || null;
        const shouldRecalculateHasil = data.mode !== undefined ||
            data.pembilangValue !== undefined ||
            data.penyebutValue !== undefined ||
            data.formula !== undefined ||
            data.isPercent !== undefined;
        if (shouldRecalculateHasil) {
            const mode = data.mode !== undefined ? data.mode : kepatuhan.mode;
            const calculationData = {
                mode,
                pembilangValue: kepatuhan.pembilangValue,
                penyebutValue: kepatuhan.penyebutValue,
                formula: kepatuhan.formula,
                isPercent: kepatuhan.isPercent,
                hasilText: kepatuhan.hasilText,
            };
            kepatuhan.hasil = this.calculateHasil(calculationData);
        }
        const shouldRecalculateWeight = data.bobotSection !== undefined ||
            data.bobotIndikator !== undefined ||
            data.peringkat !== undefined;
        if (shouldRecalculateWeight && !data.weighted) {
            const weightData = {
                bobotSection: kepatuhan.bobotSection,
                bobotIndikator: kepatuhan.bobotIndikator,
                peringkat: kepatuhan.peringkat,
            };
            kepatuhan.weighted = this.calculateWeight(weightData);
        }
        return await this.kepatuhanRepo.save(kepatuhan);
    }
    async delete(id) {
        const kepatuhan = await this.findOne(id);
        kepatuhan.isDeleted = true;
        kepatuhan.deletedAt = new Date();
        await this.kepatuhanRepo.save(kepatuhan);
    }
    async bulkCreate(data) {
        const createdItems = [];
        for (const item of data) {
            try {
                const created = await this.create(item);
                createdItems.push(created);
            }
            catch (error) {
                for (const created of createdItems) {
                    await this.kepatuhanRepo.remove(created);
                }
                throw error;
            }
        }
        return createdItems;
    }
    async findByYear(year) {
        return await this.kepatuhanRepo.find({
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
        return await this.kepatuhanRepo.find({
            where,
            relations: ['section'],
            order: {
                year: 'DESC',
                quarter: 'ASC',
                subNo: 'ASC',
            },
        });
    }
    async deleteByPeriod(year, quarter) {
        const result = await this.kepatuhanRepo.update({ year, quarter }, { isDeleted: true, deletedAt: new Date() });
        return result.affected || 0;
    }
};
exports.KepatuhanService = KepatuhanService;
exports.KepatuhanService = KepatuhanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(kepatuhan_entity_1.Kepatuhan)),
    __param(1, (0, typeorm_2.InjectRepository)(kepatuhan_section_entity_1.KepatuhanSection)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], KepatuhanService);
//# sourceMappingURL=kepatuhan.service.js.map