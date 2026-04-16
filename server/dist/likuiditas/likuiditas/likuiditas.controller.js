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
const swagger_1 = require("@nestjs/swagger");
const likuiditas_service_1 = require("./likuiditas.service");
const create_likuiditas_section_dto_1 = require("./dto/create-likuiditas-section.dto");
const update_likuiditas_section_dto_1 = require("./dto/update-likuiditas-section.dto");
const create_likuiditas_dto_1 = require("./dto/create-likuiditas.dto");
const update_likuiditas_dto_1 = require("./dto/update-likuiditas.dto");
const likuiditas_entity_1 = require("./entities/likuiditas.entity");
let LikuiditasController = class LikuiditasController {
    likuiditasService;
    constructor(likuiditasService) {
        this.likuiditasService = likuiditasService;
    }
    async createSection(createDto) {
        return await this.likuiditasService.createSection(createDto);
    }
    async getSections(isActive) {
        return await this.likuiditasService.findAllSections(isActive);
    }
    async getSection(id) {
        return await this.likuiditasService.findSectionById(id);
    }
    async getSectionsByPeriod(year, quarter) {
        return await this.likuiditasService.findSectionsByPeriod(year, quarter);
    }
    async updateSection(id, updateDto) {
        return await this.likuiditasService.updateSection(id, updateDto);
    }
    async deleteSection(id) {
        return await this.likuiditasService.deleteSection(id);
    }
    async createIndikator(createDto) {
        return await this.likuiditasService.createIndikator(createDto);
    }
    async getAllIndikators() {
        return await this.likuiditasService.findAllIndikators();
    }
    async getIndikatorsByPeriod(year, quarter) {
        return await this.likuiditasService.findIndikatorsByPeriod(year, quarter);
    }
    async searchIndikators(query, year, quarter) {
        return await this.likuiditasService.searchIndikators(query, year, quarter);
    }
    async getIndikator(id) {
        return await this.likuiditasService.findIndikatorById(id);
    }
    async updateIndikator(id, updateDto) {
        return await this.likuiditasService.updateIndikator(id, updateDto);
    }
    async deleteIndikator(id) {
        return await this.likuiditasService.deleteIndikator(id);
    }
    async getSectionsWithIndicatorsByPeriod(year, quarter) {
        return await this.likuiditasService.getSectionsWithIndicatorsByPeriod(year, quarter);
    }
    async getTotalWeighted(year, quarter) {
        const total = await this.likuiditasService.getTotalWeightedByPeriod(year, quarter);
        return {
            success: true,
            year,
            quarter,
            total,
        };
    }
    async getAvailablePeriods() {
        try {
            const periods = await this.likuiditasService.getPeriods();
            return {
                success: true,
                data: periods,
                count: periods.length,
            };
        }
        catch (error) {
            console.error('Error in getAvailablePeriods:', error);
            throw error;
        }
    }
    async getAllPeriodsWithCounts() {
        try {
            const periods = await this.likuiditasService.getPeriods();
            const periodsWithCounts = await Promise.all(periods.map(async (period) => {
                const count = await this.likuiditasService.getIndikatorCountByPeriod(period.year, period.quarter);
                return {
                    ...period,
                    indicatorCount: count,
                };
            }));
            return {
                success: true,
                data: periodsWithCounts,
                count: periodsWithCounts.length,
            };
        }
        catch (error) {
            console.error('Error in getAllPeriodsWithCounts:', error);
            throw error;
        }
    }
    async getIndikatorCount(year, quarter) {
        const count = await this.likuiditasService.getIndikatorCountByPeriod(year, quarter);
        return {
            success: true,
            year,
            quarter,
            count,
        };
    }
    async duplicateIndikator(id, year, quarter) {
        return await this.likuiditasService.duplicateIndikatorToNewPeriod(id, year, quarter);
    }
};
exports.LikuiditasController = LikuiditasController;
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new likuiditas section' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Section created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Section already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_likuiditas_section_dto_1.CreateLikuiditasSectionDto]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all likuiditas sections' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likuiditas section by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getSection", null);
__decorate([
    (0, common_1.Get)('sections/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likuiditas sections by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: likuiditas_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Put)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update likuiditas section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_likuiditas_section_dto_1.UpdateLikuiditasSectionDto]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete likuiditas section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Post)('indikators'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new likuiditas indikator' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Indikator created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Indikator already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_likuiditas_dto_1.CreateLikuiditasDto]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Get)('indikators'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all likuiditas indikators' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getAllIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likuiditas indikators by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: likuiditas_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getIndikatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('indikators/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search likuiditas indikators' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: likuiditas_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "searchIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likuiditas indikator by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getIndikator", null);
__decorate([
    (0, common_1.Put)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update likuiditas indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_likuiditas_dto_1.UpdateLikuiditasDto]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indikators/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete likuiditas indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "deleteIndikator", null);
__decorate([
    (0, common_1.Get)('data/with-indicators'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get sections with their indicators for a period',
        description: 'Returns sections with nested indicators for a specific year and quarter',
    }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: likuiditas_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getSectionsWithIndicatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('total-weighted'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total weighted value by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: likuiditas_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getTotalWeighted", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available periods',
        description: 'Get list of distinct years and quarters that have data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getAvailablePeriods", null);
__decorate([
    (0, common_1.Get)('periods/with-counts'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all periods with indicator counts',
        description: 'Get periods with indicator counts for each period',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getAllPeriodsWithCounts", null);
__decorate([
    (0, common_1.Get)('indikators/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get indikator count by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: likuiditas_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "getIndikatorCount", null);
__decorate([
    (0, common_1.Post)('indikators/:id/duplicate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Duplicate indikator to new period',
        description: 'Copy an existing indikator to a different period',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], LikuiditasController.prototype, "duplicateIndikator", null);
exports.LikuiditasController = LikuiditasController = __decorate([
    (0, swagger_1.ApiTags)('Likuiditas'),
    (0, common_1.Controller)('likuiditas'),
    __metadata("design:paramtypes", [likuiditas_service_1.LikuiditasService])
], LikuiditasController);
//# sourceMappingURL=likuiditas.controller.js.map