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
exports.KpmrInvestasiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const kpmr_investasi_entity_1 = require("./entities/kpmr-investasi.entity");
const typeorm_2 = require("@nestjs/typeorm");
let KpmrInvestasiService = class KpmrInvestasiService {
    kpmrInvestRepository;
    constructor(kpmrInvestRepository) {
        this.kpmrInvestRepository = kpmrInvestRepository;
    }
    async create(createKpmrInvestasiDto) {
        try {
            const kpmrInvest = this.kpmrInvestRepository.create(createKpmrInvestasiDto);
            return await this.kpmrInvestRepository.save(kpmrInvest);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create KPMR Investasi: ${error.message}`);
            }
            throw new Error('Failed to create KPMR Investasi');
        }
    }
    async findAll() {
        return await this.kpmrInvestRepository.find();
    }
    async findOne(id) {
        const findKpmrInvestasi = await this.kpmrInvestRepository.findOne({
            where: { id_kpmr_investasi: id },
        });
        if (!findKpmrInvestasi) {
            throw new common_1.NotFoundException(`KPMR Investasi with ID ${id} not found`);
        }
        return findKpmrInvestasi;
    }
    async findByPeriod(year, quarter) {
        const qb = this.kpmrInvestRepository.createQueryBuilder('kpmr');
        if (year !== undefined && year !== null) {
            qb.andWhere('kpmr.year = :year', { year });
        }
        if (quarter) {
            qb.andWhere('kpmr.quarter = :quarter', { quarter });
        }
        return await qb.getMany();
    }
    async update(id, updateKpmrInvestasiDto) {
        const existingData = await this.findOne(id);
        await this.kpmrInvestRepository.update({ id_kpmr_investasi: id }, updateKpmrInvestasiDto);
        return await this.findOne(id);
    }
    async remove(id) {
        const result = await this.kpmrInvestRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`KPMR Investasi with ID ${id} not found`);
        }
    }
    async findByFilters(filters) {
        const queryBuilder = this.kpmrInvestRepository.createQueryBuilder('kpmr');
        if (filters.year) {
            queryBuilder.andWhere('kpmr.year = :year', { year: filters.year });
        }
        if (filters.quarter) {
            queryBuilder.andWhere('kpmr.quarter = :quarter', {
                quarter: filters.quarter,
            });
        }
        if (filters.aspek_no) {
            queryBuilder.andWhere('kpmr.aspek_no = :aspek_no', {
                aspek_no: filters.aspek_no,
            });
        }
        if (filters.query) {
            queryBuilder.andWhere('(kpmr.tata_kelola_resiko LIKE :query OR kpmr.aspek_title LIKE :query OR kpmr.section_title LIKE :query OR kpmr.evidence LIKE :query)', { query: `%${filters.query}%` });
        }
        return await queryBuilder.getMany();
    }
};
exports.KpmrInvestasiService = KpmrInvestasiService;
exports.KpmrInvestasiService = KpmrInvestasiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(kpmr_investasi_entity_1.KpmrInvestasi)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], KpmrInvestasiService);
//# sourceMappingURL=kpmr-investasi.service.js.map