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
        return await this.hukumRepo.find({
            where: { isDeleted: false },
            relations: ['section'],
            order: { year: 'DESC', quarter: 'ASC', no: 'ASC', subNo: 'ASC' },
        });
    }
    async findOne(id) {
        const hukum = await this.hukumRepo.findOne({
            where: { id, isDeleted: false },
            relations: ['section'],
        });
        if (!hukum) {
            throw new common_1.NotFoundException(`Hukum with id ${id} not found`);
        }
        return hukum;
    }
    async remove(id) {
        const hukum = await this.findOne(id);
        hukum.isDeleted = true;
        hukum.deletedAt = new Date();
        await this.hukumRepo.save(hukum);
    }
    async findByPeriod(year, quarter) {
        return await this.hukumRepo.find({
            where: { year, quarter, isDeleted: false },
            relations: ['section'],
            order: { no: 'ASC', subNo: 'ASC' },
        });
    }
    async findById(id) {
        return this.findOne(id);
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
    calculateWeight(data, sectionBobot) {
        const indicatorBobot = data.bobotIndikator || 0;
        const peringkat = data.peringkat || 1;
        return (sectionBobot * indicatorBobot * peringkat) / 10000;
    }
    async create(data) {
        const section = await this.findSectionById(data.sectionId);
        const existing = await this.hukumRepo.findOne({
            where: {
                year: data.year,
                quarter: data.quarter,
                sectionId: data.sectionId,
                subNo: data.subNo,
                isDeleted: false,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Hukum dengan subNo ${data.subNo} sudah ada untuk periode ${data.year} ${data.quarter} di section ini`);
        }
        const hasil = this.calculateHasil(data);
        const weighted = data.weighted || this.calculateWeight(data, section.bobotSection);
        const hukumData = {
            year: data.year,
            quarter: data.quarter,
            sectionId: data.sectionId,
            section,
            no: section.no,
            sectionLabel: section.parameter,
            bobotSection: section.bobotSection,
            subNo: data.subNo,
            indikator: data.indikator,
            bobotIndikator: data.bobotIndikator,
            sumberRisiko: data.sumberRisiko || null,
            dampak: data.dampak || null,
            low: data.low || null,
            lowToModerate: data.lowToModerate || null,
            moderate: data.moderate || null,
            moderateToHigh: data.moderateToHigh || null,
            high: data.high || null,
            mode: data.mode,
            formula: data.formula || null,
            isPercent: data.isPercent || false,
            pembilangLabel: data.pembilangLabel || null,
            pembilangValue: data.pembilangValue !== undefined ? data.pembilangValue : null,
            penyebutLabel: data.penyebutLabel || null,
            penyebutValue: data.penyebutValue !== undefined ? data.penyebutValue : null,
            hasil: hasil,
            hasilText: data.hasilText || null,
            peringkat: data.peringkat,
            weighted: weighted,
            keterangan: data.keterangan || null,
        };
        const hukum = this.hukumRepo.create(hukumData);
        return await this.hukumRepo.save(hukum);
    }
    async update(id, data) {
        const hukum = await this.findOne(id);
        if (data.sectionId && data.sectionId !== hukum.sectionId) {
            const newSection = await this.findSectionById(data.sectionId);
            hukum.section = newSection;
            hukum.sectionId = newSection.id;
            hukum.sectionLabel = newSection.parameter;
            hukum.no = newSection.no;
            hukum.bobotSection = newSection.bobotSection;
        }
        if (data.subNo !== undefined)
            hukum.subNo = data.subNo;
        if (data.indikator !== undefined)
            hukum.indikator = data.indikator;
        if (data.bobotIndikator !== undefined)
            hukum.bobotIndikator = data.bobotIndikator;
        if (data.mode !== undefined)
            hukum.mode = data.mode;
        if (data.peringkat !== undefined)
            hukum.peringkat = data.peringkat;
        if (data.weighted !== undefined)
            hukum.weighted = data.weighted;
        if (data.isPercent !== undefined)
            hukum.isPercent = data.isPercent;
        if (data.hasilText !== undefined)
            hukum.hasilText = data.hasilText || null;
        if (data.pembilangLabel !== undefined)
            hukum.pembilangLabel = data.pembilangLabel || null;
        if (data.pembilangValue !== undefined)
            hukum.pembilangValue = data.pembilangValue;
        if (data.penyebutLabel !== undefined)
            hukum.penyebutLabel = data.penyebutLabel || null;
        if (data.penyebutValue !== undefined)
            hukum.penyebutValue = data.penyebutValue;
        if (data.formula !== undefined)
            hukum.formula = data.formula || null;
        if (data.sumberRisiko !== undefined)
            hukum.sumberRisiko = data.sumberRisiko || null;
        if (data.dampak !== undefined)
            hukum.dampak = data.dampak || null;
        if (data.keterangan !== undefined)
            hukum.keterangan = data.keterangan || null;
        if (data.low !== undefined)
            hukum.low = data.low || null;
        if (data.lowToModerate !== undefined)
            hukum.lowToModerate = data.lowToModerate || null;
        if (data.moderate !== undefined)
            hukum.moderate = data.moderate || null;
        if (data.moderateToHigh !== undefined)
            hukum.moderateToHigh = data.moderateToHigh || null;
        if (data.high !== undefined)
            hukum.high = data.high || null;
        const shouldRecalculateHasil = data.mode !== undefined ||
            data.pembilangValue !== undefined ||
            data.penyebutValue !== undefined ||
            data.formula !== undefined ||
            data.isPercent !== undefined ||
            data.hasilText !== undefined;
        if (shouldRecalculateHasil) {
            const mode = data.mode !== undefined ? data.mode : hukum.mode;
            const calculationData = {
                mode,
                pembilangValue: hukum.pembilangValue,
                penyebutValue: hukum.penyebutValue,
                formula: hukum.formula,
                isPercent: hukum.isPercent,
                hasilText: hukum.hasilText,
            };
            const newHasil = this.calculateHasil(calculationData);
            hukum.hasil = newHasil;
        }
        const shouldRecalculateWeight = data.bobotIndikator !== undefined ||
            data.peringkat !== undefined ||
            (data.sectionId && data.sectionId !== hukum.sectionId);
        if (shouldRecalculateWeight && !data.weighted) {
            const weightData = {
                bobotIndikator: data.bobotIndikator !== undefined
                    ? data.bobotIndikator
                    : hukum.bobotIndikator,
                peringkat: data.peringkat !== undefined ? data.peringkat : hukum.peringkat,
            };
            hukum.weighted = this.calculateWeight(weightData, hukum.bobotSection);
        }
        return await this.hukumRepo.save(hukum);
    }
    async delete(id) {
        const hukum = await this.findOne(id);
        hukum.isDeleted = true;
        hukum.deletedAt = new Date();
        await this.hukumRepo.save(hukum);
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
                    await this.hukumRepo.remove(created);
                }
                throw error;
            }
        }
        return createdItems;
    }
    async findByYear(year) {
        return await this.hukumRepo.find({
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
        return await this.hukumRepo.find({
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
        const result = await this.hukumRepo.update({ year, quarter }, { isDeleted: true, deletedAt: new Date() });
        return result.affected || 0;
    }
    async getStructuredData(year, quarter) {
        const items = await this.findByPeriod(year, quarter);
        const grouped = items.reduce((acc, item) => {
            const sectionId = item.sectionId;
            if (!acc[sectionId]) {
                acc[sectionId] = {
                    section: item.section,
                    indicators: [],
                };
            }
            acc[sectionId].indicators.push(item);
            return acc;
        }, {});
        const sectionsArray = Object.values(grouped);
        sectionsArray.sort((a, b) => {
            return a.section.no.localeCompare(b.section.no, undefined, {
                numeric: true,
                sensitivity: 'base',
            });
        });
        return sectionsArray;
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