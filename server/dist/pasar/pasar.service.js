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
exports.PasarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pasar_entity_1 = require("./entities/pasar.entity");
let PasarService = class PasarService {
    pasarRepository;
    constructor(pasarRepository) {
        this.pasarRepository = pasarRepository;
    }
    async create(dto) {
        const entity = this.pasarRepository.create(dto);
        return this.pasarRepository.save(entity);
    }
    async findAll() {
        return this.pasarRepository.find({
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        const data = await this.pasarRepository.findOne({ where: { id } });
        if (!data) {
            throw new common_1.NotFoundException(`Pasar ID ${id} tidak ditemukan`);
        }
        return data;
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        Object.assign(existing, dto);
        return this.pasarRepository.save(existing);
    }
    async remove(id) {
        const existing = await this.findOne(id);
        await this.pasarRepository.remove(existing);
        return { message: `Pasar ID ${id} berhasil dihapus` };
    }
    async getPasarSummary() {
        return this.pasarRepository
            .createQueryBuilder('p')
            .select([
            'p.id',
            'p.parameter',
            'p.indikator',
            'p.hasil',
            'p.peringkat',
            'p.weighted',
            'p.keterangan',
        ])
            .orderBy('p.id', 'ASC')
            .getMany();
    }
};
exports.PasarService = PasarService;
exports.PasarService = PasarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pasar_entity_1.Pasar)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PasarService);
//# sourceMappingURL=pasar.service.js.map