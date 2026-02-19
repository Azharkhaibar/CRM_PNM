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
exports.RentabilitasKpmrOjkController = void 0;
const common_1 = require("@nestjs/common");
const rentabilitas_kpmr_ojk_service_1 = require("./rentabilitas-kpmr-ojk.service");
const create_rentabilitas_kpmr_ojk_dto_1 = require("./dto/create-rentabilitas-kpmr-ojk.dto");
const update_rentabilitas_kpmr_ojk_dto_1 = require("./dto/update-rentabilitas-kpmr-ojk.dto");
let RentabilitasKpmrOjkController = class RentabilitasKpmrOjkController {
    rentabilitasKpmrOjkService;
    constructor(rentabilitasKpmrOjkService) {
        this.rentabilitasKpmrOjkService = rentabilitasKpmrOjkService;
    }
    create(createRentabilitasKpmrOjkDto) {
        return this.rentabilitasKpmrOjkService.create(createRentabilitasKpmrOjkDto);
    }
    findAll() {
        return this.rentabilitasKpmrOjkService.findAll();
    }
    findOne(id) {
        return this.rentabilitasKpmrOjkService.findOne(+id);
    }
    update(id, updateRentabilitasKpmrOjkDto) {
        return this.rentabilitasKpmrOjkService.update(+id, updateRentabilitasKpmrOjkDto);
    }
    remove(id) {
        return this.rentabilitasKpmrOjkService.remove(+id);
    }
};
exports.RentabilitasKpmrOjkController = RentabilitasKpmrOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rentabilitas_kpmr_ojk_dto_1.CreateRentabilitasKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], RentabilitasKpmrOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RentabilitasKpmrOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RentabilitasKpmrOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rentabilitas_kpmr_ojk_dto_1.UpdateRentabilitasKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], RentabilitasKpmrOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RentabilitasKpmrOjkController.prototype, "remove", null);
exports.RentabilitasKpmrOjkController = RentabilitasKpmrOjkController = __decorate([
    (0, common_1.Controller)('rentabilitas-kpmr-ojk'),
    __metadata("design:paramtypes", [rentabilitas_kpmr_ojk_service_1.RentabilitasKpmrOjkService])
], RentabilitasKpmrOjkController);
//# sourceMappingURL=rentabilitas-kpmr-ojk.controller.js.map