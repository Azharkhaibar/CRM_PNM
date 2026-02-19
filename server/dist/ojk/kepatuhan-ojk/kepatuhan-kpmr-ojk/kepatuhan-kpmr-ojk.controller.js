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
exports.KepatuhanKpmrOjkController = void 0;
const common_1 = require("@nestjs/common");
const kepatuhan_kpmr_ojk_service_1 = require("./kepatuhan-kpmr-ojk.service");
const create_kepatuhan_kpmr_ojk_dto_1 = require("./dto/create-kepatuhan-kpmr-ojk.dto");
const update_kepatuhan_kpmr_ojk_dto_1 = require("./dto/update-kepatuhan-kpmr-ojk.dto");
let KepatuhanKpmrOjkController = class KepatuhanKpmrOjkController {
    kepatuhanKpmrOjkService;
    constructor(kepatuhanKpmrOjkService) {
        this.kepatuhanKpmrOjkService = kepatuhanKpmrOjkService;
    }
    create(createKepatuhanKpmrOjkDto) {
        return this.kepatuhanKpmrOjkService.create(createKepatuhanKpmrOjkDto);
    }
    findAll() {
        return this.kepatuhanKpmrOjkService.findAll();
    }
    findOne(id) {
        return this.kepatuhanKpmrOjkService.findOne(+id);
    }
    update(id, updateKepatuhanKpmrOjkDto) {
        return this.kepatuhanKpmrOjkService.update(+id, updateKepatuhanKpmrOjkDto);
    }
    remove(id) {
        return this.kepatuhanKpmrOjkService.remove(+id);
    }
};
exports.KepatuhanKpmrOjkController = KepatuhanKpmrOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kepatuhan_kpmr_ojk_dto_1.CreateKepatuhanKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], KepatuhanKpmrOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KepatuhanKpmrOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KepatuhanKpmrOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kepatuhan_kpmr_ojk_dto_1.UpdateKepatuhanKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], KepatuhanKpmrOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KepatuhanKpmrOjkController.prototype, "remove", null);
exports.KepatuhanKpmrOjkController = KepatuhanKpmrOjkController = __decorate([
    (0, common_1.Controller)('kepatuhan-kpmr-ojk'),
    __metadata("design:paramtypes", [kepatuhan_kpmr_ojk_service_1.KepatuhanKpmrOjkService])
], KepatuhanKpmrOjkController);
//# sourceMappingURL=kepatuhan-kpmr-ojk.controller.js.map