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
exports.KepatuhanController = void 0;
const common_1 = require("@nestjs/common");
const kepatuhan_service_1 = require("./kepatuhan.service");
const create_kepatuhan_dto_1 = require("./dto/create-kepatuhan.dto");
const update_kepatuhan_dto_1 = require("./dto/update-kepatuhan.dto");
const create_kepatuhan_section_dto_1 = require("./dto/create-kepatuhan-section.dto");
const update_kepatuhan_section_dto_1 = require("./dto/update-kepatuhan-section.dto");
const kepatuhan_entity_1 = require("./entities/kepatuhan.entity");
let KepatuhanController = class KepatuhanController {
    kepatuhanService;
    constructor(kepatuhanService) {
        this.kepatuhanService = kepatuhanService;
    }
    create(createKepatuhanDto) {
        return this.kepatuhanService.create(createKepatuhanDto);
    }
    findAll(year, quarter) {
        if (year && quarter) {
            return this.kepatuhanService.findByPeriod(year, quarter);
        }
        if (year) {
            return this.kepatuhanService.findByYear(year);
        }
        return this.kepatuhanService.findAll();
    }
    getSummary(year, quarter) {
        return this.kepatuhanService.getSummary(year, quarter);
    }
    findBySection(sectionId, year, quarter) {
        return this.kepatuhanService.findBySection(sectionId, year, quarter);
    }
    findOne(id) {
        return this.kepatuhanService.findOne(id);
    }
    update(id, updateKepatuhanDto) {
        return this.kepatuhanService.update(id, updateKepatuhanDto);
    }
    remove(id) {
        return this.kepatuhanService.remove(id);
    }
    deletePeriod(year, quarter) {
        return this.kepatuhanService.deleteByPeriod(year, quarter);
    }
    bulkCreate(createKepatuhanDtos) {
        return this.kepatuhanService.bulkCreate(createKepatuhanDtos);
    }
    createSection(createSectionDto) {
        return this.kepatuhanService.createSection(createSectionDto);
    }
    findAllSections() {
        return this.kepatuhanService.findAllSection();
    }
    findSectionById(id) {
        return this.kepatuhanService.findSectionById(id);
    }
    updateSection(id, updateSectionDto) {
        return this.kepatuhanService.updateSection(id, updateSectionDto);
    }
    deleteSection(id) {
        return this.kepatuhanService.deleteSection(id);
    }
};
exports.KepatuhanController = KepatuhanController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kepatuhan_dto_1.CreateKepatuhanDto]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('section/:sectionId'),
    __param(0, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "findBySection", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_kepatuhan_dto_1.UpdateKepatuhanDto]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('period'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "deletePeriod", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Post)('sections'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kepatuhan_section_dto_1.CreateKepatuhanSectionDto]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('sections/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "findAllSections", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "findSectionById", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_kepatuhan_section_dto_1.UpdateKepatuhanSectionDto]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], KepatuhanController.prototype, "deleteSection", null);
exports.KepatuhanController = KepatuhanController = __decorate([
    (0, common_1.Controller)('kepatuhan'),
    __metadata("design:paramtypes", [kepatuhan_service_1.KepatuhanService])
], KepatuhanController);
//# sourceMappingURL=kepatuhan.controller.js.map