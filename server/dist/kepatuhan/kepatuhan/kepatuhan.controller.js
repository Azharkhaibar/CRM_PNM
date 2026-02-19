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
exports.KepatuhanController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kepatuhan_service_1 = require("./kepatuhan.service");
const create_kepatuhan_section_dto_1 = require("./dto/create-kepatuhan-section.dto");
const update_kepatuhan_section_dto_1 = require("./dto/update-kepatuhan-section.dto");
const create_kepatuhan_dto_1 = require("./dto/create-kepatuhan.dto");
const update_kepatuhan_dto_1 = require("./dto/update-kepatuhan.dto");
const kepatuhan_entity_1 = require("./entities/kepatuhan.entity");
let KepatuhanController = class KepatuhanController {
    kepatuhanService;
    constructor(kepatuhanService) {
        this.kepatuhanService = kepatuhanService;
    }
    async createSection(createDto) {
        return await this.kepatuhanService.createSection(createDto);
    }
    async getSections(isActive) {
        return await this.kepatuhanService.findAllSections(isActive);
    }
    async getSection(id) {
        return await this.kepatuhanService.findSectionById(id);
    }
    async updateSection(id, updateDto) {
        return await this.kepatuhanService.updateSection(id, updateDto);
    }
    async deleteSection(id) {
        await this.kepatuhanService.deleteSection(id);
    }
    async getSectionsWithIndicatorsByPeriod(year, quarter) {
        return await this.kepatuhanService.getSectionsWithIndicatorsByPeriod(year, quarter);
    }
    async createIndikator(createDto) {
        return await this.kepatuhanService.createIndikator(createDto);
    }
    async getAllIndikators() {
        return await this.kepatuhanService.findAllIndikators();
    }
    async getIndikatorsByPeriod(year, quarter) {
        return await this.kepatuhanService.findIndikatorsByPeriod(year, quarter);
    }
    async searchIndikators(query, year, quarter) {
        return await this.kepatuhanService.searchIndikators(query, year, quarter);
    }
    async getIndikator(id) {
        return await this.kepatuhanService.findIndikatorById(id);
    }
    async updateIndikator(id, updateDto) {
        return await this.kepatuhanService.updateIndikator(id, updateDto);
    }
    async deleteIndikator(id) {
        await this.kepatuhanService.deleteIndikator(id);
    }
    async getTotalWeighted(year, quarter) {
        const total = await this.kepatuhanService.getTotalWeightedByPeriod(year, quarter);
        return { total };
    }
    async getSectionsByPeriod(year, quarter) {
        return await this.kepatuhanService.findSectionsByPeriod(year, quarter);
    }
    async getAvailablePeriods() {
        try {
            const periods = await this.kepatuhanService.getPeriods();
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
            const periods = await this.kepatuhanService.getPeriods();
            const periodsWithCounts = await Promise.all(periods.map(async (period) => {
                const count = await this.kepatuhanService.getIndikatorCountByPeriod(period.year, period.quarter);
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
        return await this.kepatuhanService.duplicateIndikatorToNewPeriod(id, year, quarter);
    }
};
exports.KepatuhanController = KepatuhanController;
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new kepatuhan section' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kepatuhan_section_dto_1.CreateKepatuhanSectionDto]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all kepatuhan sections' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get kepatuhan section by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getSection", null);
__decorate([
    (0, common_1.Put)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update kepatuhan section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_kepatuhan_section_dto_1.UpdateKepatuhanSectionDto]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete kepatuhan section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Get)('indikators/sections-by-period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sections with indicators by period' }),
    __param(0, (0, common_1.Query)('year', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getSectionsWithIndicatorsByPeriod", null);
__decorate([
    (0, common_1.Post)('indikators'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new kepatuhan indikator' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kepatuhan_dto_1.CreateKepatuhanDto]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Get)('indikators'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all kepatuhan indikators' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getAllIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get kepatuhan indikators by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: kepatuhan_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getIndikatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('indikators/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search kepatuhan indikators' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: kepatuhan_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "searchIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get kepatuhan indikator by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getIndikator", null);
__decorate([
    (0, common_1.Put)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update kepatuhan indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_kepatuhan_dto_1.UpdateKepatuhanDto]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indikators/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete kepatuhan indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "deleteIndikator", null);
__decorate([
    (0, common_1.Get)('total-weighted'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total weighted by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: kepatuhan_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getTotalWeighted", null);
__decorate([
    (0, common_1.Get)('sections/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get kepatuhan sections by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: kepatuhan_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available periods',
        description: 'Get list of distinct years and quarters that have data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getAvailablePeriods", null);
__decorate([
    (0, common_1.Get)('all-periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all periods with count',
        description: 'Get periods with indicator counts',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KepatuhanController.prototype, "getAllPeriods", null);
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
], KepatuhanController.prototype, "duplicateIndikator", null);
exports.KepatuhanController = KepatuhanController = __decorate([
    (0, swagger_1.ApiTags)('Kepatuhan'),
    (0, common_1.Controller)('kepatuhan'),
    __metadata("design:paramtypes", [kepatuhan_service_1.KepatuhanService])
], KepatuhanController);
//# sourceMappingURL=kepatuhan.controller.js.map