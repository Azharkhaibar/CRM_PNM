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
exports.ResikoProfileRepositoryController = void 0;
const common_1 = require("@nestjs/common");
const resiko_profile_repository_service_1 = require("./resiko-profile-repository.service");
const resiko_profile_repository_entity_1 = require("./entities/resiko-profile-repository.entity");
const swagger_1 = require("@nestjs/swagger");
let ResikoProfileRepositoryController = class ResikoProfileRepositoryController {
    resikoProfileRepositoryService;
    constructor(resikoProfileRepositoryService) {
        this.resikoProfileRepositoryService = resikoProfileRepositoryService;
    }
    async getRepositoryData(year, quarter, moduleTypes, searchQuery, page = 1, limit = 100, sortBy, sortOrder) {
        const filters = {
            year: year ? Number(year) : undefined,
            quarter,
            moduleTypes: moduleTypes
                ? Array.isArray(moduleTypes)
                    ? moduleTypes
                    : [moduleTypes]
                : undefined,
            searchQuery,
        };
        const pagination = {
            page: Number(page),
            limit: Number(limit),
            sortBy,
            sortOrder,
        };
        return this.resikoProfileRepositoryService.getRepositoryData(filters, pagination);
    }
    async getRepositoryDataByModule(module, year, quarter, searchQuery, page = 1, limit = 100) {
        if (!Object.values(resiko_profile_repository_entity_1.ModuleType).includes(module)) {
            throw new common_1.BadRequestException(`Invalid module type: ${module}`);
        }
        const filters = {
            year: year ? Number(year) : undefined,
            quarter,
            searchQuery,
        };
        const pagination = {
            page: Number(page),
            limit: Number(limit),
        };
        return this.resikoProfileRepositoryService.getRepositoryDataByModule(module, filters, pagination);
    }
    async searchRepositoryData(query, year, quarter, moduleTypes, page = 1, limit = 100) {
        if (!query || query.trim().length === 0) {
            throw new common_1.BadRequestException('Search query is required');
        }
        const filters = {
            year: year ? Number(year) : undefined,
            quarter,
            moduleTypes: moduleTypes
                ? Array.isArray(moduleTypes)
                    ? moduleTypes
                    : [moduleTypes]
                : undefined,
        };
        const pagination = {
            page: Number(page),
            limit: Number(limit),
        };
        return this.resikoProfileRepositoryService.searchRepositoryData(query, filters, pagination);
    }
    async getRepositoryStatistics(year, quarter) {
        if (!year) {
            throw new common_1.BadRequestException('Year is required');
        }
        if (!quarter || !Object.values(resiko_profile_repository_entity_1.Quarter).includes(quarter)) {
            throw new common_1.BadRequestException('Valid quarter is required');
        }
        return this.resikoProfileRepositoryService.getRepositoryStatistics(Number(year), quarter);
    }
    async exportRepositoryData(year, quarter, moduleTypes) {
        const filters = {
            year: year ? Number(year) : undefined,
            quarter,
            moduleTypes: moduleTypes
                ? Array.isArray(moduleTypes)
                    ? moduleTypes
                    : [moduleTypes]
                : undefined,
        };
        const buffer = await this.resikoProfileRepositoryService.exportRepositoryData(filters, 'csv');
        const filename = `Risk_Profile_Repository_${year || 'all'}_${quarter || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
        return {
            buffer,
            contentType: 'text/csv',
            filename,
        };
    }
    getAvailableModules() {
        return {
            modules: Object.values(resiko_profile_repository_entity_1.ModuleType).map((module) => ({
                code: module,
                name: this.getModuleName(module),
                color: this.getModuleColor(module),
            })),
        };
    }
    async getAvailablePeriods() {
        return this.resikoProfileRepositoryService.getAvailablePeriods();
    }
    getModuleName(module) {
        const moduleNames = {
            [resiko_profile_repository_entity_1.ModuleType.KEPATUHAN]: 'Kepatuhan',
            [resiko_profile_repository_entity_1.ModuleType.REPUTASI]: 'Reputasi',
            [resiko_profile_repository_entity_1.ModuleType.INVESTASI]: 'Investasi',
            [resiko_profile_repository_entity_1.ModuleType.LIKUIDITAS]: 'Likuiditas',
            [resiko_profile_repository_entity_1.ModuleType.OPERASIONAL]: 'Operasional',
            [resiko_profile_repository_entity_1.ModuleType.STRATEGIK]: 'Strategik',
            [resiko_profile_repository_entity_1.ModuleType.HUKUM]: 'Hukum',
            [resiko_profile_repository_entity_1.ModuleType.PASAR]: 'Pasar',
        };
        return moduleNames[module] || module;
    }
    getModuleColor(module) {
        const moduleColors = {
            [resiko_profile_repository_entity_1.ModuleType.KEPATUHAN]: '#0068B3',
            [resiko_profile_repository_entity_1.ModuleType.REPUTASI]: '#00A3DA',
            [resiko_profile_repository_entity_1.ModuleType.INVESTASI]: '#33C2B5',
            [resiko_profile_repository_entity_1.ModuleType.LIKUIDITAS]: '#FF6B6B',
            [resiko_profile_repository_entity_1.ModuleType.OPERASIONAL]: '#FFA726',
            [resiko_profile_repository_entity_1.ModuleType.STRATEGIK]: '#9C27B0',
            [resiko_profile_repository_entity_1.ModuleType.HUKUM]: '#4CAF50',
            [resiko_profile_repository_entity_1.ModuleType.PASAR]: '#607D8B',
        };
        return moduleColors[module] || '#6B7280';
    }
};
exports.ResikoProfileRepositoryController = ResikoProfileRepositoryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all repository data with filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: resiko_profile_repository_entity_1.Quarter }),
    (0, swagger_1.ApiQuery)({
        name: 'moduleTypes',
        required: false,
        isArray: true,
        enum: resiko_profile_repository_entity_1.ModuleType,
    }),
    (0, swagger_1.ApiQuery)({ name: 'searchQuery', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, default: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, default: 100 }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Repository data retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __param(2, (0, common_1.Query)('moduleTypes')),
    __param(3, (0, common_1.Query)('searchQuery')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Array, String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], ResikoProfileRepositoryController.prototype, "getRepositoryData", null);
__decorate([
    (0, common_1.Get)('module/:module'),
    (0, swagger_1.ApiOperation)({ summary: 'Get repository data by specific module' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: resiko_profile_repository_entity_1.Quarter }),
    (0, swagger_1.ApiQuery)({ name: 'searchQuery', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, default: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, default: 100 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Module data retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('module')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __param(3, (0, common_1.Query)('searchQuery')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ResikoProfileRepositoryController.prototype, "getRepositoryDataByModule", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search across all modules' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: resiko_profile_repository_entity_1.Quarter }),
    (0, swagger_1.ApiQuery)({
        name: 'moduleTypes',
        required: false,
        isArray: true,
        enum: resiko_profile_repository_entity_1.ModuleType,
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, default: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, default: 100 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __param(3, (0, common_1.Query)('moduleTypes')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Array, Number, Number]),
    __metadata("design:returntype", Promise)
], ResikoProfileRepositoryController.prototype, "searchRepositoryData", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get repository statistics for a period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: resiko_profile_repository_entity_1.Quarter }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ResikoProfileRepositoryController.prototype, "getRepositoryStatistics", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export repository data (CSV only)' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, enum: resiko_profile_repository_entity_1.Quarter }),
    (0, swagger_1.ApiQuery)({
        name: 'moduleTypes',
        required: false,
        isArray: true,
        enum: resiko_profile_repository_entity_1.ModuleType,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Export file generated successfully',
    }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __param(2, (0, common_1.Query)('moduleTypes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Array]),
    __metadata("design:returntype", Promise)
], ResikoProfileRepositoryController.prototype, "exportRepositoryData", null);
__decorate([
    (0, common_1.Get)('modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of available modules' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Module list retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResikoProfileRepositoryController.prototype, "getAvailableModules", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available periods in repository' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Periods retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResikoProfileRepositoryController.prototype, "getAvailablePeriods", null);
exports.ResikoProfileRepositoryController = ResikoProfileRepositoryController = __decorate([
    (0, swagger_1.ApiTags)('Risk Profile Repository'),
    (0, common_1.Controller)('risk-profile-repository'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [resiko_profile_repository_service_1.ResikoProfileRepositoryService])
], ResikoProfileRepositoryController);
//# sourceMappingURL=resiko-profile-repository.controller.js.map