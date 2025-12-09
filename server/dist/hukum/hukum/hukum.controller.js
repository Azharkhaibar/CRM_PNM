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
exports.HukumController = void 0;
const common_1 = require("@nestjs/common");
const hukum_service_1 = require("./hukum.service");
const create_hukum_dto_1 = require("./dto/create-hukum.dto");
const update_hukum_dto_1 = require("./dto/update-hukum.dto");
const create_hukum_section_dto_1 = require("./dto/create-hukum-section.dto");
const update_hukum_section_dto_1 = require("./dto/update-hukum-section.dto");
const hukum_entity_1 = require("./entities/hukum.entity");
let HukumController = class HukumController {
    hukumService;
    constructor(hukumService) {
        this.hukumService = hukumService;
    }
    create(createHukumDto) {
        return this.hukumService.create(createHukumDto);
    }
    findAll(year, quarter) {
        if (year && quarter) {
            return this.hukumService.findByPeriod(year, quarter);
        }
        if (year) {
            return this.hukumService.findByYear(year);
        }
        return this.hukumService.findAll();
    }
    getStructuredData(year, quarter) {
        return this.hukumService.getStructuredData(year, quarter);
    }
    getSummary(year, quarter) {
        return this.hukumService.getSummary(year, quarter);
    }
    findBySection(sectionId, year, quarter) {
        return this.hukumService.findBySection(sectionId, year, quarter);
    }
    findOne(id) {
        return this.hukumService.findOne(id);
    }
    update(id, updateHukumDto) {
        return this.hukumService.update(id, updateHukumDto);
    }
    remove(id) {
        return this.hukumService.remove(id);
    }
    deletePeriod(year, quarter) {
        return this.hukumService.deleteByPeriod(year, quarter);
    }
    bulkCreate(createHukumDtos) {
        return this.hukumService.bulkCreate(createHukumDtos);
    }
    createSection(createSectionDto) {
        return this.hukumService.createSection(createSectionDto);
    }
    findAllSections() {
        return this.hukumService.findAllSection();
    }
    findSectionById(id) {
        return this.hukumService.findSectionById(id);
    }
    updateSection(id, updateSectionDto) {
        return this.hukumService.updateSection(id, updateSectionDto);
    }
    deleteSection(id) {
        return this.hukumService.deleteSection(id);
    }
};
exports.HukumController = HukumController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hukum_dto_1.CreateHukumDto]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('structured'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "getStructuredData", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('section/:sectionId'),
    __param(0, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "findBySection", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hukum_dto_1.UpdateHukumDto]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('period'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "deletePeriod", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Post)('sections'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hukum_section_dto_1.CreateHukumSectionDto]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "findAllSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "findSectionById", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hukum_section_dto_1.UpdateHukumSectionDto]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HukumController.prototype, "deleteSection", null);
exports.HukumController = HukumController = __decorate([
    (0, common_1.Controller)('hukum'),
    __metadata("design:paramtypes", [hukum_service_1.HukumService])
], HukumController);
//# sourceMappingURL=hukum.controller.js.map