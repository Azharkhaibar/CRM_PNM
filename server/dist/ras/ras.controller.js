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
exports.RasController = void 0;
const common_1 = require("@nestjs/common");
const ras_service_1 = require("./ras.service");
const create_ra_dto_1 = require("./dto/create-ra.dto");
const update_ra_dto_1 = require("./dto/update-ra.dto");
const update_monthly_values_dto_1 = require("./dto/update-monthly-values.dto");
const filter_ras_dto_1 = require("./dto/filter-ras.dto");
const import_ras_dto_1 = require("./dto/import-ras.dto");
let RasController = class RasController {
    rasService;
    constructor(rasService) {
        this.rasService = rasService;
    }
    create(createRasDto) {
        return this.rasService.create(createRasDto);
    }
    findAll(filterDto) {
        return this.rasService.findAll(filterDto);
    }
    getCategories() {
        return this.rasService.getRiskCategories();
    }
    getYearlyData(year) {
        return this.rasService.findByYearAndMonth(year);
    }
    getYearlyStats(year) {
        return this.rasService.getYearlyStats(year);
    }
    getMonthlyData(year, month) {
        const monthNumber = month ? parseInt(month, 10) : undefined;
        return this.rasService.findByYearAndMonth(year, monthNumber);
    }
    getFollowUpItems(year, month) {
        return this.rasService.getItemsNeedingFollowUp(year, month);
    }
    exportMonthlyData(year, months) {
        const monthArray = months.split(',').map((m) => parseInt(m, 10));
        return this.rasService.exportMonthlyData(year, monthArray);
    }
    findOne(id) {
        return this.rasService.findOne(id);
    }
    update(id, updateRasDto) {
        return this.rasService.update(id, updateRasDto);
    }
    updateMonthlyValues(id, updateMonthlyValuesDto) {
        return this.rasService.updateMonthlyValues(id, updateMonthlyValuesDto);
    }
    updateTindakLanjut(id, tindakLanjut) {
        return this.rasService.updateTindakLanjut(id, tindakLanjut);
    }
    remove(id) {
        return this.rasService.remove(id);
    }
    importData(importRasDto) {
        return this.rasService.importData(importRasDto);
    }
};
exports.RasController = RasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ra_dto_1.CreateRasDto]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_ras_dto_1.FilterRasDto]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RasController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('yearly/:year'),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "getYearlyData", null);
__decorate([
    (0, common_1.Get)('yearly-stats/:year'),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "getYearlyStats", null);
__decorate([
    (0, common_1.Get)('monthly/:year'),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "getMonthlyData", null);
__decorate([
    (0, common_1.Get)('follow-up/:year/:month'),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('month', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "getFollowUpItems", null);
__decorate([
    (0, common_1.Get)('export/monthly/:year'),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('months')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "exportMonthlyData", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_ra_dto_1.UpdateRasDto]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/monthly-values'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_monthly_values_dto_1.UpdateMonthlyValuesDto]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "updateMonthlyValues", null);
__decorate([
    (0, common_1.Patch)(':id/tindak-lanjut'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "updateTindakLanjut", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_ras_dto_1.ImportRasDto]),
    __metadata("design:returntype", void 0)
], RasController.prototype, "importData", null);
exports.RasController = RasController = __decorate([
    (0, common_1.Controller)('ras'),
    __metadata("design:paramtypes", [ras_service_1.RasService])
], RasController);
//# sourceMappingURL=ras.controller.js.map