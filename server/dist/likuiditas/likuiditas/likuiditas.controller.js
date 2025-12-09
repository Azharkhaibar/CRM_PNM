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
exports.LikuiditasController = void 0;
const common_1 = require("@nestjs/common");
const likuiditas_service_1 = require("./likuiditas.service");
const create_likuiditas_dto_1 = require("./dto/create-likuiditas.dto");
const update_likuidita_dto_1 = require("./dto/update-likuidita.dto");
const likuiditas_entity_1 = require("./entities/likuiditas.entity");
const swagger_1 = require("@nestjs/swagger");
let LikuiditasController = class LikuiditasController {
    likuiditasService;
    constructor(likuiditasService) {
        this.likuiditasService = likuiditasService;
    }
    async createSection(createSectionDto) {
        return await this.likuiditasService.createSection(createSectionDto);
    }
    async updateSection(id, updateSectionDto) {
        return await this.likuiditasService.updateSection(id, updateSectionDto);
    }
    async deleteSection(id) {
        await this.likuiditasService.deleteSection(id);
        return { message: 'Section berhasil dihapus' };
    }
    async getSectionsByPeriod(year, quarter) {
        return await this.likuiditasService.getSectionsByPeriod(year, quarter);
    }
    async createIndikator(createIndikatorDto) {
        return await this.likuiditasService.createIndikator(createIndikatorDto);
    }
    async updateIndikator(id, updateIndikatorDto) {
        return await this.likuiditasService.updateIndikator(id, updateIndikatorDto);
    }
    async deleteIndikator(id) {
        await this.likuiditasService.deleteIndikator(id);
        return { message: 'Indikator berhasil dihapus' };
    }
    async getIndikatorById(id) {
        return await this.likuiditasService.getIndikatorById(id);
    }
    async getSummaryByPeriod(year, quarter) {
        return await this.likuiditasService.getSummaryByPeriod(year, quarter);
    }
};
exports.LikuiditasController = LikuiditasController;
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new section' }),
    (0, swagger_1.ApiBody)({ type: create_likuiditas_dto_1.CreateSectionLikuiditasDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Section created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_likuiditas_dto_1.CreateSectionLikuiditasDto]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "createSection", null);
__decorate([
    (0, common_1.Put)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update section by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Section ID' }),
    (0, swagger_1.ApiBody)({ type: update_likuidita_dto_1.UpdateSectionLikuiditasDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Section updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Section not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_likuidita_dto_1.UpdateSectionLikuiditasDto]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete section by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Section ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Section deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Section not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sections by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', type: Number, example: 2024 }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', enum: ['Q1', 'Q2', 'Q3', 'Q4'], example: 'Q1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of sections' }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Post)('indikators'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new indicator' }),
    (0, swagger_1.ApiBody)({ type: create_likuiditas_dto_1.CreateIndikatorLikuiditasDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Indicator created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Section not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_likuiditas_dto_1.CreateIndikatorLikuiditasDto]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Put)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update indicator by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Indicator ID' }),
    (0, swagger_1.ApiBody)({ type: update_likuidita_dto_1.UpdateIndikatorLikuiditasDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Indicator updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Indicator not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_likuidita_dto_1.UpdateIndikatorLikuiditasDto]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indikators/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete indicator by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Indicator ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Indicator deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Indicator not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "deleteIndikator", null);
__decorate([
    (0, common_1.Get)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get indicator by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Indicator ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Indicator details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Indicator not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getIndikatorById", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', type: Number, example: 2024 }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', enum: ['Q1', 'Q2', 'Q3', 'Q4'], example: 'Q1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Summary data' }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getSummaryByPeriod", null);
exports.LikuiditasController = LikuiditasController = __decorate([
    (0, swagger_1.ApiTags)('Likuiditas'),
    (0, common_1.Controller)('likuiditas'),
    __metadata("design:paramtypes", [likuiditas_service_1.LikuiditasService])
], LikuiditasController);
//# sourceMappingURL=likuiditas.controller.js.map