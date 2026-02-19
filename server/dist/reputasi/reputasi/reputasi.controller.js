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
exports.ReputasiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reputasi_service_1 = require("./reputasi.service");
const create_reputasi_section_dto_1 = require("./dto/create-reputasi-section.dto");
const update_reputasi_section_dto_1 = require("./dto/update-reputasi-section.dto");
const reputasi_entity_1 = require("./entities/reputasi.entity");
const create_reputasi_dto_1 = require("./dto/create-reputasi.dto");
const update_reputasi_dto_1 = require("./dto/update-reputasi.dto");
let ReputasiController = class ReputasiController {
    reputasiService;
    constructor(reputasiService) {
        this.reputasiService = reputasiService;
    }
    async createSection(createDto) {
        return await this.reputasiService.createSection(createDto);
    }
    async getSections(isActive) {
        return await this.reputasiService.findAllSections(isActive);
    }
    async getSection(id) {
        return await this.reputasiService.findSectionById(id);
    }
    async updateSection(id, updateDto) {
        return await this.reputasiService.updateSection(id, updateDto);
    }
    async deleteSection(id) {
        await this.reputasiService.deleteSection(id);
    }
    async getSectionsWithIndicatorsByPeriod(year, quarter) {
        return await this.reputasiService.getSectionsWithIndicatorsByPeriod(year, quarter);
    }
    async createIndikator(createDto) {
        return await this.reputasiService.createIndikator(createDto);
    }
    async getAllIndikators() {
        return await this.reputasiService.findAllIndikators();
    }
    async getIndikatorsByPeriod(year, quarter) {
        return await this.reputasiService.findIndikatorsByPeriod(year, quarter);
    }
    async searchIndikators(query, year, quarter) {
        return await this.reputasiService.searchIndikators(query, year, quarter);
    }
    async getIndikator(id) {
        return await this.reputasiService.findIndikatorById(id);
    }
    async updateIndikator(id, updateDto) {
        return await this.reputasiService.updateIndikator(id, updateDto);
    }
    async deleteIndikator(id) {
        await this.reputasiService.deleteIndikator(id);
    }
    async getTotalWeighted(year, quarter) {
        const total = await this.reputasiService.getTotalWeightedByPeriod(year, quarter);
        return { total };
    }
    async getSectionsByPeriod(year, quarter) {
        return await this.reputasiService.findSectionsByPeriod(year, quarter);
    }
    async getAvailablePeriods() {
        try {
            const periods = await this.reputasiService.getPeriods();
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
    async getAllPeriods() {
        try {
            const periods = await this.reputasiService.getPeriods();
            const periodsWithCounts = await Promise.all(periods.map(async (period) => {
                const count = await this.reputasiService.getIndikatorCountByPeriod(period.year, period.quarter);
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
            console.error('Error in getAllPeriods:', error);
            throw error;
        }
    }
    async duplicateIndikator(id, year, quarter) {
        return await this.reputasiService.duplicateIndikatorToNewPeriod(id, year, quarter);
    }
};
exports.ReputasiController = ReputasiController;
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new reputasi section' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reputasi_section_dto_1.CreateReputasiSectionDto]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reputasi sections' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reputasi section by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getSection", null);
__decorate([
    (0, common_1.Put)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reputasi section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_reputasi_section_dto_1.UpdateReputasiSectionDto]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete reputasi section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Get)('indikators/sections-by-period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sections with indicators by period' }),
    __param(0, (0, common_1.Query)('year', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getSectionsWithIndicatorsByPeriod", null);
__decorate([
    (0, common_1.Post)('indikators'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new reputasi indikator' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reputasi_dto_1.CreateReputasiDto]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Get)('indikators'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reputasi indikators' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getAllIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reputasi indikators by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: reputasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getIndikatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('indikators/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search reputasi indikators' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: reputasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "searchIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reputasi indikator by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getIndikator", null);
__decorate([
    (0, common_1.Put)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reputasi indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_reputasi_dto_1.UpdateReputasiDto]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indikators/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete reputasi indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "deleteIndikator", null);
__decorate([
    (0, common_1.Get)('total-weighted'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total weighted by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: reputasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getTotalWeighted", null);
__decorate([
    (0, common_1.Get)('sections/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reputasi sections by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: reputasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available periods',
        description: 'Get list of distinct years and quarters that have data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getAvailablePeriods", null);
__decorate([
    (0, common_1.Get)('all-periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all periods with count',
        description: 'Get periods with indicator counts',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "getAllPeriods", null);
__decorate([
    (0, common_1.Post)('indikators/:id/duplicate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate indikator to new period' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ReputasiController.prototype, "duplicateIndikator", null);
exports.ReputasiController = ReputasiController = __decorate([
    (0, swagger_1.ApiTags)('Reputasi'),
    (0, common_1.Controller)('reputasi'),
    __metadata("design:paramtypes", [reputasi_service_1.ReputasiService])
], ReputasiController);
//# sourceMappingURL=reputasi.controller.js.map