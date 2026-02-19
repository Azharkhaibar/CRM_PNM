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
exports.HukumKpmrOjkController = void 0;
const common_1 = require("@nestjs/common");
const hukum_kpmr_ojk_service_1 = require("./hukum-kpmr-ojk.service");
const create_hukum_kpmr_ojk_dto_1 = require("./dto/create-hukum-kpmr-ojk.dto");
const update_hukum_kpmr_ojk_dto_1 = require("./dto/update-hukum-kpmr-ojk.dto");
let HukumKpmrOjkController = class HukumKpmrOjkController {
    hukumKpmrOjkService;
    constructor(hukumKpmrOjkService) {
        this.hukumKpmrOjkService = hukumKpmrOjkService;
    }
    create(createHukumKpmrOjkDto) {
        return this.hukumKpmrOjkService.create(createHukumKpmrOjkDto);
    }
    findAll() {
        return this.hukumKpmrOjkService.findAll();
    }
    findOne(id) {
        return this.hukumKpmrOjkService.findOne(+id);
    }
    update(id, updateHukumKpmrOjkDto) {
        return this.hukumKpmrOjkService.update(+id, updateHukumKpmrOjkDto);
    }
    remove(id) {
        return this.hukumKpmrOjkService.remove(+id);
    }
};
exports.HukumKpmrOjkController = HukumKpmrOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hukum_kpmr_ojk_dto_1.CreateHukumKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], HukumKpmrOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HukumKpmrOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HukumKpmrOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hukum_kpmr_ojk_dto_1.UpdateHukumKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], HukumKpmrOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HukumKpmrOjkController.prototype, "remove", null);
exports.HukumKpmrOjkController = HukumKpmrOjkController = __decorate([
    (0, common_1.Controller)('hukum-kpmr-ojk'),
    __metadata("design:paramtypes", [hukum_kpmr_ojk_service_1.HukumKpmrOjkService])
], HukumKpmrOjkController);
//# sourceMappingURL=hukum-kpmr-ojk.controller.js.map