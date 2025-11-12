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
var KpmrInvestasiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmrInvestasiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const kpmr_investasi_entity_1 = require("./entities/kpmr-investasi.entity");
const typeorm_2 = require("@nestjs/typeorm");
let KpmrInvestasiService = KpmrInvestasiService_1 = class KpmrInvestasiService {
    kpmrInvestRepository;
    logger = new common_1.Logger(KpmrInvestasiService_1.name);
    constructor(kpmrInvestRepository) {
        this.kpmrInvestRepository = kpmrInvestRepository;
    }
    async create(createKpmrInvestasiDto) {
        this.logger.log(`CREATE request received: ${JSON.stringify(createKpmrInvestasiDto)}`);
        try {
            const kpmrInvest = this.kpmrInvestRepository.create(createKpmrInvestasiDto);
            const saved = await this.kpmrInvestRepository.save(kpmrInvest);
            this.logger.log(`CREATE success: ${JSON.stringify(saved)}`);
            return saved;
        }
        catch (error) {
            this.logger.error('CREATE failed', error);
            throw error;
        }
    }
    async findAll() {
        this.logger.log('Fetching all KPMR Investasi');
        return this.kpmrInvestRepository.find();
    }
    async findOne(id) {
        const entity = await this.kpmrInvestRepository.findOne({
            where: { id_kpmr_investasi: id },
        });
        if (!entity)
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
        return entity;
    }
    async update(id, dto) {
        await this.kpmrInvestRepository.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.kpmrInvestRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }
    async findByPeriod(year, quarter) {
        return await this.kpmrInvestRepository.find({ where: { year, quarter } });
    }
    async findByFilters(filters) {
        const qb = this.kpmrInvestRepository.createQueryBuilder('kpmr');
        if (filters.year !== undefined)
            qb.andWhere('kpmr.year = :year', { year: filters.year });
        if (filters.quarter)
            qb.andWhere('kpmr.quarter = :quarter', { quarter: filters.quarter });
        if (filters.aspekNo)
            qb.andWhere('kpmr.aspek_no = :aspekNo', { aspekNo: filters.aspekNo });
        if (filters.query) {
            qb.andWhere('(kpmr.indikator LIKE :q OR kpmr.aspek_title LIKE :q OR kpmr.section_title LIKE :q OR kpmr.evidence LIKE :q)', { q: `%${filters.query}%` });
        }
        return await qb.getMany();
    }
};
exports.KpmrInvestasiService = KpmrInvestasiService;
exports.KpmrInvestasiService = KpmrInvestasiService = KpmrInvestasiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(kpmr_investasi_entity_1.KpmrInvestasi)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], KpmrInvestasiService);
//# sourceMappingURL=kpmr-investasi.service.js.map