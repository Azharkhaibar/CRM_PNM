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
exports.HukumOjkController = void 0;
const common_1 = require("@nestjs/common");
const hukum_ojk_service_1 = require("./hukum-ojk.service");
const create_hukum_ojk_dto_1 = require("./dto/create-hukum-ojk.dto");
const update_hukum_ojk_dto_1 = require("./dto/update-hukum-ojk.dto");
let HukumOjkController = class HukumOjkController {
    hukumOjkService;
    constructor(hukumOjkService) {
        this.hukumOjkService = hukumOjkService;
    }
    create(createHukumOjkDto) {
        return this.hukumOjkService.create(createHukumOjkDto);
    }
    findAll() {
        return this.hukumOjkService.findAll();
    }
    findOne(id) {
        return this.hukumOjkService.findOne(+id);
    }
    update(id, updateHukumOjkDto) {
        return this.hukumOjkService.update(+id, updateHukumOjkDto);
    }
    remove(id) {
        return this.hukumOjkService.remove(+id);
    }
};
exports.HukumOjkController = HukumOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hukum_ojk_dto_1.CreateHukumOjkDto]),
    __metadata("design:returntype", void 0)
], HukumOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HukumOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HukumOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hukum_ojk_dto_1.UpdateHukumOjkDto]),
    __metadata("design:returntype", void 0)
], HukumOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HukumOjkController.prototype, "remove", null);
exports.HukumOjkController = HukumOjkController = __decorate([
    (0, common_1.Controller)('hukum-ojk'),
    __metadata("design:paramtypes", [hukum_ojk_service_1.HukumOjkService])
], HukumOjkController);
//# sourceMappingURL=hukum-ojk.controller.js.map