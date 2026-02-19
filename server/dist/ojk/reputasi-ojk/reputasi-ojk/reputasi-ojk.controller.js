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
exports.ReputasiOjkController = void 0;
const common_1 = require("@nestjs/common");
const reputasi_ojk_service_1 = require("./reputasi-ojk.service");
const create_reputasi_ojk_dto_1 = require("./dto/create-reputasi-ojk.dto");
const update_reputasi_ojk_dto_1 = require("./dto/update-reputasi-ojk.dto");
let ReputasiOjkController = class ReputasiOjkController {
    reputasiOjkService;
    constructor(reputasiOjkService) {
        this.reputasiOjkService = reputasiOjkService;
    }
    create(createReputasiOjkDto) {
        return this.reputasiOjkService.create(createReputasiOjkDto);
    }
    findAll() {
        return this.reputasiOjkService.findAll();
    }
    findOne(id) {
        return this.reputasiOjkService.findOne(+id);
    }
    update(id, updateReputasiOjkDto) {
        return this.reputasiOjkService.update(+id, updateReputasiOjkDto);
    }
    remove(id) {
        return this.reputasiOjkService.remove(+id);
    }
};
exports.ReputasiOjkController = ReputasiOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reputasi_ojk_dto_1.CreateReputasiOjkDto]),
    __metadata("design:returntype", void 0)
], ReputasiOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReputasiOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReputasiOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reputasi_ojk_dto_1.UpdateReputasiOjkDto]),
    __metadata("design:returntype", void 0)
], ReputasiOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReputasiOjkController.prototype, "remove", null);
exports.ReputasiOjkController = ReputasiOjkController = __decorate([
    (0, common_1.Controller)('reputasi-ojk'),
    __metadata("design:paramtypes", [reputasi_ojk_service_1.ReputasiOjkService])
], ReputasiOjkController);
//# sourceMappingURL=reputasi-ojk.controller.js.map