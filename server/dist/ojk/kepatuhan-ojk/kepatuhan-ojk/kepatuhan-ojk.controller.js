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
exports.KepatuhanOjkController = void 0;
const common_1 = require("@nestjs/common");
const kepatuhan_ojk_service_1 = require("./kepatuhan-ojk.service");
const create_kepatuhan_ojk_dto_1 = require("./dto/create-kepatuhan-ojk.dto");
const update_kepatuhan_ojk_dto_1 = require("./dto/update-kepatuhan-ojk.dto");
let KepatuhanOjkController = class KepatuhanOjkController {
    kepatuhanOjkService;
    constructor(kepatuhanOjkService) {
        this.kepatuhanOjkService = kepatuhanOjkService;
    }
    create(createKepatuhanOjkDto) {
        return this.kepatuhanOjkService.create(createKepatuhanOjkDto);
    }
    findAll() {
        return this.kepatuhanOjkService.findAll();
    }
    findOne(id) {
        return this.kepatuhanOjkService.findOne(+id);
    }
    update(id, updateKepatuhanOjkDto) {
        return this.kepatuhanOjkService.update(+id, updateKepatuhanOjkDto);
    }
    remove(id) {
        return this.kepatuhanOjkService.remove(+id);
    }
};
exports.KepatuhanOjkController = KepatuhanOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kepatuhan_ojk_dto_1.CreateKepatuhanOjkDto]),
    __metadata("design:returntype", void 0)
], KepatuhanOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KepatuhanOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KepatuhanOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kepatuhan_ojk_dto_1.UpdateKepatuhanOjkDto]),
    __metadata("design:returntype", void 0)
], KepatuhanOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KepatuhanOjkController.prototype, "remove", null);
exports.KepatuhanOjkController = KepatuhanOjkController = __decorate([
    (0, common_1.Controller)('kepatuhan-ojk'),
    __metadata("design:paramtypes", [kepatuhan_ojk_service_1.KepatuhanOjkService])
], KepatuhanOjkController);
//# sourceMappingURL=kepatuhan-ojk.controller.js.map