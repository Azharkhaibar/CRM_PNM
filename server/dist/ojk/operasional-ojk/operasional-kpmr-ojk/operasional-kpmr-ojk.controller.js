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
exports.OperasionalKpmrOjkController = void 0;
const common_1 = require("@nestjs/common");
const operasional_kpmr_ojk_service_1 = require("./operasional-kpmr-ojk.service");
const create_operasional_kpmr_ojk_dto_1 = require("./dto/create-operasional-kpmr-ojk.dto");
const update_operasional_kpmr_ojk_dto_1 = require("./dto/update-operasional-kpmr-ojk.dto");
let OperasionalKpmrOjkController = class OperasionalKpmrOjkController {
    operasionalKpmrOjkService;
    constructor(operasionalKpmrOjkService) {
        this.operasionalKpmrOjkService = operasionalKpmrOjkService;
    }
    create(createOperasionalKpmrOjkDto) {
        return this.operasionalKpmrOjkService.create(createOperasionalKpmrOjkDto);
    }
    findAll() {
        return this.operasionalKpmrOjkService.findAll();
    }
    findOne(id) {
        return this.operasionalKpmrOjkService.findOne(+id);
    }
    update(id, updateOperasionalKpmrOjkDto) {
        return this.operasionalKpmrOjkService.update(+id, updateOperasionalKpmrOjkDto);
    }
    remove(id) {
        return this.operasionalKpmrOjkService.remove(+id);
    }
};
exports.OperasionalKpmrOjkController = OperasionalKpmrOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_operasional_kpmr_ojk_dto_1.CreateOperasionalKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], OperasionalKpmrOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperasionalKpmrOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OperasionalKpmrOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_operasional_kpmr_ojk_dto_1.UpdateOperasionalKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], OperasionalKpmrOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OperasionalKpmrOjkController.prototype, "remove", null);
exports.OperasionalKpmrOjkController = OperasionalKpmrOjkController = __decorate([
    (0, common_1.Controller)('operasional-kpmr-ojk'),
    __metadata("design:paramtypes", [operasional_kpmr_ojk_service_1.OperasionalKpmrOjkService])
], OperasionalKpmrOjkController);
//# sourceMappingURL=operasional-kpmr-ojk.controller.js.map