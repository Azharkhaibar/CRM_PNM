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
exports.KpmrPasarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const kpmr_pasar_entity_1 = require("./entities/kpmr-pasar.entity");
let KpmrPasarService = class KpmrPasarService {
    kpmrPasarRepo;
    constructor(kpmrPasarRepo) {
        this.kpmrPasarRepo = kpmrPasarRepo;
    }
    async create(createDto) {
        if (!createDto.year || !createDto.quarter) {
            throw new common_1.BadRequestException('Year dan Quarter harus diisi');
        }
        const isDuplicate = await this.checkDuplicate(createDto.year, createDto.quarter, createDto.aspekNo, createDto.sectionNo);
        if (isDuplicate) {
            throw new common_1.ConflictException(`Data dengan year ${createDto.year}, quarter ${createDto.quarter}, aspek ${createDto.aspekNo}, section ${createDto.sectionNo} sudah ada`);
        }
        const kpmr = this.kpmrPasarRepo.create(createDto);
        return await this.kpmrPasarRepo.save(kpmr);
    }
    async findAllByPeriod(year, quarter) {
        return await this.kpmrPasarRepo.find({
            where: { year, quarter },
            order: {
                aspekNo: 'ASC',
                sectionNo: 'ASC',
            },
        });
    }
    async findGroupedByAspek(year, quarter) {
        const data = await this.findAllByPeriod(year, quarter);
        const grouped = data.reduce((acc, item) => {
            const key = `${item.aspekNo ?? ''}|${item.aspekTitle ?? ''}|${item.aspekBobot ?? ''}`;
            if (!acc[key]) {
                acc[key] = {
                    aspekNo: item.aspekNo ?? undefined,
                    aspekTitle: item.aspekTitle ?? undefined,
                    aspekBobot: item.aspekBobot ?? undefined,
                    items: [],
                };
            }
            acc[key].items.push(item);
            return acc;
        }, {});
        return Object.values(grouped).map((group) => {
            const skorValues = group.items
                .map((item) => item.sectionSkor)
                .filter((skor) => skor !== null && skor !== undefined && !isNaN(skor));
            const averageSkor = skorValues.length > 0
                ? (skorValues.reduce((a, b) => a + b, 0) /
                    skorValues.length).toFixed(2)
                : '0.00';
            return {
                aspekNo: group.aspekNo,
                aspekTitle: group.aspekTitle,
                aspekBobot: group.aspekBobot,
                items: group.items,
                average_skor: averageSkor,
                total_items: group.items.length,
            };
        });
    }
    async findOne(id) {
        const kpmr = await this.kpmrPasarRepo.findOne({
            where: { id_kpmr_pasar: id },
        });
        if (!kpmr) {
            throw new common_1.NotFoundException(`KPMR Pasar with ID ${id} not found`);
        }
        return kpmr;
    }
    async update(id, updateDto) {
        const kpmr = await this.kpmrPasarRepo.findOne({
            where: { id_kpmr_pasar: id },
        });
        if (!kpmr) {
            throw new common_1.NotFoundException(`KPMR Pasar with ID ${id} not found`);
        }
        const checkYear = updateDto.year ?? kpmr.year;
        const checkQuarter = updateDto.quarter ?? kpmr.quarter;
        const checkAspekNo = updateDto.aspekNo ?? kpmr.aspekNo;
        const checkSectionNo = updateDto.sectionNo ?? kpmr.sectionNo;
        if (updateDto.year !== undefined ||
            updateDto.quarter !== undefined ||
            updateDto.aspekNo !== undefined ||
            updateDto.sectionNo !== undefined) {
            const existing = await this.kpmrPasarRepo.findOne({
                where: {
                    year: checkYear,
                    quarter: checkQuarter,
                    aspekNo: checkAspekNo,
                    sectionNo: checkSectionNo,
                },
            });
            if (existing && existing.id_kpmr_pasar !== id) {
                throw new common_1.ConflictException('Data dengan kombinasi periode, aspek, dan section yang sama sudah ada');
            }
        }
        const updateData = {};
        if (updateDto.year !== undefined)
            updateData.year = updateDto.year;
        if (updateDto.quarter !== undefined)
            updateData.quarter = updateDto.quarter;
        if (updateDto.aspekNo !== undefined)
            updateData.aspekNo = updateDto.aspekNo;
        if (updateDto.aspekBobot !== undefined)
            updateData.aspekBobot = updateDto.aspekBobot;
        if (updateDto.aspekTitle !== undefined)
            updateData.aspekTitle = updateDto.aspekTitle;
        if (updateDto.sectionNo !== undefined)
            updateData.sectionNo = updateDto.sectionNo;
        if (updateDto.indikator !== undefined)
            updateData.indikator = updateDto.indikator;
        if (updateDto.sectionSkor !== undefined)
            updateData.sectionSkor = updateDto.sectionSkor;
        if (updateDto.strong !== undefined)
            updateData.strong = updateDto.strong;
        if (updateDto.satisfactory !== undefined)
            updateData.satisfactory = updateDto.satisfactory;
        if (updateDto.fair !== undefined)
            updateData.fair = updateDto.fair;
        if (updateDto.marginal !== undefined)
            updateData.marginal = updateDto.marginal;
        if (updateDto.unsatisfactory !== undefined)
            updateData.unsatisfactory = updateDto.unsatisfactory;
        if (updateDto.evidence !== undefined)
            updateData.evidence = updateDto.evidence;
        const updatedKpmr = this.kpmrPasarRepo.merge(kpmr, updateData);
        return await this.kpmrPasarRepo.save(updatedKpmr);
    }
    async remove(id) {
        const result = await this.kpmrPasarRepo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`KPMR Pasar with ID ${id} not found`);
        }
    }
    async getTotalAverage(year, quarter) {
        const grouped = await this.findGroupedByAspek(year, quarter);
        const averages = grouped
            .map((group) => {
            const avg = parseFloat(group.average_skor);
            return isNaN(avg) ? null : avg;
        })
            .filter((avg) => avg !== null);
        if (averages.length === 0)
            return 0;
        const totalAverage = averages.reduce((a, b) => a + b, 0) / averages.length;
        return Number(totalAverage.toFixed(2));
    }
    async checkDuplicate(year, quarter, aspekNo, sectionNo) {
        const whereClause = {
            year,
            quarter,
        };
        if (aspekNo !== undefined)
            whereClause.aspekNo = aspekNo;
        if (sectionNo !== undefined)
            whereClause.sectionNo = sectionNo;
        const existing = await this.kpmrPasarRepo.findOne({
            where: whereClause,
        });
        return !!existing;
    }
    async getPeriods() {
        const results = await this.kpmrPasarRepo
            .createQueryBuilder('kpmr')
            .select(['kpmr.year', 'kpmr.quarter'])
            .distinct(true)
            .orderBy('kpmr.year', 'DESC')
            .addOrderBy('kpmr.quarter', 'DESC')
            .getRawMany();
        return results
            .map((result) => ({
            year: parseInt(result.kpmr_year, 10),
            quarter: result.kpmr_quarter,
        }))
            .filter((period) => !isNaN(period.year) &&
            ['Q1', 'Q2', 'Q3', 'Q4'].includes(period.quarter));
    }
    async findByCriteria(criteria) {
        const whereClause = {};
        if (criteria.year !== undefined)
            whereClause.year = criteria.year;
        if (criteria.quarter !== undefined)
            whereClause.quarter = criteria.quarter;
        if (criteria.aspekNo !== undefined)
            whereClause.aspekNo = criteria.aspekNo;
        if (criteria.sectionNo !== undefined)
            whereClause.sectionNo = criteria.sectionNo;
        return await this.kpmrPasarRepo.find({
            where: whereClause,
            order: { aspekNo: 'ASC', sectionNo: 'ASC' },
        });
    }
};
exports.KpmrPasarService = KpmrPasarService;
exports.KpmrPasarService = KpmrPasarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kpmr_pasar_entity_1.KpmrPasar)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KpmrPasarService);
//# sourceMappingURL=kpmr-pasar.service.js.map