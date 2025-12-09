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
exports.KpmrLikuiditasController = void 0;
const common_1 = require("@nestjs/common");
const kpmr_likuiditas_service_1 = require("./kpmr-likuiditas.service");
const create_kpmr_likuidita_dto_1 = require("./dto/create-kpmr-likuidita.dto");
const update_kpmr_likuiditas_dto_1 = require("./dto/update-kpmr-likuiditas.dto");
const kpmr_likuiditas_query_dto_1 = require("./dto/kpmr-likuiditas-query.dto");
let KpmrLikuiditasController = class KpmrLikuiditasController {
    kpmrLikuiditasService;
    constructor(kpmrLikuiditasService) {
        this.kpmrLikuiditasService = kpmrLikuiditasService;
    }
    async create(createDto) {
        return await this.kpmrLikuiditasService.create(createDto);
    }
    async findAll(query) {
        return await this.kpmrLikuiditasService.findAll(query);
    }
    async getGroupedData(year, quarter) {
        if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
            throw new common_1.BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
        }
        return await this.kpmrLikuiditasService.getGroupedData(year, quarter);
    }
    async findOne(id) {
        return await this.kpmrLikuiditasService.findOne(id);
    }
    async update(id, updateDto) {
        return await this.kpmrLikuiditasService.update(id, updateDto);
    }
    async remove(id) {
        return await this.kpmrLikuiditasService.remove(id);
    }
    async findByPeriod(year, quarter) {
        if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
            throw new common_1.BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
        }
        return await this.kpmrLikuiditasService.findByPeriod(year, quarter);
    }
    async exportData(year, quarter) {
        if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
            throw new common_1.BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
        }
        return await this.kpmrLikuiditasService.getExportData(year, quarter);
    }
};
exports.KpmrLikuiditasController = KpmrLikuiditasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kpmr_likuidita_dto_1.CreateKpmrLikuiditasDto]),
    __metadata("design:returntype", Promise)
], KpmrLikuiditasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_likuiditas_query_dto_1.KpmrLikuiditasQueryDto]),
    __metadata("design:returntype", Promise)
], KpmrLikuiditasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('grouped'),
    __param(0, (0, common_1.Query)('year', new common_1.DefaultValuePipe(new Date().getFullYear()), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter', new common_1.DefaultValuePipe('Q1'))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KpmrLikuiditasController.prototype, "getGroupedData", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KpmrLikuiditasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_kpmr_likuiditas_dto_1.UpdateKpmrLikuiditasDto]),
    __metadata("design:returntype", Promise)
], KpmrLikuiditasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KpmrLikuiditasController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('period/:year/:quarter'),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KpmrLikuiditasController.prototype, "findByPeriod", null);
__decorate([
    (0, common_1.Get)('export/:year/:quarter'),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KpmrLikuiditasController.prototype, "exportData", null);
exports.KpmrLikuiditasController = KpmrLikuiditasController = __decorate([
    (0, common_1.Controller)('kpmr-likuiditas'),
    __metadata("design:paramtypes", [kpmr_likuiditas_service_1.KpmrLikuiditasService])
], KpmrLikuiditasController);
//# sourceMappingURL=kpmr-likuiditas.controller.js.map