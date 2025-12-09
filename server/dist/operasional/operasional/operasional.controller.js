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
exports.OperasionalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const operasional_service_1 = require("./operasional.service");
const create_operasional_dto_1 = require("./dto/create-operasional.dto");
const update_operasional_dto_1 = require("./dto/update-operasional.dto");
const operasional_entity_1 = require("./entities/operasional.entity");
let OperasionalController = class OperasionalController {
    operationalService;
    constructor(operationalService) {
        this.operationalService = operationalService;
    }
    createSection(createSectionDto) {
        return this.operationalService.createSection(createSectionDto);
    }
    updateSection(id, updateSectionDto) {
        return this.operationalService.updateSection(+id, updateSectionDto);
    }
    deleteSection(id) {
        return this.operationalService.deleteSection(+id);
    }
    getSectionsByPeriod(year, quarter) {
        return this.operationalService.getSectionsByPeriod(year, quarter);
    }
    getSectionById(id) {
        return this.operationalService.getSectionById(+id);
    }
    createIndikator(createIndikatorDto) {
        return this.operationalService.createIndikator(createIndikatorDto);
    }
    updateIndikator(id, updateIndikatorDto) {
        return this.operationalService.updateIndikator(+id, updateIndikatorDto);
    }
    deleteIndikator(id) {
        return this.operationalService.deleteIndikator(+id);
    }
    getIndikatorById(id) {
        return this.operationalService.getIndikatorById(+id);
    }
    getSummaryByPeriod(year, quarter) {
        return this.operationalService.getSummaryByPeriod(year, quarter);
    }
};
exports.OperasionalController = OperasionalController;
__decorate([
    (0, common_1.Post)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new operational section' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_operasional_dto_1.CreateSectionOperationalDto]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "createSection", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update operational section' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_operasional_dto_1.UpdateSectionOperationalDto]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete operational section' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Get)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operational sections by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: operasional_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "getSectionsByPeriod", null);
__decorate([
    (0, common_1.Get)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operational section by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "getSectionById", null);
__decorate([
    (0, common_1.Post)('indicators'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new operational indicator' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_operasional_dto_1.CreateIndikatorOperationalDto]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "createIndikator", null);
__decorate([
    (0, common_1.Patch)('indicators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update operational indicator' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_operasional_dto_1.UpdateIndikatorOperationalDto]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "updateIndikator", null);
__decorate([
    (0, common_1.Delete)('indicators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete operational indicator' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "deleteIndikator", null);
__decorate([
    (0, common_1.Get)('indicators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operational indicator by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "getIndikatorById", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operational summary by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: true, enum: operasional_entity_1.Quarter }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], OperasionalController.prototype, "getSummaryByPeriod", null);
exports.OperasionalController = OperasionalController = __decorate([
    (0, swagger_1.ApiTags)('operasional'),
    (0, common_1.Controller)('operasional'),
    __metadata("design:paramtypes", [operasional_service_1.OperationalService])
], OperasionalController);
//# sourceMappingURL=operasional.controller.js.map