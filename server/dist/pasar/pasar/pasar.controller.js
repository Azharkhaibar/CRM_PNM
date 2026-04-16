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
exports.PasarController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pasar_service_1 = require("./pasar.service");
const create_pasar_section_dto_1 = require("./dto/create-pasar-section.dto");
const update_pasar_section_dto_1 = require("./dto/update-pasar-section.dto");
const create_pasar_dto_1 = require("./dto/create-pasar.dto");
const update_pasar_dto_1 = require("./dto/update-pasar.dto");
const pasar_entity_1 = require("./entities/pasar.entity");
let PasarController = class PasarController {
    pasarService;
    constructor(pasarService) {
        this.pasarService = pasarService;
    }
    async createSection(createDto) {
        return await this.pasarService.createSection(createDto);
    }
    async getSections(isActive) {
        return await this.pasarService.findAllSections(isActive);
    }
    async getSection(id) {
        return await this.pasarService.findSectionById(id);
    }
    async getSectionsByPeriod(year, quarter) {
        return await this.pasarService.findSectionsByPeriod(year, quarter);
    }
    async updateSection(id, updateDto) {
        return await this.pasarService.updateSection(id, updateDto);
    }
    async deleteSection(id) {
        return await this.pasarService.deleteSection(id);
    }
    async createIndikator(createDto) {
        return await this.pasarService.createIndikator(createDto);
    }
    async getAllIndikators() {
        return await this.pasarService.findAllIndikators();
    }
    async getIndikatorsByPeriod(year, quarter) {
        return await this.pasarService.findIndikatorsByPeriod(year, quarter);
    }
    async searchIndikators(query, year, quarter) {
        return await this.pasarService.searchIndikators(query, year, quarter);
    }
    async getIndikator(id) {
        return await this.pasarService.findIndikatorById(id);
    }
    async updateIndikator(id, updateDto) {
        return await this.pasarService.updateIndikator(id, updateDto);
    }
    async deleteIndikator(id) {
        return await this.pasarService.deleteIndikator(id);
    }
    async getSectionsWithIndicatorsByPeriod(year, quarter) {
        return await this.pasarService.getSectionsWithIndicatorsByPeriod(year, quarter);
    }
    async getTotalWeighted(year, quarter) {
        const total = await this.pasarService.getTotalWeightedByPeriod(year, quarter);
        return {
            success: true,
            year,
            quarter,
            total,
        };
    }
    async getAvailablePeriods() {
        try {
            const periods = await this.pasarService.getPeriods();
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
            const periods = await this.pasarService.getPeriods();
            const periodsWithCounts = await Promise.all(periods.map(async (period) => {
                const count = await this.pasarService.getIndikatorCountByPeriod(period.year, period.quarter);
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
        const count = await this.pasarService.getIndikatorCountByPeriod(year, quarter);
        return {
            success: true,
            year,
            quarter,
            count,
        };
    }
    async duplicateIndikator(id, year, quarter) {
        return await this.pasarService.duplicateIndikatorToNewPeriod(id, year, quarter);
    }
};
exports.PasarController = PasarController;
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new pasar section' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Section created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Section already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pasar_section_dto_1.CreatePasarSectionDto]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pasar sections' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pasar section by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getSection", null);
__decorate([
    (0, common_1.Get)('sections/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pasar sections by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: pasar_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Put)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pasar section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_pasar_section_dto_1.UpdatePasarSectionDto]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete pasar section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Post)('indikators'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new pasar indikator' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Indikator created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Indikator already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pasar_dto_1.CreatePasarDto]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Get)('indikators'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pasar indikators' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getAllIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pasar indikators by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: pasar_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getIndikatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('indikators/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search pasar indikators' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: pasar_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "searchIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pasar indikator by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getIndikator", null);
__decorate([
    (0, common_1.Put)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pasar indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_pasar_dto_1.UpdatePasarDto]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indikators/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete pasar indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "deleteIndikator", null);
__decorate([
    (0, common_1.Get)('data/with-indicators'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get sections with their indicators for a period',
        description: 'Returns sections with nested indicators for a specific year and quarter',
    }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: pasar_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getSectionsWithIndicatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('total-weighted'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total weighted value by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: pasar_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getTotalWeighted", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available periods',
        description: 'Get list of distinct years and quarters that have data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getAvailablePeriods", null);
__decorate([
    (0, common_1.Get)('periods/with-counts'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all periods with indicator counts',
        description: 'Get periods with indicator counts for each period',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getAllPeriodsWithCounts", null);
__decorate([
    (0, common_1.Get)('indikators/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get indikator count by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: pasar_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getIndikatorCount", null);
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
], PasarController.prototype, "duplicateIndikator", null);
exports.PasarController = PasarController = __decorate([
    (0, swagger_1.ApiTags)('Pasar'),
    (0, common_1.Controller)('pasar'),
    __metadata("design:paramtypes", [pasar_service_1.PasarService])
], PasarController);
//# sourceMappingURL=pasar.controller.js.map