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
exports.PasarController = void 0;
const common_1 = require("@nestjs/common");
const pasar_service_1 = require("./pasar.service");
const create_pasar_section_dto_1 = require("./dto/create-pasar-section.dto");
const create_pasar_indikator_dto_1 = require("./dto/create-pasar-indikator.dto");
const update_pasar_section_dto_1 = require("./dto/update-pasar-section.dto");
const update_pasar_dto_1 = require("./dto/update-pasar.dto");
let PasarController = class PasarController {
    pasarService;
    constructor(pasarService) {
        this.pasarService = pasarService;
    }
    createSection(createSectionDto) {
        return this.pasarService.createSection(createSectionDto);
    }
    findAllSections() {
        return this.pasarService.getSections();
    }
    getSectionsByPeriod(tahun, triwulan) {
        return this.pasarService.getSectionsByPeriod(parseInt(tahun), triwulan);
    }
    getSectionById(id) {
        return this.pasarService.getSectionById(id);
    }
    updateSection(id, updateSectionDto) {
        return this.pasarService.updateSection(id, updateSectionDto);
    }
    async removeSection(id) {
        await this.pasarService.deleteSection(id);
        return { message: `Section ${id} berhasil dihapus` };
    }
    createIndikator(createIndikatorDto) {
        return this.pasarService.createIndikator(createIndikatorDto);
    }
    getIndikators(sectionId) {
        if (sectionId) {
            return this.pasarService.getIndikatorsBySection(parseInt(sectionId));
        }
        return this.pasarService.getAllIndikators();
    }
    getIndikatorById(id) {
        return this.pasarService.getIndikatorById(id);
    }
    updateIndikator(id, updateIndikatorDto) {
        return this.pasarService.updateIndikator(id, updateIndikatorDto);
    }
    async removeIndikator(id) {
        await this.pasarService.deleteIndikator(id);
        return { message: `Indikator ${id} berhasil dihapus` };
    }
    getOverallSummary(tahun, triwulan) {
        return this.pasarService.getOverallSummary(parseInt(tahun), triwulan);
    }
};
exports.PasarController = PasarController;
__decorate([
    (0, common_1.Post)('sections'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pasar_section_dto_1.CreateSectionDto]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "findAllSections", null);
__decorate([
    (0, common_1.Get)('sections/period'),
    __param(0, (0, common_1.Query)('tahun')),
    __param(1, (0, common_1.Query)('triwulan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "getSectionById", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_pasar_section_dto_1.UpdatePasarSectionDto]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "removeSection", null);
__decorate([
    (0, common_1.Post)('indikators'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pasar_indikator_dto_1.CreateIndikatorDto]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Get)('indikators'),
    __param(0, (0, common_1.Query)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "getIndikators", null);
__decorate([
    (0, common_1.Get)('indikators/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "getIndikatorById", null);
__decorate([
    (0, common_1.Patch)('indikators/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_pasar_dto_1.UpdateIndikatorDto]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indikators/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "removeIndikator", null);
__decorate([
    (0, common_1.Get)('dashboard/summary'),
    __param(0, (0, common_1.Query)('tahun')),
    __param(1, (0, common_1.Query)('triwulan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PasarController.prototype, "getOverallSummary", null);
exports.PasarController = PasarController = __decorate([
    (0, common_1.Controller)('pasar'),
    __metadata("design:paramtypes", [pasar_service_1.PasarService])
], PasarController);
//# sourceMappingURL=pasar.controller.js.map