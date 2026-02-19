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
exports.StrategisKpmrOjkController = void 0;
const common_1 = require("@nestjs/common");
const strategis_kpmr_ojk_service_1 = require("./strategis-kpmr-ojk.service");
const create_strategis_kpmr_ojk_dto_1 = require("./dto/create-strategis-kpmr-ojk.dto");
const update_strategis_kpmr_ojk_dto_1 = require("./dto/update-strategis-kpmr-ojk.dto");
let StrategisKpmrOjkController = class StrategisKpmrOjkController {
    strategisKpmrOjkService;
    constructor(strategisKpmrOjkService) {
        this.strategisKpmrOjkService = strategisKpmrOjkService;
    }
    create(createStrategisKpmrOjkDto) {
        return this.strategisKpmrOjkService.create(createStrategisKpmrOjkDto);
    }
    findAll() {
        return this.strategisKpmrOjkService.findAll();
    }
    findOne(id) {
        return this.strategisKpmrOjkService.findOne(+id);
    }
    update(id, updateStrategisKpmrOjkDto) {
        return this.strategisKpmrOjkService.update(+id, updateStrategisKpmrOjkDto);
    }
    remove(id) {
        return this.strategisKpmrOjkService.remove(+id);
    }
};
exports.StrategisKpmrOjkController = StrategisKpmrOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_strategis_kpmr_ojk_dto_1.CreateStrategisKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], StrategisKpmrOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StrategisKpmrOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StrategisKpmrOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_strategis_kpmr_ojk_dto_1.UpdateStrategisKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], StrategisKpmrOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StrategisKpmrOjkController.prototype, "remove", null);
exports.StrategisKpmrOjkController = StrategisKpmrOjkController = __decorate([
    (0, common_1.Controller)('strategis-kpmr-ojk'),
    __metadata("design:paramtypes", [strategis_kpmr_ojk_service_1.StrategisKpmrOjkService])
], StrategisKpmrOjkController);
//# sourceMappingURL=strategis-kpmr-ojk.controller.js.map