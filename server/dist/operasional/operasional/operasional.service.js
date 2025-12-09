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
exports.OperationalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const operasional_entity_1 = require("./entities/operasional.entity");
const operasional_section_entity_1 = require("./entities/operasional-section.entity");
let OperationalService = class OperationalService {
    operationalRepository;
    sectionRepository;
    constructor(operationalRepository, sectionRepository) {
        this.operationalRepository = operationalRepository;
        this.sectionRepository = sectionRepository;
    }
    async createSection(createSectionDto) {
        if (createSectionDto.bobotSection < 0 ||
            createSectionDto.bobotSection > 100) {
            throw new common_1.ConflictException('Bobot section harus antara 0 dan 100 persen');
        }
        const existingSection = await this.sectionRepository.findOne({
            where: {
                year: createSectionDto.year,
                quarter: createSectionDto.quarter,
                no: createSectionDto.no,
                isDeleted: false,
            },
        });
        if (existingSection) {
            throw new common_1.ConflictException(`Section dengan tahun ${createSectionDto.year}, quarter ${createSectionDto.quarter}, dan nomor ${createSectionDto.no} sudah ada`);
        }
        const noPattern = /^[0-9]+(\.[0-9]+)*$/;
        if (!noPattern.test(createSectionDto.no)) {
            throw new common_1.ConflictException('Format nomor section tidak valid. Gunakan format seperti "1.1" atau "2.3.1"');
        }
        const section = this.sectionRepository.create({
            no: createSectionDto.no,
            bobotSection: createSectionDto.bobotSection,
            parameter: createSectionDto.parameter.trim(),
            year: createSectionDto.year,
            quarter: createSectionDto.quarter,
            isDeleted: false,
        });
        return await this.sectionRepository.save(section);
    }
    async updateSection(id, updateSectionDto) {
        const section = await this.sectionRepository.findOne({
            where: { id, isDeleted: false },
        });
        if (!section) {
            throw new common_1.NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
        }
        if (updateSectionDto.year !== undefined ||
            updateSectionDto.quarter !== undefined ||
            updateSectionDto.no !== undefined) {
            const year = updateSectionDto.year ?? section.year;
            const quarter = updateSectionDto.quarter ?? section.quarter;
            const no = updateSectionDto.no ?? section.no;
            const duplicate = await this.sectionRepository.findOne({
                where: {
                    year,
                    quarter,
                    no,
                    isDeleted: false,
                    id: (0, typeorm_2.Not)(id),
                },
            });
            if (duplicate) {
                throw new common_1.ConflictException(`Section dengan tahun ${year}, quarter ${quarter}, dan nomor ${no} sudah ada`);
            }
        }
        Object.assign(section, updateSectionDto);
        return await this.sectionRepository.save(section);
    }
    async deleteSection(id) {
        const section = await this.sectionRepository.findOne({
            where: { id, isDeleted: false },
        });
        if (!section) {
            throw new common_1.NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
        }
        section.isDeleted = true;
        section.deletedAt = new Date();
        await this.sectionRepository.save(section);
    }
    async getSectionsByPeriod(year, quarter) {
        const sections = await this.sectionRepository.find({
            where: {
                year,
                quarter,
                isDeleted: false,
            },
            relations: ['indikators'],
            order: {
                no: 'ASC',
                id: 'ASC',
            },
        });
        return sections.map((section) => ({
            ...section,
            indikators: section.indikators.filter((ind) => !ind.isDeleted),
        }));
    }
    async createIndikator(createIndikatorDto) {
        const section = await this.sectionRepository.findOne({
            where: {
                id: createIndikatorDto.sectionId,
                isDeleted: false,
            },
        });
        if (!section) {
            throw new common_1.NotFoundException(`Section dengan ID ${createIndikatorDto.sectionId} tidak ditemukan`);
        }
        const hasil = createIndikatorDto.hasil !== undefined
            ? createIndikatorDto.hasil
            : await this.calculateHasil(createIndikatorDto);
        const weighted = createIndikatorDto.weighted !== undefined
            ? createIndikatorDto.weighted
            : await this.calculateWeighted(createIndikatorDto, section.bobotSection);
        let modeValue;
        switch (createIndikatorDto.mode) {
            case 'RASIO':
                modeValue = operasional_entity_1.CalculationMode.RASIO;
                break;
            case 'NILAI_TUNGGAL':
                modeValue = operasional_entity_1.CalculationMode.NILAI_TUNGGAL;
                break;
            default:
                modeValue = operasional_entity_1.CalculationMode.RASIO;
        }
        const indikatorData = {
            year: createIndikatorDto.year,
            quarter: createIndikatorDto.quarter,
            sectionId: createIndikatorDto.sectionId,
            subNo: createIndikatorDto.subNo,
            indikator: createIndikatorDto.indikator,
            bobotIndikator: createIndikatorDto.bobotIndikator,
            sumberRisiko: createIndikatorDto.sumberRisiko || null,
            dampak: createIndikatorDto.dampak || null,
            mode: modeValue,
            pembilangLabel: createIndikatorDto.pembilangLabel || null,
            pembilangValue: createIndikatorDto.pembilangValue || null,
            penyebutLabel: createIndikatorDto.penyebutLabel || null,
            penyebutValue: createIndikatorDto.penyebutValue || null,
            formula: createIndikatorDto.formula || null,
            isPercent: createIndikatorDto.isPercent || false,
            hasil: hasil,
            peringkat: createIndikatorDto.peringkat || 1,
            weighted: weighted,
            keterangan: createIndikatorDto.keterangan || null,
        };
        const indikator = this.operationalRepository.create(indikatorData);
        return await this.operationalRepository.save(indikator);
    }
    async updateIndikator(id, updateIndikatorDto) {
        const indikator = await this.operationalRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['section'],
        });
        if (!indikator) {
            throw new common_1.NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
        }
        const updateData = {};
        if (updateIndikatorDto.indikator !== undefined) {
            updateData.indikator = updateIndikatorDto.indikator;
        }
        if (updateIndikatorDto.subNo !== undefined) {
            updateData.subNo = updateIndikatorDto.subNo;
        }
        if (updateIndikatorDto.sumberRisiko !== undefined) {
            updateData.sumberRisiko = updateIndikatorDto.sumberRisiko;
        }
        if (updateIndikatorDto.dampak !== undefined) {
            updateData.dampak = updateIndikatorDto.dampak;
        }
        if (updateIndikatorDto.keterangan !== undefined) {
            updateData.keterangan = updateIndikatorDto.keterangan;
        }
        if (updateIndikatorDto.pembilangLabel !== undefined) {
            updateData.pembilangLabel = updateIndikatorDto.pembilangLabel;
        }
        if (updateIndikatorDto.penyebutLabel !== undefined) {
            updateData.penyebutLabel = updateIndikatorDto.penyebutLabel;
        }
        if (updateIndikatorDto.formula !== undefined) {
            updateData.formula = updateIndikatorDto.formula;
        }
        if (updateIndikatorDto.bobotIndikator !== undefined) {
            updateData.bobotIndikator = updateIndikatorDto.bobotIndikator;
        }
        if (updateIndikatorDto.pembilangValue !== undefined) {
            updateData.pembilangValue = updateIndikatorDto.pembilangValue;
        }
        if (updateIndikatorDto.penyebutValue !== undefined) {
            updateData.penyebutValue = updateIndikatorDto.penyebutValue;
        }
        if (updateIndikatorDto.peringkat !== undefined) {
            updateData.peringkat = updateIndikatorDto.peringkat;
        }
        if (updateIndikatorDto.isPercent !== undefined) {
            updateData.isPercent = updateIndikatorDto.isPercent;
        }
        if (updateIndikatorDto.mode !== undefined) {
            let modeValue;
            switch (updateIndikatorDto.mode) {
                case 'RASIO':
                    modeValue = operasional_entity_1.CalculationMode.RASIO;
                    break;
                case 'NILAI_TUNGGAL':
                    modeValue = operasional_entity_1.CalculationMode.NILAI_TUNGGAL;
                    break;
                default:
                    modeValue = operasional_entity_1.CalculationMode.RASIO;
            }
            updateData.mode = modeValue;
        }
        const shouldRecalculateHasil = (updateIndikatorDto.pembilangValue !== undefined ||
            updateIndikatorDto.penyebutValue !== undefined ||
            updateIndikatorDto.formula !== undefined ||
            updateIndikatorDto.mode !== undefined ||
            updateIndikatorDto.isPercent !== undefined) &&
            updateIndikatorDto.hasil === undefined;
        const shouldRecalculateWeighted = (updateIndikatorDto.bobotIndikator !== undefined ||
            updateIndikatorDto.peringkat !== undefined) &&
            updateIndikatorDto.weighted === undefined;
        if (shouldRecalculateHasil) {
            const dataForCalculation = {
                ...indikator,
                ...updateIndikatorDto,
                mode: updateIndikatorDto.mode || indikator.mode,
            };
            updateData.hasil = await this.calculateHasil(dataForCalculation);
        }
        else if (updateIndikatorDto.hasil !== undefined) {
            updateData.hasil = updateIndikatorDto.hasil;
        }
        if (shouldRecalculateWeighted) {
            const dataForWeighted = {
                ...indikator,
                ...updateIndikatorDto,
                bobotIndikator: updateIndikatorDto.bobotIndikator || indikator.bobotIndikator,
                peringkat: updateIndikatorDto.peringkat || indikator.peringkat,
            };
            updateData.weighted = await this.calculateWeighted(dataForWeighted, indikator.section.bobotSection);
        }
        else if (updateIndikatorDto.weighted !== undefined) {
            updateData.weighted = updateIndikatorDto.weighted;
        }
        Object.assign(indikator, updateData);
        indikator.updatedAt = new Date();
        return await this.operationalRepository.save(indikator);
    }
    async deleteIndikator(id) {
        const indikator = await this.operationalRepository.findOne({
            where: { id, isDeleted: false },
        });
        if (!indikator) {
            throw new common_1.NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
        }
        indikator.isDeleted = true;
        indikator.deletedAt = new Date();
        await this.operationalRepository.save(indikator);
    }
    async calculateHasil(data) {
        const mode = data.mode || 'RASIO';
        const formula = data.formula;
        const pembilangValue = data.pembilangValue;
        const penyebutValue = data.penyebutValue;
        const isPercent = data.isPercent || false;
        try {
            let result;
            if (formula && formula.trim() !== '') {
                const expr = formula
                    .replace(/\bpemb\b/g, 'pemb')
                    .replace(/\bpeny\b/g, 'peny');
                const fn = new Function('pemb', 'peny', `return (${expr});`);
                const pemb = Number(pembilangValue) || 0;
                const peny = Number(penyebutValue) || 0;
                result = fn(pemb, peny);
            }
            else if (mode === 'RASIO') {
                if (!penyebutValue || penyebutValue === 0)
                    return null;
                result = (Number(pembilangValue) || 0) / Number(penyebutValue);
            }
            else if (mode === 'NILAI_TUNGGAL') {
                if (!penyebutValue)
                    return null;
                result = Number(penyebutValue);
            }
            else {
                return null;
            }
            if (!isFinite(result) || isNaN(result))
                return null;
            if (isPercent) {
                result = result * 100;
            }
            return result;
        }
        catch (e) {
            console.warn('Error calculating hasil:', e);
            return null;
        }
    }
    async calculateWeighted(data, sectionBobot) {
        const bobotInd = Number(data.bobotIndikator) || 0;
        const peringkat = Number(data.peringkat) || 1;
        const res = (sectionBobot * bobotInd * peringkat) / 10000;
        if (!isFinite(res) || isNaN(res))
            return 0;
        return Number(res.toFixed(4));
    }
    async getSummaryByPeriod(year, quarter) {
        const sections = await this.getSectionsByPeriod(year, quarter);
        let totalWeighted = 0;
        const sectionDetails = [];
        for (const section of sections) {
            const sectionTotal = section.indikators.reduce((sum, ind) => {
                return sum + (Number(ind.weighted) || 0);
            }, 0);
            sectionDetails.push({
                sectionId: section.id,
                sectionNo: section.no,
                sectionName: section.parameter,
                bobotSection: section.bobotSection,
                totalWeighted: sectionTotal,
                indicatorCount: section.indikators.length,
            });
            totalWeighted += sectionTotal;
        }
        return {
            year,
            quarter,
            totalWeighted: Number(totalWeighted.toFixed(4)),
            sectionCount: sections.length,
            sections: sectionDetails,
        };
    }
    async getIndikatorById(id) {
        const indikator = await this.operationalRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['section'],
        });
        if (!indikator) {
            throw new common_1.NotFoundException(`Indikator dengan ID ${id} tidak ditemukan`);
        }
        return indikator;
    }
    async getSectionById(id) {
        const section = await this.sectionRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['indikators'],
        });
        if (!section) {
            throw new common_1.NotFoundException(`Section dengan ID ${id} tidak ditemukan`);
        }
        return {
            ...section,
            indikators: section.indikators.filter((ind) => !ind.isDeleted),
        };
    }
};
exports.OperationalService = OperationalService;
exports.OperationalService = OperationalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(operasional_entity_1.Operational)),
    __param(1, (0, typeorm_1.InjectRepository)(operasional_section_entity_1.SectionOperational)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OperationalService);
//# sourceMappingURL=operasional.service.js.map