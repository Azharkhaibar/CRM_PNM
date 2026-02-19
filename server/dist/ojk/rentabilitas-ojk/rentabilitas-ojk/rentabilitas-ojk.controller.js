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
exports.RentabilitasOjkController = void 0;
const common_1 = require("@nestjs/common");
const rentabilitas_ojk_service_1 = require("./rentabilitas-ojk.service");
const create_rentabilitas_ojk_dto_1 = require("./dto/create-rentabilitas-ojk.dto");
const update_rentabilitas_ojk_dto_1 = require("./dto/update-rentabilitas-ojk.dto");
let RentabilitasOjkController = class RentabilitasOjkController {
    rentabilitasOjkService;
    constructor(rentabilitasOjkService) {
        this.rentabilitasOjkService = rentabilitasOjkService;
    }
    create(createRentabilitasOjkDto) {
        return this.rentabilitasOjkService.create(createRentabilitasOjkDto);
    }
    findAll() {
        return this.rentabilitasOjkService.findAll();
    }
    findOne(id) {
        return this.rentabilitasOjkService.findOne(+id);
    }
    update(id, updateRentabilitasOjkDto) {
        return this.rentabilitasOjkService.update(+id, updateRentabilitasOjkDto);
    }
    remove(id) {
        return this.rentabilitasOjkService.remove(+id);
    }
};
exports.RentabilitasOjkController = RentabilitasOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rentabilitas_ojk_dto_1.CreateRentabilitasOjkDto]),
    __metadata("design:returntype", void 0)
], RentabilitasOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RentabilitasOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RentabilitasOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rentabilitas_ojk_dto_1.UpdateRentabilitasOjkDto]),
    __metadata("design:returntype", void 0)
], RentabilitasOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RentabilitasOjkController.prototype, "remove", null);
exports.RentabilitasOjkController = RentabilitasOjkController = __decorate([
    (0, common_1.Controller)('rentabilitas-ojk'),
    __metadata("design:paramtypes", [rentabilitas_ojk_service_1.RentabilitasOjkService])
], RentabilitasOjkController);
//# sourceMappingURL=rentabilitas-ojk.controller.js.map