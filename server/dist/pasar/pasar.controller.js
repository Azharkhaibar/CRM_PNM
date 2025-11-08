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
const create_pasar_dto_1 = require("./dto/create-pasar.dto");
const update_pasar_dto_1 = require("./dto/update-pasar.dto");
const class_transformer_1 = require("class-transformer");
const get_pasar_dto_1 = require("./dto/get-pasar.dto");
let PasarController = class PasarController {
    pasarService;
    constructor(pasarService) {
        this.pasarService = pasarService;
    }
    async create(dto) {
        const data = await this.pasarService.create(dto);
        return (0, class_transformer_1.plainToInstance)(get_pasar_dto_1.GetPasarDto, data, {
            excludeExtraneousValues: true,
        });
    }
    async findAll() {
        const data = await this.pasarService.findAll();
        return (0, class_transformer_1.plainToInstance)(get_pasar_dto_1.GetPasarDto, data, {
            excludeExtraneousValues: true,
        });
    }
    async getSummary() {
        return this.pasarService.getPasarSummary();
    }
    async findOne(id) {
        const data = await this.pasarService.findOne(+id);
        return (0, class_transformer_1.plainToInstance)(get_pasar_dto_1.GetPasarDto, data, {
            excludeExtraneousValues: true,
        });
    }
    async update(id, dto) {
        const data = await this.pasarService.update(+id, dto);
        return (0, class_transformer_1.plainToInstance)(get_pasar_dto_1.GetPasarDto, data, {
            excludeExtraneousValues: true,
        });
    }
    async remove(id) {
        return this.pasarService.remove(+id);
    }
};
exports.PasarController = PasarController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pasar_dto_1.CreatePasarDto]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pasar_dto_1.UpdatePasarDto]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PasarController.prototype, "remove", null);
exports.PasarController = PasarController = __decorate([
    (0, common_1.Controller)('pasar'),
    __metadata("design:paramtypes", [pasar_service_1.PasarService])
], PasarController);
//# sourceMappingURL=pasar.controller.js.map