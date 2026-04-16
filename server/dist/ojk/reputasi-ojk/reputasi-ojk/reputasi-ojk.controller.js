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
exports.ReputasiOjkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reputasi_ojk_service_1 = require("./reputasi-ojk.service");
const reputasi_inherent_dto_1 = require("./dto/reputasi-inherent.dto");
let ReputasiOjkController = class ReputasiOjkController {
    reputasiService;
    constructor(reputasiService) {
        this.reputasiService = reputasiService;
    }
    async findAll(year, quarter) {
        if (year && quarter) {
            const result = await this.reputasiService.findByYearQuarter(year, quarter);
            if (!result) {
                throw new common_1.NotFoundException(`Data tidak ditemukan untuk tahun ${year} quarter ${quarter}`);
            }
            return result;
        }
        return this.reputasiService.getAll();
    }
    async getActive() {
        const result = await this.reputasiService.findActive();
        if (!result) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        return result;
    }
    async findOne(id) {
        const activeData = await this.reputasiService.findActive();
        if (!activeData) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        const result = await this.reputasiService.findByYearQuarter(activeData.year, activeData.quarter);
        if (!result) {
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
        }
        return result;
    }
    async create(createDto, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.create(createDto, userId);
    }
    async update(id, updateDto, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.update(id, updateDto, userId);
    }
    async updateSummary(id, summaryDto, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.updateSummary(id, summaryDto, userId);
    }
    async updateActiveStatus(id, isActive, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.updateActiveStatus(id, isActive, userId);
    }
    async remove(id) {
        return this.reputasiService.remove(id);
    }
    async getParameters(reputasiId) {
        const reputasi = await this.getReputasiByIdOrThrow(reputasiId);
        return reputasi.parameters || [];
    }
    async addParameter(reputasiId, createParamDto, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.addParameter(reputasiId, createParamDto, userId);
    }
    async updateParameter(reputasiId, parameterId, updateParamDto, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.updateParameter(reputasiId, parameterId, updateParamDto, userId);
    }
    async reorderParameters(reputasiId, reorderDto) {
        return this.reputasiService.reorderParameters(reputasiId, reorderDto);
    }
    async copyParameter(reputasiId, parameterId, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.copyParameter(reputasiId, parameterId, userId);
    }
    async removeParameter(reputasiId, parameterId, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.removeParameter(reputasiId, parameterId, userId);
    }
    async getNilai(reputasiId, parameterId) {
        const reputasi = await this.getReputasiByIdOrThrow(reputasiId);
        const parameter = reputasi.parameters?.find((p) => p.id === parameterId);
        if (!parameter) {
            throw new common_1.NotFoundException(`Parameter dengan ID ${parameterId} tidak ditemukan`);
        }
        return parameter.nilaiList || [];
    }
    async addNilai(reputasiId, parameterId, createNilaiDto, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.addNilai(reputasiId, parameterId, createNilaiDto, userId);
    }
    async updateNilai(reputasiId, parameterId, nilaiId, updateNilaiDto, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.updateNilai(reputasiId, parameterId, nilaiId, updateNilaiDto, userId);
    }
    async reorderNilai(reputasiId, parameterId, reorderDto) {
        return this.reputasiService.reorderNilai(parameterId, reorderDto);
    }
    async copyNilai(reputasiId, parameterId, nilaiId, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.copyNilai(reputasiId, parameterId, nilaiId, userId);
    }
    async removeNilai(reputasiId, parameterId, nilaiId, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.removeNilai(reputasiId, parameterId, nilaiId, userId);
    }
    async exportToExcel(reputasiId) {
        return this.reputasiService.exportToExcel(reputasiId);
    }
    async importFromExcel(importData, req) {
        const userId = req.user?.id || 'system';
        return this.reputasiService.importFromExcel(importData, userId);
    }
    async getReferences(type) {
        return this.reputasiService.getReferences(type);
    }
    async checkExists(year, quarter) {
        const exists = await this.reputasiService.findByYearQuarter(year, quarter);
        return { exists: !!exists, data: exists };
    }
    async getReputasiByIdOrThrow(reputasiId) {
        const activeData = await this.reputasiService.findActive();
        if (!activeData) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        const reputasi = await this.reputasiService.findByYearQuarter(activeData.year, activeData.quarter);
        if (!reputasi) {
            throw new common_1.NotFoundException(`Data dengan ID ${reputasiId} tidak ditemukan`);
        }
        if (reputasi.id !== reputasiId) {
            throw new common_1.NotFoundException(`Data dengan ID ${reputasiId} tidak ditemukan`);
        }
        return reputasi;
    }
    async getReputasiByIdDirect(reputasiId) {
        return this.getReputasiByIdOrThrow(reputasiId);
    }
};
exports.ReputasiOjkController = ReputasiOjkController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all Reputasi OJK data or by year/quarter' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data retrieved successfully' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active Reputasi OJK data' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active data retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No active data found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Reputasi OJK by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new Reputasi OJK data' }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.CreateReputasiOjkDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reputasi_inherent_dto_1.CreateReputasiOjkDto, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Reputasi OJK data' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.UpdateReputasiOjkDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reputasi_inherent_dto_1.UpdateReputasiOjkDto, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Update summary only' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.UpdateSummaryDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Summary updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reputasi_inherent_dto_1.UpdateSummaryDto, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "updateSummary", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update active status' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ schema: { properties: { isActive: { type: 'boolean' } } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('isActive')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "updateActiveStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Reputasi OJK data' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/parameters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all parameters for specific Reputasi OJK' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parameters retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "getParameters", null);
__decorate([
    (0, common_1.Post)(':id/parameters'),
    (0, swagger_1.ApiOperation)({ summary: 'Add new parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.CreateParameterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Parameter added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reputasi_inherent_dto_1.CreateParameterDto, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "addParameter", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.UpdateParameterDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parameter updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parameter not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, reputasi_inherent_dto_1.UpdateParameterDto, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "updateParameter", null);
__decorate([
    (0, common_1.Put)(':id/parameters/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder parameters' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.ReorderParametersDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parameters reordered successfully',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reputasi_inherent_dto_1.ReorderParametersDto]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "reorderParameters", null);
__decorate([
    (0, common_1.Post)(':id/parameters/:parameterId/copy'),
    (0, swagger_1.ApiOperation)({ summary: 'Copy parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Parameter copied successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parameter not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "copyParameter", null);
__decorate([
    (0, common_1.Delete)(':id/parameters/:parameterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parameter deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parameter not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "removeParameter", null);
__decorate([
    (0, common_1.Get)(':id/parameters/:parameterId/nilai'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all nilai for specific parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nilai retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "getNilai", null);
__decorate([
    (0, common_1.Post)(':id/parameters/:parameterId/nilai'),
    (0, swagger_1.ApiOperation)({ summary: 'Add new nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.CreateNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Nilai added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parameter not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, reputasi_inherent_dto_1.CreateNilaiDto, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "addNilai", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId/nilai/:nilaiId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'nilaiId', type: Number }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.UpdateNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nilai updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nilai not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('nilaiId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, reputasi_inherent_dto_1.UpdateNilaiDto, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "updateNilai", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId/nilai/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.ReorderNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nilai reordered successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, reputasi_inherent_dto_1.ReorderNilaiDto]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "reorderNilai", null);
__decorate([
    (0, common_1.Post)(':id/parameters/:parameterId/nilai/:nilaiId/copy'),
    (0, swagger_1.ApiOperation)({ summary: 'Copy nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'nilaiId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Nilai copied successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nilai not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('nilaiId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "copyNilai", null);
__decorate([
    (0, common_1.Delete)(':id/parameters/:parameterId/nilai/:nilaiId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'nilaiId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nilai deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nilai not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('nilaiId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "removeNilai", null);
__decorate([
    (0, common_1.Get)(':id/export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export data to Excel format' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Export successful' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "exportToExcel", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import data from Excel format' }),
    (0, swagger_1.ApiBody)({ type: reputasi_inherent_dto_1.ImportExportDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Import successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reputasi_inherent_dto_1.ImportExportDto, Object]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "importFromExcel", null);
__decorate([
    (0, common_1.Get)('references'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reference data' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'References retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "getReferences", null);
__decorate([
    (0, common_1.Get)('check/:year/:quarter'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if data exists for year/quarter' }),
    (0, swagger_1.ApiParam)({ name: 'year', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'quarter', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Check completed' }),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('quarter', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ReputasiOjkController.prototype, "checkExists", null);
exports.ReputasiOjkController = ReputasiOjkController = __decorate([
    (0, swagger_1.ApiTags)('Reputasi OJK'),
    (0, common_1.Controller)('reputasi-ojk'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    })),
    __metadata("design:paramtypes", [reputasi_ojk_service_1.ReputasiOjkService])
], ReputasiOjkController);
//# sourceMappingURL=reputasi-ojk.controller.js.map