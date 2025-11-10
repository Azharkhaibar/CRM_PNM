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
exports.DivisiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const divisi_entity_1 = require("./entities/divisi.entity");
let DivisiService = class DivisiService {
    divisiRepository;
    constructor(divisiRepository) {
        this.divisiRepository = divisiRepository;
    }
    async findAll() {
        try {
            return await this.divisiRepository.find({
                relations: ['users'],
                order: { name: 'ASC' },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to fetch divisions');
        }
    }
    async findOne(divisi_id) {
        try {
            const divisi = await this.divisiRepository.findOne({
                where: { divisi_id },
                relations: ['users'],
            });
            if (!divisi) {
                throw new common_1.NotFoundException(`Division with ID ${divisi_id} not found`);
            }
            return divisi;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to fetch division');
        }
    }
    async create(createDivisiDto) {
        try {
            const divisi = this.divisiRepository.create(createDivisiDto);
            return await this.divisiRepository.save(divisi);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create division');
        }
    }
    async update(divisi_id, updateDivisiDto) {
        try {
            const divisi = await this.findOne(divisi_id);
            Object.assign(divisi, updateDivisiDto);
            return await this.divisiRepository.save(divisi);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to update division');
        }
    }
    async remove(divisi_id) {
        try {
            const divisi = await this.findOne(divisi_id);
            await this.divisiRepository.manager
                .getRepository('users')
                .update({ divisi: { divisi_id } }, { divisi: null });
            await this.divisiRepository.remove(divisi);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to delete division');
        }
    }
};
exports.DivisiService = DivisiService;
exports.DivisiService = DivisiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(divisi_entity_1.Divisi)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DivisiService);
//# sourceMappingURL=divisi.service.js.map