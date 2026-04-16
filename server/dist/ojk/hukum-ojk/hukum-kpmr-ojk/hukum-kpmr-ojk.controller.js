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
exports.KpmrHukumController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hukum_kpmr_ojk_service_1 = require("./hukum-kpmr-ojk.service");
const hukum_kpmr_dto_1 = require("./dto/hukum-kpmr.dto");
let KpmrHukumController = class KpmrHukumController {
    kpmrService;
    constructor(kpmrService) {
        this.kpmrService = kpmrService;
    }
    async create(createDto, req) {
        const userId = req.user?.id || 'system';
        return this.kpmrService.createKpmr(createDto, userId);
    }
    async findAll(year, quarter, isActive, isLocked, search, withRelations) {
        const filter = {};
        if (year && year.trim() !== '') {
            const parsedYear = parseInt(year, 10);
            if (!isNaN(parsedYear)) {
                filter.year = parsedYear;
            }
        }
        if (quarter && quarter.trim() !== '') {
            const parsedQuarter = parseInt(quarter, 10);
            if (!isNaN(parsedQuarter) && parsedQuarter >= 1 && parsedQuarter <= 4) {
                filter.quarter = parsedQuarter;
            }
        }
        if (isActive && isActive.trim() !== '') {
            filter.isActive =
                isActive === 'true' || isActive === '1' || isActive === 'on';
        }
        if (isLocked && isLocked.trim() !== '') {
            filter.isLocked =
                isLocked === 'true' || isLocked === '1' || isLocked === 'on';
        }
        if (withRelations && withRelations.trim() !== '') {
            filter.withRelations =
                withRelations === 'true' ||
                    withRelations === '1' ||
                    withRelations === 'on';
        }
        if (search && search.trim() !== '') {
            filter.search = search;
        }
        return this.kpmrService.findAll(filter);
    }
    async getActive() {
        return this.kpmrService.getActiveKpmr();
    }
    async findByYearQuarter(year, quarter) {
        const yearNum = parseInt(year, 10);
        const quarterNum = parseInt(quarter, 10);
        if (isNaN(yearNum) || isNaN(quarterNum)) {
            throw new common_1.BadRequestException('Year dan quarter harus berupa angka');
        }
        if (quarterNum < 1 || quarterNum > 4) {
            throw new common_1.BadRequestException('Quarter harus antara 1 dan 4');
        }
        return this.kpmrService.findByYearQuarter(yearNum, quarterNum);
    }
    async findOne(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.findOne(idNum);
    }
    async update(id, updateDto) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.updateKpmr(idNum, updateDto);
    }
    async remove(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        await this.kpmrService.deleteKpmr(idNum);
    }
    async lockKpmr(id, lockedBy) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        if (!lockedBy) {
            throw new common_1.BadRequestException('lockedBy harus diisi');
        }
        return this.kpmrService.lockKpmr(idNum, lockedBy);
    }
    async unlockKpmr(id, unlockedBy) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.unlockKpmr(idNum, unlockedBy);
    }
    async duplicate(id, year, quarter, createdBy, copyScores) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        if (!year || !quarter) {
            throw new common_1.BadRequestException('Year dan quarter harus diisi');
        }
        return this.kpmrService.duplicateKpmr(idNum, year, quarter, createdBy, copyScores || false);
    }
    async getSummary(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.getSummary(idNum);
    }
    async updateSummary(id, updateDto) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.updateSummary(idNum, updateDto);
    }
    async createAspek(kpmrId, createDto) {
        const kpmrIdNum = parseInt(kpmrId, 10);
        if (isNaN(kpmrIdNum)) {
            throw new common_1.BadRequestException('kpmrId harus berupa angka');
        }
        console.log(`📝 Creating aspek for KPMR ${kpmrIdNum}:`, {
            judul: createDto.judul,
            bobot: createDto.bobot,
            nomor: createDto.nomor,
        });
        return this.kpmrService.createAspek(kpmrIdNum, createDto);
    }
    async updateAspek(id, updateDto) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.updateAspek(idNum, updateDto);
    }
    async removeAspek(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        await this.kpmrService.deleteAspek(idNum);
    }
    async reorderAspek(kpmrId, reorderDto) {
        const kpmrIdNum = parseInt(kpmrId, 10);
        if (isNaN(kpmrIdNum)) {
            throw new common_1.BadRequestException('kpmrId harus berupa angka');
        }
        await this.kpmrService.reorderAspek(kpmrIdNum, reorderDto);
    }
    async createPertanyaan(aspekId, createDto) {
        const aspekIdNum = parseInt(aspekId, 10);
        if (isNaN(aspekIdNum)) {
            throw new common_1.BadRequestException('aspekId harus berupa angka');
        }
        return this.kpmrService.createPertanyaan(aspekIdNum, createDto);
    }
    async updatePertanyaan(id, updateDto) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.updatePertanyaan(idNum, updateDto);
    }
    async findAllAspek(kpmrId) {
        const kpmrIdNum = parseInt(kpmrId, 10);
        if (isNaN(kpmrIdNum)) {
            throw new common_1.BadRequestException('kpmrId harus berupa angka');
        }
        return this.kpmrService.findAllAspek(kpmrIdNum);
    }
    async findOneAspek(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.findOneAspek(idNum);
    }
    async updateSkor(id, updateSkorDto) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.updateSkor(idNum, updateSkorDto);
    }
    async bulkUpdateSkor(bulkDto) {
        if (!bulkDto.updates || bulkDto.updates.length === 0) {
            throw new common_1.BadRequestException('Updates tidak boleh kosong');
        }
        await this.kpmrService.bulkUpdateSkor(bulkDto);
    }
    async removePertanyaan(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        await this.kpmrService.deletePertanyaan(idNum);
    }
    async reorderPertanyaan(aspekId, reorderDto) {
        const aspekIdNum = parseInt(aspekId, 10);
        if (isNaN(aspekIdNum)) {
            throw new common_1.BadRequestException('aspekId harus berupa angka');
        }
        await this.kpmrService.reorderPertanyaan(aspekIdNum, reorderDto);
    }
    async validateKpmr(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.validateKpmrData(idNum);
    }
    async getStatistics(id) {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            throw new common_1.BadRequestException('ID harus berupa angka');
        }
        return this.kpmrService.getKpmrStatistics(idNum);
    }
};
exports.KpmrHukumController = KpmrHukumController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buat KPMR baru' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hukum_kpmr_dto_1.CreateKpmrHukumDto, Object]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get semua KPMR dengan filter' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __param(2, (0, common_1.Query)('isActive')),
    __param(3, (0, common_1.Query)('isLocked')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('withRelations')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPMR aktif saat ini' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)(':year/:quarter'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPMR berdasarkan tahun dan quarter' }),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "findByYearQuarter", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPMR by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.UpdateKpmrHukumDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Hapus KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/lock'),
    (0, swagger_1.ApiOperation)({ summary: 'Kunci KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('lockedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "lockKpmr", null);
__decorate([
    (0, common_1.Post)(':id/unlock'),
    (0, swagger_1.ApiOperation)({ summary: 'Buka kunci KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('unlockedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "unlockKpmr", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplikasi KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('year')),
    __param(2, (0, common_1.Body)('quarter')),
    __param(3, (0, common_1.Body)('createdBy')),
    __param(4, (0, common_1.Body)('copyScores')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, Boolean]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Patch)(':id/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Update summary KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.UpdateSummaryDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "updateSummary", null);
__decorate([
    (0, common_1.Post)(':kpmrId/aspek'),
    (0, swagger_1.ApiOperation)({ summary: 'Tambah aspek baru' }),
    __param(0, (0, common_1.Param)('kpmrId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.CreateKpmrAspekHukumDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "createAspek", null);
__decorate([
    (0, common_1.Patch)('aspek/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update aspek' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.UpdateKpmrAspekHukumDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "updateAspek", null);
__decorate([
    (0, common_1.Delete)('aspek/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Hapus aspek' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "removeAspek", null);
__decorate([
    (0, common_1.Post)(':kpmrId/aspek/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder aspek' }),
    __param(0, (0, common_1.Param)('kpmrId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.ReorderAspekDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "reorderAspek", null);
__decorate([
    (0, common_1.Post)('aspek/:aspekId/pertanyaan'),
    (0, swagger_1.ApiOperation)({ summary: 'Tambah pertanyaan baru' }),
    __param(0, (0, common_1.Param)('aspekId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.CreateKpmrPertanyaanHukumDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "createPertanyaan", null);
__decorate([
    (0, common_1.Patch)('pertanyaan/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pertanyaan' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.UpdateKpmrPertanyaanHukumDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "updatePertanyaan", null);
__decorate([
    (0, common_1.Get)(':kpmrId/aspek'),
    (0, swagger_1.ApiOperation)({ summary: 'Get semua aspek untuk KPMR tertentu' }),
    __param(0, (0, common_1.Param)('kpmrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "findAllAspek", null);
__decorate([
    (0, common_1.Get)('aspek/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detail aspek by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "findOneAspek", null);
__decorate([
    (0, common_1.Patch)('pertanyaan/:id/skor'),
    (0, swagger_1.ApiOperation)({ summary: 'Update skor pertanyaan' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.UpdateSkorDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "updateSkor", null);
__decorate([
    (0, common_1.Post)('pertanyaan/bulk-skor'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update skor' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hukum_kpmr_dto_1.BulkUpdateSkorDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "bulkUpdateSkor", null);
__decorate([
    (0, common_1.Delete)('pertanyaan/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Hapus pertanyaan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "removePertanyaan", null);
__decorate([
    (0, common_1.Post)('aspek/:aspekId/pertanyaan/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder pertanyaan' }),
    __param(0, (0, common_1.Param)('aspekId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hukum_kpmr_dto_1.ReorderPertanyaanDto]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "reorderPertanyaan", null);
__decorate([
    (0, common_1.Get)(':id/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validasi data KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "validateKpmr", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get statistics KPMR' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpmrHukumController.prototype, "getStatistics", null);
exports.KpmrHukumController = KpmrHukumController = __decorate([
    (0, swagger_1.ApiTags)('HukumKpmr'),
    (0, common_1.Controller)('kpmr-hukum'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [hukum_kpmr_ojk_service_1.KpmrHukumService])
], KpmrHukumController);
//# sourceMappingURL=hukum-kpmr-ojk.controller.js.map