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
exports.KpmrLikuiditasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const kpmr_likuidita_entity_1 = require("./entities/kpmr-likuidita.entity");
let KpmrLikuiditasService = class KpmrLikuiditasService {
    kpmrLikuiditasRepo;
    constructor(kpmrLikuiditasRepo) {
        this.kpmrLikuiditasRepo = kpmrLikuiditasRepo;
    }
    async create(createDto) {
        const existing = await this.kpmrLikuiditasRepo.findOne({
            where: {
                year: createDto.year,
                quarter: createDto.quarter,
                aspekNo: createDto.aspekNo,
                sectionNo: createDto.sectionNo,
            },
        });
        if (existing) {
            throw new Error('Data dengan tahun, quarter, aspekNo, dan sectionNo yang sama sudah ada');
        }
        const kpmr = this.kpmrLikuiditasRepo.create(createDto);
        return await this.kpmrLikuiditasRepo.save(kpmr);
    }
    async findAll(query) {
        const { year, quarter, search, aspekNo, page = 1, limit = 50 } = query;
        const where = {};
        if (year)
            where.year = year;
        if (quarter)
            where.quarter = quarter;
        if (aspekNo)
            where.aspekNo = aspekNo;
        if (search) {
            where.indikator = (0, typeorm_2.Like)(`%${search}%`);
        }
        const options = {
            where,
            order: {
                aspekNo: 'ASC',
                sectionNo: 'ASC',
            },
            skip: (page - 1) * limit,
            take: limit,
        };
        const [data, total] = await this.kpmrLikuiditasRepo.findAndCount(options);
        return { data, total };
    }
    async findOne(id_kpmr_likuiditas) {
        const kpmr = await this.kpmrLikuiditasRepo.findOne({
            where: { id_kpmr_likuiditas },
        });
        if (!kpmr) {
            throw new common_1.NotFoundException(`KPMR Likuiditas dengan ID ${id_kpmr_likuiditas} tidak ditemukan`);
        }
        return kpmr;
    }
    async update(id_kpmr_likuiditas, updateDto) {
        const kpmr = await this.findOne(id_kpmr_likuiditas);
        Object.assign(kpmr, updateDto);
        return await this.kpmrLikuiditasRepo.save(kpmr);
    }
    async remove(id_kpmr_likuiditas) {
        const kpmr = await this.findOne(id_kpmr_likuiditas);
        await this.kpmrLikuiditasRepo.remove(kpmr);
    }
    async findByPeriod(year, quarter) {
        return await this.kpmrLikuiditasRepo.find({
            where: { year, quarter },
            order: {
                aspekNo: 'ASC',
                sectionNo: 'ASC',
            },
        });
    }
    async getGroupedData(year, quarter) {
        const data = await this.findByPeriod(year, quarter);
        const groups = new Map();
        data.forEach((item) => {
            const key = `${item.aspekNo}|${item.aspekTitle}|${item.aspekBobot}`;
            if (!groups.has(key)) {
                groups.set(key, {
                    aspekNo: item.aspekNo || '',
                    aspekTitle: item.aspekTitle || '',
                    aspekBobot: item.aspekBobot || 0,
                    items: [],
                    skorAverage: 0,
                });
            }
            const group = groups.get(key);
            if (group) {
                group.items.push(item);
            }
        });
        const groupedArray = Array.from(groups.values()).map((group) => {
            const validScores = group.items
                .map((item) => item.sectionSkor || 0)
                .filter((score) => score !== null && !isNaN(score) && score > 0);
            group.skorAverage =
                validScores.length > 0
                    ? Number((validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(2))
                    : 0;
            return group;
        });
        const validAverages = groupedArray
            .map((group) => group.skorAverage)
            .filter((avg) => avg > 0);
        const overallAverage = validAverages.length > 0
            ? Number((validAverages.reduce((sum, avg) => sum + avg, 0) /
                validAverages.length).toFixed(2))
            : 0;
        return {
            data,
            groups: groupedArray,
            overallAverage,
        };
    }
    async getExportData(year, quarter) {
        const data = await this.findByPeriod(year, quarter);
        const groupedData = await this.getGroupedData(year, quarter);
        return {
            year,
            quarter,
            rows: data,
            groups: groupedData.groups,
            overallAverage: groupedData.overallAverage,
            exportDate: new Date().toISOString(),
        };
    }
};
exports.KpmrLikuiditasService = KpmrLikuiditasService;
exports.KpmrLikuiditasService = KpmrLikuiditasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kpmr_likuidita_entity_1.KpmrLikuiditas)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KpmrLikuiditasService);
//# sourceMappingURL=kpmr-likuiditas.service.js.map