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
exports.LikuiditasController = void 0;
const common_1 = require("@nestjs/common");
const likuiditas_service_1 = require("./likuiditas.service");
const create_likuidita_dto_1 = require("./dto/create-likuidita.dto");
const update_likuidita_dto_1 = require("./dto/update-likuidita.dto");
let LikuiditasController = class LikuiditasController {
    likuiditasService;
    constructor(likuiditasService) {
        this.likuiditasService = likuiditasService;
    }
    create(createLikuiditaDto) {
        return this.likuiditasService.create(createLikuiditaDto);
    }
    findAll() {
        return this.likuiditasService.findAll();
    }
    findOne(id) {
        return this.likuiditasService.findOne(+id);
    }
    update(id, updateLikuiditaDto) {
        return this.likuiditasService.update(+id, updateLikuiditaDto);
    }
    remove(id) {
        return this.likuiditasService.remove(+id);
    }
};
exports.LikuiditasController = LikuiditasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_likuidita_dto_1.CreateLikuiditasDto]),
    __metadata("design:returntype", void 0)
], LikuiditasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LikuiditasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LikuiditasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_likuidita_dto_1.UpdateLikuiditasDto]),
    __metadata("design:returntype", void 0)
], LikuiditasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LikuiditasController.prototype, "remove", null);
exports.LikuiditasController = LikuiditasController = __decorate([
    (0, common_1.Controller)('likuiditas'),
    __metadata("design:paramtypes", [likuiditas_service_1.LikuiditasService])
], LikuiditasController);
//# sourceMappingURL=likuiditas.controller.js.map