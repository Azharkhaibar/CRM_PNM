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
exports.KpmrHukumController = void 0;
const common_1 = require("@nestjs/common");
const kpmr_hukum_service_1 = require("./kpmr-hukum.service");
const create_kpmr_hukum_dto_1 = require("./dto/create-kpmr-hukum.dto");
const update_kpmr_hukum_dto_1 = require("./dto/update-kpmr-hukum.dto");
let KpmrHukumController = class KpmrHukumController {
    kpmrHukumService;
    constructor(kpmrHukumService) {
        this.kpmrHukumService = kpmrHukumService;
    }
    create(createKpmrHukumDto) {
        return this.kpmrHukumService.create(createKpmrHukumDto);
    }
    findAll() {
        return this.kpmrHukumService.findAll();
    }
    findOne(id) {
        return this.kpmrHukumService.findOne(+id);
    }
    update(id, updateKpmrHukumDto) {
        return this.kpmrHukumService.update(+id, updateKpmrHukumDto);
    }
    remove(id) {
        return this.kpmrHukumService.remove(+id);
    }
};
exports.KpmrHukumController = KpmrHukumController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kpmr_hukum_dto_1.CreateKpmrHukumDto]),
    __metadata("design:returntype", void 0)
], KpmrHukumController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KpmrHukumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KpmrHukumController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kpmr_hukum_dto_1.UpdateKpmrHukumDto]),
    __metadata("design:returntype", void 0)
], KpmrHukumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KpmrHukumController.prototype, "remove", null);
exports.KpmrHukumController = KpmrHukumController = __decorate([
    (0, common_1.Controller)('kpmr-hukum'),
    __metadata("design:paramtypes", [kpmr_hukum_service_1.KpmrHukumService])
], KpmrHukumController);
//# sourceMappingURL=kpmr-hukum.controller.js.map