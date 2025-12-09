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
exports.StratejikController = void 0;
const common_1 = require("@nestjs/common");
const stratejik_service_1 = require("./stratejik.service");
const create_stratejik_dto_1 = require("./dto/create-stratejik.dto");
const update_stratejik_dto_1 = require("./dto/update-stratejik.dto");
const create_stratejik_section_dto_1 = require("./dto/create-stratejik-section.dto");
const update_stratejik_section_dto_1 = require("./dto/update-stratejik-section.dto");
const stratejik_entity_1 = require("./entities/stratejik.entity");
let StratejikController = class StratejikController {
    stratejikService;
    constructor(stratejikService) {
        this.stratejikService = stratejikService;
    }
    create(createStratejikDto) {
        return this.stratejikService.create(createStratejikDto);
    }
    findAll(year, quarter) {
        if (year && quarter) {
            return this.stratejikService.findByPeriod(year, quarter);
        }
        if (year) {
            return this.stratejikService.findByYear(year);
        }
        return this.stratejikService.findAll();
    }
    getSummary(year, quarter) {
        if (!Object.values(stratejik_entity_1.Quarter).includes(quarter)) {
            throw new common_1.BadRequestException('Quarter tidak valid. Gunakan Q1, Q2, Q3, atau Q4');
        }
        return this.stratejikService.getSummary(year, quarter);
    }
    findBySection(sectionId, year, quarter) {
        return this.stratejikService.findBySection(sectionId, year, quarter);
    }
    findOne(id) {
        return this.stratejikService.findOne(id);
    }
    update(id, updateStratejikDto) {
        return this.stratejikService.update(id, updateStratejikDto);
    }
    remove(id) {
        return this.stratejikService.remove(id);
    }
    bulkCreate(createStratejikDtos) {
        return this.stratejikService.bulkCreate(createStratejikDtos);
    }
    createSection(createSectionDto) {
        return this.stratejikService.createSection(createSectionDto);
    }
    findAllSections() {
        return this.stratejikService.findAllSection();
    }
    findSectionById(id) {
        return this.stratejikService.findSectionById(id);
    }
    updateSection(id, updateSectionDto) {
        return this.stratejikService.updateSection(id, updateSectionDto);
    }
    deleteSection(id) {
        return this.stratejikService.deleteSection(id);
    }
};
exports.StratejikController = StratejikController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stratejik_dto_1.CreateStratejikDto]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('year', new common_1.ParseIntPipe({ errorHttpStatusCode: 400 }))),
    __param(1, (0, common_1.Query)('quarter', new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('section/:sectionId'),
    __param(0, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "findBySection", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_stratejik_dto_1.UpdateStratejikDto]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Post)('sections'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stratejik_section_dto_1.CreateStratejikSectionDto]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "findAllSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "findSectionById", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_stratejik_section_dto_1.UpdateStratejikSectionDto]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StratejikController.prototype, "deleteSection", null);
exports.StratejikController = StratejikController = __decorate([
    (0, common_1.Controller)('stratejik'),
    __metadata("design:paramtypes", [stratejik_service_1.StratejikService])
], StratejikController);
//# sourceMappingURL=stratejik.controller.js.map