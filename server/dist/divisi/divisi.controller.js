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
exports.DivisiController = void 0;
const common_1 = require("@nestjs/common");
const divisi_service_1 = require("./divisi.service");
const create_divisi_dto_1 = require("./dto/create-divisi.dto");
const update_divisi_dto_1 = require("./dto/update-divisi.dto");
let DivisiController = class DivisiController {
    divisiService;
    constructor(divisiService) {
        this.divisiService = divisiService;
    }
    create(createDivisiDto) {
        return this.divisiService.create(createDivisiDto);
    }
    findAll() {
        return this.divisiService.findAll();
    }
    findOne(id) {
        return this.divisiService.findOne(+id);
    }
    update(id, updateDivisiDto) {
        return this.divisiService.update(+id, updateDivisiDto);
    }
    remove(id) {
        return this.divisiService.remove(+id);
    }
};
exports.DivisiController = DivisiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_divisi_dto_1.CreateDivisiDto]),
    __metadata("design:returntype", void 0)
], DivisiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DivisiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DivisiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_divisi_dto_1.UpdateDivisiDto]),
    __metadata("design:returntype", void 0)
], DivisiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DivisiController.prototype, "remove", null);
exports.DivisiController = DivisiController = __decorate([
    (0, common_1.Controller)('divisi'),
    __metadata("design:paramtypes", [divisi_service_1.DivisiService])
], DivisiController);
//# sourceMappingURL=divisi.controller.js.map