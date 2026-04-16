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
exports.InvestasiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const new_investasi_service_1 = require("./new-investasi.service");
const create_investasi_section_dto_1 = require("./dto/create-investasi-section.dto");
const update_new_investasi_section_dto_1 = require("./dto/update-new-investasi-section.dto");
const create_new_investasi_dto_1 = require("./dto/create-new-investasi.dto");
const update_new_investasi_dto_1 = require("./dto/update-new-investasi.dto");
const new_investasi_entity_1 = require("./entities/new-investasi.entity");
let InvestasiController = class InvestasiController {
    investasiService;
    constructor(investasiService) {
        this.investasiService = investasiService;
    }
    async createSection(createDto) {
        return await this.investasiService.createSection(createDto);
    }
    async getSections(isActive) {
        return await this.investasiService.findAllSections(isActive);
    }
    async getSection(id) {
        return await this.investasiService.findSectionById(id);
    }
    async getSectionsByPeriod(year, quarter) {
        return await this.investasiService.findSectionsByPeriod(year, quarter);
    }
    async updateSection(id, updateDto) {
        return await this.investasiService.updateSection(id, updateDto);
    }
    async deleteSection(id) {
        return await this.investasiService.deleteSection(id);
    }
    async createIndikator(createDto) {
        return await this.investasiService.createIndikator(createDto);
    }
    async getAllIndikators() {
        return await this.investasiService.findAllIndikators();
    }
    async getIndikatorsByPeriod(year, quarter) {
        return await this.investasiService.findIndikatorsByPeriod(year, quarter);
    }
    async searchIndikators(query, year, quarter) {
        return await this.investasiService.searchIndikators(query, year, quarter);
    }
    async getIndikator(id) {
        return await this.investasiService.findIndikatorById(id);
    }
    async updateIndikator(id, updateDto) {
        return await this.investasiService.updateIndikator(id, updateDto);
    }
    async deleteIndikator(id) {
        return await this.investasiService.deleteIndikator(id);
    }
    async getSectionsWithIndicatorsByPeriod(year, quarter) {
        return await this.investasiService.getSectionsWithIndicatorsByPeriod(year, quarter);
    }
    async getTotalWeighted(year, quarter) {
        const total = await this.investasiService.getTotalWeightedByPeriod(year, quarter);
        return {
            success: true,
            year,
            quarter,
            total,
        };
    }
    async getAvailablePeriods() {
        try {
            const periods = await this.investasiService.getPeriods();
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
            const periods = await this.investasiService.getPeriods();
            const periodsWithCounts = await Promise.all(periods.map(async (period) => {
                const count = await this.investasiService.getIndikatorCountByPeriod(period.year, period.quarter);
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
        const count = await this.investasiService.getIndikatorCountByPeriod(year, quarter);
        return {
            success: true,
            year,
            quarter,
            count,
        };
    }
    async duplicateIndikator(id, year, quarter) {
        return await this.investasiService.duplicateIndikatorToNewPeriod(id, year, quarter);
    }
};
exports.InvestasiController = InvestasiController;
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new investasi section' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Section created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Section already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investasi_section_dto_1.CreateInvestasiSectionDto]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all investasi sections' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get investasi section by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getSection", null);
__decorate([
    (0, common_1.Get)('sections/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get investasi sections by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: new_investasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Put)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update investasi section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_new_investasi_section_dto_1.UpdateInvestasiSectionDto]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete investasi section' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Post)('indikators'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new investasi indikator' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Indikator created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Indikator already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_new_investasi_dto_1.CreateInvestasiDto]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Get)('indikators'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all investasi indikators' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getAllIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get investasi indikators by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: new_investasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getIndikatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('indikators/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search investasi indikators' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: new_investasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "searchIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get investasi indikator by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getIndikator", null);
__decorate([
    (0, common_1.Put)('indikators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update investasi indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_new_investasi_dto_1.UpdateInvestasiDto]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indikators/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete investasi indikator' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "deleteIndikator", null);
__decorate([
    (0, common_1.Get)('data/with-indicators'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get sections with their indicators for a period',
        description: 'Returns sections with nested indicators for a specific year and quarter',
    }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: new_investasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getSectionsWithIndicatorsByPeriod", null);
__decorate([
    (0, common_1.Get)('total-weighted'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total weighted value by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: new_investasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getTotalWeighted", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available periods',
        description: 'Get list of distinct years and quarters that have data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getAvailablePeriods", null);
__decorate([
    (0, common_1.Get)('periods/with-counts'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all periods with indicator counts',
        description: 'Get periods with indicator counts for each period',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getAllPeriodsWithCounts", null);
__decorate([
    (0, common_1.Get)('indikators/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get indikator count by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: new_investasi_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], InvestasiController.prototype, "getIndikatorCount", null);
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
], InvestasiController.prototype, "duplicateIndikator", null);
exports.InvestasiController = InvestasiController = __decorate([
    (0, swagger_1.ApiTags)('Investasi'),
    (0, common_1.Controller)('investasi'),
    __metadata("design:paramtypes", [new_investasi_service_1.InvestasiService])
], InvestasiController);
//# sourceMappingURL=new-investasi.controller.js.map