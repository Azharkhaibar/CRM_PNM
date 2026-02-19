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
exports.HukumController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hukum_service_1 = require("./hukum.service");
const create_hukum_section_dto_1 = require("./dto/create-hukum-section.dto");
const update_hukum_section_dto_1 = require("./dto/update-hukum-section.dto");
const hukum_entity_1 = require("./entities/hukum.entity");
const update_hukum_dto_1 = require("./dto/update-hukum.dto");
const create_hukum_dto_1 = require("./dto/create-hukum.dto");
let HukumController = class HukumController {
    hukumService;
    constructor(hukumService) {
        this.hukumService = hukumService;
    }
    async createSection(createDto) {
        return await this.hukumService.createSection(createDto);
    }
    async getSections(isActive) {
        return await this.hukumService.findAllSections(isActive);
    }
    async getSection(id) {
        return await this.hukumService.findSectionById(id);
    }
    async updateSection(id, updateDto) {
        return await this.hukumService.updateSection(id, updateDto);
    }
    async deleteSection(id) {
        await this.hukumService.deleteSection(id);
    }
    async getSectionsWithIndicatorsByPeriod(year, quarter) {
        return await this.hukumService.getSectionsWithIndicatorsByPeriod(year, quarter);
    }
    async createIndikator(createDto) {
        return await this.hukumService.createIndikator(createDto);
    }
    async getAllIndikators() {
        return await this.hukumService.findAllIndikators();
    }
    async getIndikatorsByPeriod(year, quarter) {
        return await this.hukumService.findIndikatorsByPeriod(year, quarter);
    }
    async searchIndikators(query, year, quarter) {
        return await this.hukumService.searchIndikators(query, year, quarter);
    }
    async getIndikator(id) {
        return await this.hukumService.findIndikatorById(id);
    }
    async updateIndikator(id, updateDto) {
        return await this.hukumService.updateIndikator(id, updateDto);
    }
    async deleteIndikator(id) {
        await this.hukumService.deleteIndikator(id);
    }
    async getTotalWeighted(year, quarter) {
        const total = await this.hukumService.getTotalWeightedByPeriod(year, quarter);
        return { total };
    }
    async getSectionsByPeriod(year, quarter) {
        return await this.hukumService.findSectionsByPeriod(year, quarter);
    }
    async getAvailablePeriods() {
        try {
            const periods = await this.hukumService.getPeriods();
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
            const periods = await this.hukumService.getPeriods();
            const periodsWithCounts = await Promise.all(periods.map(async (period) => {
                const count = await this.hukumService.getIndikatorCountByPeriod(period.year, period.quarter);
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
        return await this.hukumService.duplicateIndikatorToNewPeriod(id, year, quarter);
    }
};
exports.HukumController = HukumController;
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new strategik section' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hukum_section_dto_1.CreateHukumSectionDto]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all strategik sections' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get strategik section by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getSection", null);
__decorate([
    (0, common_1.Put)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update strategik section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hukum_section_dto_1.UpdateHukumSectionDto]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete strategik section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Get)('indikators/sections-by-period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sections with indicators by period' }),
    __param(0, (0, common_1.Query)('year', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getSectionsWithIndicatorsByPeriod", null);
__decorate([
    (0, common_1.Post)('indikators'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new strategik indikator' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hukum_dto_1.CreateHukumDto]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Get)('indikators'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all strategik indikators' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getAllIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get strategik indikators by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: hukum_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getIndikatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('indikators/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search strategik indikators' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: hukum_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "searchIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get strategik indikator by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getIndikator", null);
__decorate([
    (0, common_1.Put)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update strategik indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hukum_dto_1.UpdateHukumDto]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indikators/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete strategik indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "deleteIndikator", null);
__decorate([
    (0, common_1.Get)('total-weighted'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total weighted by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: hukum_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getTotalWeighted", null);
__decorate([
    (0, common_1.Get)('sections/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get strategik sections by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: hukum_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available periods',
        description: 'Get list of distinct years and quarters that have data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getAvailablePeriods", null);
__decorate([
    (0, common_1.Get)('all-periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all periods with count',
        description: 'Get periods with indicator counts',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HukumController.prototype, "getAllPeriods", null);
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
], HukumController.prototype, "duplicateIndikator", null);
exports.HukumController = HukumController = __decorate([
    (0, swagger_1.ApiTags)('Hukum'),
    (0, common_1.Controller)('hukum'),
    __metadata("design:paramtypes", [hukum_service_1.HukumService])
], HukumController);
//# sourceMappingURL=hukum.controller.js.map