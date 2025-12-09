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
exports.NewInvestasiController = void 0;
const common_1 = require("@nestjs/common");
const new_investasi_service_1 = require("./new-investasi.service");
const create_new_investasi_dto_1 = require("./dto/create-new-investasi.dto");
const update_new_investasi_dto_1 = require("./dto/update-new-investasi.dto");
const create_investasi_section_dto_1 = require("./dto/create-investasi-section.dto");
const update_new_investasi_dto_2 = require("./dto/update-new-investasi.dto");
const new_investasi_entity_1 = require("./entities/new-investasi.entity");
let NewInvestasiController = class NewInvestasiController {
    investasiService;
    constructor(investasiService) {
        this.investasiService = investasiService;
    }
    async getSections() {
        return await this.investasiService.findAllSections();
    }
    async getSection(id) {
        return await this.investasiService.findSectionById(parseInt(id));
    }
    async createSection(data) {
        return await this.investasiService.createSection(data);
    }
    async updateSection(id, data) {
        return await this.investasiService.updateSection(parseInt(id), data);
    }
    async deleteSection(id) {
        await this.investasiService.deleteSection(parseInt(id));
    }
    async getInvestasiByPeriod(year, quarter) {
        return await this.investasiService.findByPeriod(parseInt(year), quarter);
    }
    async getSummary(year, quarter) {
        return await this.investasiService.getSummary(parseInt(year), quarter);
    }
    async getInvestasi(id) {
        return await this.investasiService.findById(parseInt(id));
    }
    async createInvestasi(data) {
        return await this.investasiService.create(data);
    }
    async updateInvestasi(id, data) {
        return await this.investasiService.update(parseInt(id), data);
    }
    async deleteInvestasi(id) {
        await this.investasiService.delete(parseInt(id));
    }
};
exports.NewInvestasiController = NewInvestasiController;
__decorate([
    (0, common_1.Get)('sections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "getSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "getSection", null);
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investasi_section_dto_1.CreateSectionDto]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "createSection", null);
__decorate([
    (0, common_1.Put)('sections/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_new_investasi_dto_2.UpdateInvestasiSectionDto]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "getInvestasiByPeriod", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "getInvestasi", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_new_investasi_dto_1.CreateInvestasiDto]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "createInvestasi", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_new_investasi_dto_1.UpdateInvestasiDto]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "updateInvestasi", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewInvestasiController.prototype, "deleteInvestasi", null);
exports.NewInvestasiController = NewInvestasiController = __decorate([
    (0, common_1.Controller)('investasi'),
    __metadata("design:paramtypes", [new_investasi_service_1.InvestasiService])
], NewInvestasiController);
//# sourceMappingURL=new-investasi.controller.js.map