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
exports.LikuiditasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const likuidita_entity_1 = require("./entities/likuidita.entity");
let LikuiditasService = class LikuiditasService {
    likuiditasRepo;
    constructor(likuiditasRepo) {
        this.likuiditasRepo = likuiditasRepo;
    }
    calculateWeighted(hasil, bobotIndikator, bobotParameter) {
        return hasil * bobotIndikator * bobotParameter;
    }
    async create(dto) {
        const weighted = this.calculateWeighted(dto.hasil, dto.bobot_indikator, dto.bobot);
        const entity = this.likuiditasRepo.create({
            ...dto,
            weighted,
        });
        return this.likuiditasRepo.save(entity);
    }
    async findAll() {
        return this.likuiditasRepo.find({
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        const row = await this.likuiditasRepo.findOne({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException(`Likuiditas ID ${id} tidak ditemukan`);
        return row;
    }
    async update(id, dto) {
        const row = await this.findOne(id);
        const merged = Object.assign(row, dto);
        merged.weighted = this.calculateWeighted(merged.hasil, merged.bobot_indikator, merged.bobot);
        return this.likuiditasRepo.save(merged);
    }
    async remove(id) {
        const row = await this.findOne(id);
        await this.likuiditasRepo.remove(row);
        return { message: `Likuiditas ID ${id} berhasil dihapus` };
    }
    async summary() {
        return this.likuiditasRepo
            .createQueryBuilder('l')
            .select([
            'l.id',
            'l.parameter',
            'l.indikator',
            'l.hasil',
            'l.peringkat',
            'l.weighted',
        ])
            .orderBy('l.id', 'ASC')
            .getMany();
    }
};
exports.LikuiditasService = LikuiditasService;
exports.LikuiditasService = LikuiditasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(likuidita_entity_1.Likuiditas)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LikuiditasService);
//# sourceMappingURL=likuiditas.service.js.map