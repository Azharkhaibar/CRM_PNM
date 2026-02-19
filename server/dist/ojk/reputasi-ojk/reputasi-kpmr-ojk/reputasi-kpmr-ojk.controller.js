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
exports.ReputasiKpmrOjkController = void 0;
const common_1 = require("@nestjs/common");
const reputasi_kpmr_ojk_service_1 = require("./reputasi-kpmr-ojk.service");
const create_reputasi_kpmr_ojk_dto_1 = require("./dto/create-reputasi-kpmr-ojk.dto");
const update_reputasi_kpmr_ojk_dto_1 = require("./dto/update-reputasi-kpmr-ojk.dto");
let ReputasiKpmrOjkController = class ReputasiKpmrOjkController {
    reputasiKpmrOjkService;
    constructor(reputasiKpmrOjkService) {
        this.reputasiKpmrOjkService = reputasiKpmrOjkService;
    }
    create(createReputasiKpmrOjkDto) {
        return this.reputasiKpmrOjkService.create(createReputasiKpmrOjkDto);
    }
    findAll() {
        return this.reputasiKpmrOjkService.findAll();
    }
    findOne(id) {
        return this.reputasiKpmrOjkService.findOne(+id);
    }
    update(id, updateReputasiKpmrOjkDto) {
        return this.reputasiKpmrOjkService.update(+id, updateReputasiKpmrOjkDto);
    }
    remove(id) {
        return this.reputasiKpmrOjkService.remove(+id);
    }
};
exports.ReputasiKpmrOjkController = ReputasiKpmrOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reputasi_kpmr_ojk_dto_1.CreateReputasiKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], ReputasiKpmrOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReputasiKpmrOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReputasiKpmrOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reputasi_kpmr_ojk_dto_1.UpdateReputasiKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], ReputasiKpmrOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReputasiKpmrOjkController.prototype, "remove", null);
exports.ReputasiKpmrOjkController = ReputasiKpmrOjkController = __decorate([
    (0, common_1.Controller)('reputasi-kpmr-ojk'),
    __metadata("design:paramtypes", [reputasi_kpmr_ojk_service_1.ReputasiKpmrOjkService])
], ReputasiKpmrOjkController);
//# sourceMappingURL=reputasi-kpmr-ojk.controller.js.map