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
const reputasi_service_1 = require("./reputasi.service");
const create_reputasi_dto_1 = require("./dto/create-reputasi.dto");
const update_reputasi_dto_1 = require("./dto/update-reputasi.dto");
const create_reputasi_section_dto_1 = require("./dto/create-reputasi-section.dto");
const update_reputasi_section_dto_1 = require("./dto/update-reputasi-section.dto");
const reputasi_entity_1 = require("./entities/reputasi.entity");
let ReputasiController = class ReputasiController {
    reputasiService;
    constructor(reputasiService) {
        this.reputasiService = reputasiService;
    }
    create(createReputasiDto) {
        return this.reputasiService.create(createReputasiDto);
    }
    findAll(year, quarter) {
        if (year && quarter) {
            return this.reputasiService.findByPeriod(year, quarter);
        }
        if (year) {
            return this.reputasiService.findByYear(year);
        }
        return this.reputasiService.findAll();
    }
    getSummary(year, quarter) {
        return this.reputasiService.getSummary(year, quarter);
    }
    getReputasiScore(year, quarter) {
        return this.reputasiService.getReputasiScore(year, quarter);
    }
    getRiskDistribution(year, quarter) {
        return this.reputasiService.getRiskLevelDistribution(year, quarter);
    }
    findBySection(sectionId, year, quarter) {
        return this.reputasiService.findBySection(sectionId, year, quarter);
    }
    findOne(id) {
        return this.reputasiService.findOne(id);
    }
    update(id, updateReputasiDto) {
        return this.reputasiService.update(id, updateReputasiDto);
    }
    remove(id) {
        return this.reputasiService.remove(id);
    }
    deletePeriod(year, quarter) {
        return this.reputasiService.deleteByPeriod(year, quarter);
    }
    bulkCreate(createReputasiDtos) {
        return this.reputasiService.bulkCreate(createReputasiDtos);
    }
    createSection(createSectionDto) {
        return this.reputasiService.createSection(createSectionDto);
    }
    findAllSections() {
        return this.reputasiService.findAllSection();
    }
    findSectionById(id) {
        return this.reputasiService.findSectionById(id);
    }
    updateSection(id, updateSectionDto) {
        return this.reputasiService.updateSection(id, updateSectionDto);
    }
    deleteSection(id) {
        return this.reputasiService.deleteSection(id);
    }
};
exports.ReputasiController = ReputasiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reputasi_dto_1.CreateReputasiDto]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('score'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "getReputasiScore", null);
__decorate([
    (0, common_1.Get)('risk-distribution'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "getRiskDistribution", null);
__decorate([
    (0, common_1.Get)('section/:sectionId'),
    __param(0, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "findBySection", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_reputasi_dto_1.UpdateReputasiDto]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('period'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "deletePeriod", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Post)('sections'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reputasi_section_dto_1.CreateReputasiSectionDto]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "findAllSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "findSectionById", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_reputasi_section_dto_1.UpdateReputasiSectionDto]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReputasiController.prototype, "deleteSection", null);
exports.ReputasiController = ReputasiController = __decorate([
    (0, common_1.Controller)('reputasi'),
    __metadata("design:paramtypes", [reputasi_service_1.ReputasiService])
], ReputasiController);
//# sourceMappingURL=reputasi.controller.js.map