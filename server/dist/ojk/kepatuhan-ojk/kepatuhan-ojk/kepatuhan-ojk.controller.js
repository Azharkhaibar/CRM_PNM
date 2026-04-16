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
exports.KepatuhanOjkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kepatuhan_ojk_service_1 = require("./kepatuhan-ojk.service");
const kepatuhan_inherent_dto_1 = require("./dto/kepatuhan-inherent.dto");
let KepatuhanOjkController = class KepatuhanOjkController {
    kepatuhanService;
    constructor(kepatuhanService) {
        this.kepatuhanService = kepatuhanService;
    }
    async findAll(year, quarter) {
        if (year && quarter) {
            const result = await this.kepatuhanService.findByYearQuarter(year, quarter);
            if (!result) {
                throw new common_1.NotFoundException(`Data tidak ditemukan untuk tahun ${year} quarter ${quarter}`);
            }
            return result;
        }
        return this.kepatuhanService.getAll();
    }
    async getActive() {
        const result = await this.kepatuhanService.findActive();
        if (!result) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        return result;
    }
    async findOne(id) {
        const activeData = await this.kepatuhanService.findActive();
        if (!activeData) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        const result = await this.kepatuhanService.findByYearQuarter(activeData.year, activeData.quarter);
        if (!result) {
            throw new common_1.NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
        }
        return result;
    }
    async create(createDto, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.create(createDto, userId);
    }
    async update(id, updateDto, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.update(id, updateDto, userId);
    }
    async updateSummary(id, summaryDto, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.updateSummary(id, summaryDto, userId);
    }
    async updateActiveStatus(id, isActive, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.updateActiveStatus(id, isActive, userId);
    }
    async remove(id) {
        return this.kepatuhanService.remove(id);
    }
    async getParameters(kepatuhanId) {
        const kepatuhan = await this.getKepatuhanByIdOrThrow(kepatuhanId);
        return kepatuhan.parameters || [];
    }
    async addParameter(kepatuhanId, createParamDto, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.addParameter(kepatuhanId, createParamDto, userId);
    }
    async updateParameter(kepatuhanId, parameterId, updateParamDto, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.updateParameter(kepatuhanId, parameterId, updateParamDto, userId);
    }
    async reorderParameters(kepatuhanId, reorderDto) {
        return this.kepatuhanService.reorderParameters(kepatuhanId, reorderDto);
    }
    async copyParameter(kepatuhanId, parameterId, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.copyParameter(kepatuhanId, parameterId, userId);
    }
    async removeParameter(kepatuhanId, parameterId, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.removeParameter(kepatuhanId, parameterId, userId);
    }
    async getNilai(kepatuhanId, parameterId) {
        const kepatuhan = await this.getKepatuhanByIdOrThrow(kepatuhanId);
        const parameter = kepatuhan.parameters?.find((p) => p.id === parameterId);
        if (!parameter) {
            throw new common_1.NotFoundException(`Parameter dengan ID ${parameterId} tidak ditemukan`);
        }
        return parameter.nilaiList || [];
    }
    async addNilai(kepatuhanId, parameterId, createNilaiDto, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.addNilai(kepatuhanId, parameterId, createNilaiDto, userId);
    }
    async updateNilai(kepatuhanId, parameterId, nilaiId, updateNilaiDto, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.updateNilai(kepatuhanId, parameterId, nilaiId, updateNilaiDto, userId);
    }
    async reorderNilai(kepatuhanId, parameterId, reorderDto) {
        return this.kepatuhanService.reorderNilai(parameterId, reorderDto);
    }
    async copyNilai(kepatuhanId, parameterId, nilaiId, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.copyNilai(kepatuhanId, parameterId, nilaiId, userId);
    }
    async removeNilai(kepatuhanId, parameterId, nilaiId, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.removeNilai(kepatuhanId, parameterId, nilaiId, userId);
    }
    async exportToExcel(kepatuhanId) {
        return this.kepatuhanService.exportToExcel(kepatuhanId);
    }
    async importFromExcel(importData, req) {
        const userId = req.user?.id || 'system';
        return this.kepatuhanService.importFromExcel(importData, userId);
    }
    async getReferences(type) {
        return this.kepatuhanService.getReferences(type);
    }
    async checkExists(year, quarter) {
        const exists = await this.kepatuhanService.findByYearQuarter(year, quarter);
        return { exists: !!exists, data: exists };
    }
    async getKepatuhanByIdOrThrow(kepatuhanId) {
        const activeData = await this.kepatuhanService.findActive();
        if (!activeData) {
            throw new common_1.NotFoundException('Tidak ada data aktif ditemukan');
        }
        const kepatuhan = await this.kepatuhanService.findByYearQuarter(activeData.year, activeData.quarter);
        if (!kepatuhan) {
            throw new common_1.NotFoundException(`Data dengan ID ${kepatuhanId} tidak ditemukan`);
        }
        if (kepatuhan.id !== kepatuhanId) {
            throw new common_1.NotFoundException(`Data dengan ID ${kepatuhanId} tidak ditemukan`);
        }
        return kepatuhan;
    }
    async getKepatuhanByIdDirect(kepatuhanId) {
        return this.getKepatuhanByIdOrThrow(kepatuhanId);
    }
};
exports.KepatuhanOjkController = KepatuhanOjkController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all Kepatuhan OJK data or by year/quarter',
    }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data retrieved successfully' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active Kepatuhan OJK data' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active data retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No active data found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Kepatuhan OJK by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new Kepatuhan OJK data' }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.CreateKepatuhanDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kepatuhan_inherent_dto_1.CreateKepatuhanDto, Object]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Kepatuhan OJK data' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.UpdateKepatuhanDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kepatuhan_inherent_dto_1.UpdateKepatuhanDto, Object]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Update summary only' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.UpdateSummaryDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Summary updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kepatuhan_inherent_dto_1.UpdateSummaryDto, Object]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "updateSummary", null);
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
], KepatuhanOjkController.prototype, "updateActiveStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Kepatuhan OJK data' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/parameters'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all parameters for specific Kepatuhan OJK',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parameters retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "getParameters", null);
__decorate([
    (0, common_1.Post)(':id/parameters'),
    (0, swagger_1.ApiOperation)({ summary: 'Add new parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.CreateParameterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Parameter added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Data not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kepatuhan_inherent_dto_1.CreateParameterDto, Object]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "addParameter", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update parameter' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.UpdateParameterDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parameter updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parameter not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, kepatuhan_inherent_dto_1.UpdateParameterDto, Object]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "updateParameter", null);
__decorate([
    (0, common_1.Put)(':id/parameters/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder parameters' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.ReorderParametersDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parameters reordered successfully',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kepatuhan_inherent_dto_1.ReorderParametersDto]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "reorderParameters", null);
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
], KepatuhanOjkController.prototype, "copyParameter", null);
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
], KepatuhanOjkController.prototype, "removeParameter", null);
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
], KepatuhanOjkController.prototype, "getNilai", null);
__decorate([
    (0, common_1.Post)(':id/parameters/:parameterId/nilai'),
    (0, swagger_1.ApiOperation)({ summary: 'Add new nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.CreateNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Nilai added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parameter not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, kepatuhan_inherent_dto_1.CreateNilaiDto, Object]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "addNilai", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId/nilai/:nilaiId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'nilaiId', type: Number }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.UpdateNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nilai updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nilai not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('nilaiId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, kepatuhan_inherent_dto_1.UpdateNilaiDto, Object]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "updateNilai", null);
__decorate([
    (0, common_1.Put)(':id/parameters/:parameterId/nilai/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder nilai' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'parameterId', type: Number }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.ReorderNilaiDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nilai reordered successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parameterId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, kepatuhan_inherent_dto_1.ReorderNilaiDto]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "reorderNilai", null);
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
], KepatuhanOjkController.prototype, "copyNilai", null);
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
], KepatuhanOjkController.prototype, "removeNilai", null);
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
], KepatuhanOjkController.prototype, "exportToExcel", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import data from Excel format' }),
    (0, swagger_1.ApiBody)({ type: kepatuhan_inherent_dto_1.ImportExportDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Import successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kepatuhan_inherent_dto_1.ImportExportDto, Object]),
    __metadata("design:returntype", Promise)
], KepatuhanOjkController.prototype, "importFromExcel", null);
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
], KepatuhanOjkController.prototype, "getReferences", null);
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
], KepatuhanOjkController.prototype, "checkExists", null);
exports.KepatuhanOjkController = KepatuhanOjkController = __decorate([
    (0, swagger_1.ApiTags)('Kepatuhan OJK'),
    (0, common_1.Controller)('kepatuhan-ojk'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    })),
    __metadata("design:paramtypes", [kepatuhan_ojk_service_1.KepatuhanOjkService])
], KepatuhanOjkController);
//# sourceMappingURL=kepatuhan-ojk.controller.js.map