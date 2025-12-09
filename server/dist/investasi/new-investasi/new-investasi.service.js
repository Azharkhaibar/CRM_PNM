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
const new_investasi_entity_1 = require("./entities/new-investasi.entity");
const new_investasi_section_entity_1 = require("./entities/new-investasi-section.entity");
let InvestasiService = class InvestasiService {
    investasiRepo;
    sectionRepo;
    constructor(investasiRepo, sectionRepo) {
        this.investasiRepo = investasiRepo;
        this.sectionRepo = sectionRepo;
    }
    async findAllSections() {
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
    async createSection(data) {
        const existing = await this.sectionRepo.findOne({
            where: { no: data.no },
            withDeleted: true,
        });
        if (existing) {
            if (!existing.isDeleted) {
                throw new common_1.BadRequestException(`Section dengan no ${data.no} sudah ada`);
            }
            existing.isDeleted = false;
            Object.assign(existing, data);
            return await this.sectionRepo.save(existing);
        }
        const section = this.sectionRepo.create(data);
        return await this.sectionRepo.save(section);
    }
    async updateSection(id, data) {
        const section = await this.findSectionById(id);
        if (data.no && data.no !== section.no) {
            const existingWithNewNo = await this.sectionRepo.findOne({
                where: { no: data.no },
                withDeleted: true,
            });
            if (existingWithNewNo) {
                if (!existingWithNewNo.isDeleted && existingWithNewNo.id !== id) {
                    throw new common_1.BadRequestException(`Section dengan no ${data.no} sudah ada`);
                }
                if (existingWithNewNo.isDeleted) {
                    await this.sectionRepo.remove(existingWithNewNo);
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
    async findByPeriod(year, quarter) {
        return await this.investasiRepo.find({
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
    async findById(id) {
        const investasi = await this.investasiRepo.findOne({
            where: { id, isDeleted: false },
            relations: ['section'],
        });
        if (!investasi) {
            throw new common_1.NotFoundException(`Investasi with ID ${id} not found`);
        }
        return investasi;
    }
    async create(data) {
        const section = await this.findSectionById(data.sectionId);
        const hasil = this.calculateHasil(data);
        const weighted = this.calculateWeighted(data);
        const { no, sectionLabel, bobotSection, ...restData } = data;
        const investasi = this.investasiRepo.create({
            ...restData,
            hasil,
            weighted,
            section,
            no: section.no,
            sectionLabel: section.parameter,
            bobotSection: section.bobotSection,
        });
        return await this.investasiRepo.save(investasi);
    }
    async update(id, data) {
        const investasi = await this.findById(id);
        if (data.sectionId && data.sectionId !== investasi.sectionId) {
            const section = await this.findSectionById(data.sectionId);
            if (data.no !== section.no) {
                throw new common_1.BadRequestException('Section no mismatch');
            }
            investasi.section = section;
        }
        const hasil = this.calculateHasil(data);
        const weighted = this.calculateWeighted(data);
        Object.assign(investasi, data, { hasil, weighted });
        return await this.investasiRepo.save(investasi);
    }
    async delete(id) {
        const investasi = await this.findById(id);
        investasi.isDeleted = true;
        investasi.deletedAt = new Date();
        await this.investasiRepo.save(investasi);
    }
    async getSummary(year, quarter) {
        const investasiList = await this.findByPeriod(year, quarter);
        const totalWeighted = investasiList.reduce((sum, item) => sum + Number(item.weighted || 0), 0);
        const sections = new Set(investasiList.map((item) => item.sectionLabel));
        return {
            year,
            quarter,
            totalIndicators: investasiList.length,
            totalSections: sections.size,
            totalWeighted: parseFloat(totalWeighted.toFixed(4)),
            averageRating: investasiList.length > 0
                ? parseFloat((investasiList.reduce((sum, item) => sum + item.peringkat, 0) /
                    investasiList.length).toFixed(2))
                : 0,
        };
    }
    calculateHasil(data) {
        if (data.mode === new_investasi_entity_1.CalculationMode.NILAI_TUNGGAL) {
            return data.denominatorValue || 0;
        }
        if (!data.denominatorValue || data.denominatorValue === 0) {
            return 0;
        }
        if (data.formula && data.formula.trim() !== '') {
            try {
                const fn = new Function('pemb', 'peny', `return (${data.formula});`);
                const result = fn(data.numeratorValue || 0, data.denominatorValue || 0);
                if (!isFinite(result) || isNaN(result)) {
                    throw new Error('Invalid formula result');
                }
                return data.isPercent ? result * 100 : result;
            }
            catch (error) {
                throw new common_1.BadRequestException(`Invalid formula: ${error.message}`);
            }
        }
        const numerator = data.numeratorValue || 0;
        const denominator = data.denominatorValue || 0;
        const result = denominator === 0 ? 0 : numerator / denominator;
        return data.isPercent ? result * 100 : result;
    }
    calculateWeighted(data) {
        const bobotSection = data.bobotSection || 0;
        const bobotIndikator = data.bobotIndikator || 0;
        const peringkat = data.peringkat || 1;
        const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
        return parseFloat(weighted.toFixed(4));
    }
};
exports.InvestasiService = InvestasiService;
exports.InvestasiService = InvestasiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(new_investasi_entity_1.Investasi)),
    __param(1, (0, typeorm_1.InjectRepository)(new_investasi_section_entity_1.InvestasiSection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InvestasiService);
//# sourceMappingURL=new-investasi.service.js.map