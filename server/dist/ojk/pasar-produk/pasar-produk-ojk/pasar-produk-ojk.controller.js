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
exports.PasarProdukOjkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pasar_produk_ojk_service_1 = require("./pasar-produk-ojk.service");
const pasar_produk_inherent_dto_1 = require("./dto/pasar-produk-inherent.dto");
let PasarProdukOjkController = class PasarProdukOjkController {
    inherentService;
    constructor(inherentService) {
        this.inherentService = inherentService;
    }
    async findAll(year, quarter) {
        if (year && quarter) {
            const result = await this.inherentService.findByYearQuarter(year, quarter);
            if (!result) {
                throw new common_1.NotFoundException(`Data tidak ditemukan untuk tahun ${year} quarter ${quarter}`);
            }
            return result;
        }
        return this.inherentService.getAll();
    }
    async getActive() {
        const result = await this.inherentService.findActive();
        if (!result) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        return result;
    }
    async findOne(id) {
        const activeData = await this.inherentService.findActive();
        if (!activeData) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        const result = await this.inherentService.findByYearQuarter(activeData.year, activeData.quarter);
        if (!result) {
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
        }
        return result;
    }
    async create(createDto, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.create(createDto, userId);
    }
    async update(id, updateDto, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.update(id, updateDto, userId);
    }
    async updateSummary(id, summaryDto, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.updateSummary(id, summaryDto, userId);
    }
    async updateActiveStatus(id, isActive, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.updateActiveStatus(id, isActive, userId);
    }
    async remove(id) {
        return this.inherentService.remove(id);
    }
    async getParameters(inherentId) {
        const inherent = await this.getInherentByIdOrThrow(inherentId);
        return inherent.parameters || [];
    }
    async addParameter(inherentId, createParamDto, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.addParameter(inherentId, createParamDto, userId);
    }
    async updateParameter(inherentId, parameterId, updateParamDto, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.updateParameter(inherentId, parameterId, updateParamDto, userId);
    }
    async reorderParameters(inherentId, reorderDto) {
        return this.inherentService.reorderParameters(inherentId, reorderDto);
    }
    async copyParameter(inherentId, parameterId, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.copyParameter(inherentId, parameterId, userId);
    }
    async removeParameter(inherentId, parameterId, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.removeParameter(inherentId, parameterId, userId);
    }
    async getNilai(inherentId, parameterId) {
        const inherent = await this.getInherentByIdOrThrow(inherentId);
        const parameter = inherent.parameters?.find((p) => p.id === parameterId);
        if (!parameter) {
            throw new common_1.NotFoundException(`Parameter dengan ID ${parameterId} tidak ditemukan`);
        }
        return parameter.nilaiList || [];
    }
    async addNilai(inherentId, parameterId, createNilaiDto, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.addNilai(inherentId, parameterId, createNilaiDto, userId);
    }
    async updateNilai(inherentId, parameterId, nilaiId, updateNilaiDto, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.updateNilai(inherentId, parameterId, nilaiId, updateNilaiDto, userId);
    }
    async reorderNilai(inherentId, parameterId, reorderDto) {
        return this.inherentService.reorderNilai(parameterId, reorderDto);
    }
    async copyNilai(inherentId, parameterId, nilaiId, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.copyNilai(inherentId, parameterId, nilaiId, userId);
    }
    async removeNilai(inherentId, parameterId, nilaiId, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.removeNilai(inherentId, parameterId, nilaiId, userId);
    }
    async exportToExcel(inherentId) {
        return this.inherentService.exportToExcel(inherentId);
    }
    async importFromExcel(importData, req) {
        const userId = req.user?.id || 'system';
        return this.inherentService.importFromExcel(importData, userId);
    }
    async getReferences(type) {
        return this.inherentService.getReferences(type);
    }
    async checkExists(year, quarter) {
        const exists = await this.inherentService.findByYearQuarter(year, quarter);
        return { exists: !!exists, data: exists };
    }
    async getInherentByIdOrThrow(inherentId) {
        const activeData = await this.inherentService.findActive();
        if (!activeData) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        const inherent = await this.inherentService.findByYearQuarter(activeData.year, activeData.quarter);
        if (!inherent) {
            throw new common_1.NotFoundException(`Data dengan ID ${inherentId} tidak ditemukan`);
        }
        if (inherent.id !== inherentId) {
            throw new common_1.NotFoundException(`Data dengan ID ${inherentId} tidak ditemukan`);
        }
        return inherent;
    }
    async getInherentByIdDirect(inherentId) {
        return this.getInherentByIdOrThrow(inherentId);
    }
};
exports.PasarProdukOjkController = PasarProdukOjkController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all Pasar Produk OJK data or by year/quarter' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data retrieved successfully' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active Pasar Produk OJK data' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active data retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No active data found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Pasar Produk OJK by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new Pasar Produk OJK data' }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.CreatePasarProdukInherentDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pasar_produk_inherent_dto_1.CreatePasarProdukInherentDto, Object]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Pasar Produk OJK data' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.UpdatePasarProdukInherentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pasar_produk_inherent_dto_1.UpdatePasarProdukInherentDto, Object]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Update summary only' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.UpdateSummaryDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Summary updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pasar_produk_inherent_dto_1.UpdateSummaryDto, Object]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "updateSummary", null);
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
], PasarProdukOjkController.prototype, "updateActiveStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Pasar Produk OJK data' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/parameters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all parameters for specific Pasar Produk OJK' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parameters retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "getParameters", null);
__decorate([
    (0, common_1.Post)(':id/parameters'),
    (0, swagger_1.ApiOperation)({ summary: 'Add new parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.CreateParameterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Parameter added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pasar_produk_inherent_dto_1.CreateParameterDto, Object]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "addParameter", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.UpdateParameterDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parameter updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parameter not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, pasar_produk_inherent_dto_1.UpdateParameterDto, Object]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "updateParameter", null);
__decorate([
    (0, common_1.Put)(':id/parameters/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder parameters' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.ReorderParametersDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parameters reordered successfully',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pasar_produk_inherent_dto_1.ReorderParametersDto]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "reorderParameters", null);
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
], PasarProdukOjkController.prototype, "copyParameter", null);
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
], PasarProdukOjkController.prototype, "removeParameter", null);
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
], PasarProdukOjkController.prototype, "getNilai", null);
__decorate([
    (0, common_1.Post)(':id/parameters/:parameterId/nilai'),
    (0, swagger_1.ApiOperation)({ summary: 'Add new nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.CreateNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Nilai added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parameter not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, pasar_produk_inherent_dto_1.CreateNilaiDto, Object]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "addNilai", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId/nilai/:nilaiId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'nilaiId', type: Number }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.UpdateNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nilai updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nilai not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('nilaiId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, pasar_produk_inherent_dto_1.UpdateNilaiDto, Object]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "updateNilai", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId/nilai/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.ReorderNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nilai reordered successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, pasar_produk_inherent_dto_1.ReorderNilaiDto]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "reorderNilai", null);
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
], PasarProdukOjkController.prototype, "copyNilai", null);
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
], PasarProdukOjkController.prototype, "removeNilai", null);
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
], PasarProdukOjkController.prototype, "exportToExcel", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import data from Excel format' }),
    (0, swagger_1.ApiBody)({ type: pasar_produk_inherent_dto_1.ImportExportDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Import successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pasar_produk_inherent_dto_1.ImportExportDto, Object]),
    __metadata("design:returntype", Promise)
], PasarProdukOjkController.prototype, "importFromExcel", null);
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
], PasarProdukOjkController.prototype, "getReferences", null);
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
], PasarProdukOjkController.prototype, "checkExists", null);
exports.PasarProdukOjkController = PasarProdukOjkController = __decorate([
    (0, swagger_1.ApiTags)('Pasar Produk OJK'),
    (0, common_1.Controller)('pasar-produk-ojk'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    })),
    __metadata("design:paramtypes", [pasar_produk_ojk_service_1.PasarProdukOjkService])
], PasarProdukOjkController);
//# sourceMappingURL=pasar-produk-ojk.controller.js.map