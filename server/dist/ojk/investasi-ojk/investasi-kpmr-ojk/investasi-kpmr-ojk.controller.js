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
exports.InvestasiKpmrOjkController = void 0;
const common_1 = require("@nestjs/common");
const investasi_kpmr_ojk_service_1 = require("./investasi-kpmr-ojk.service");
const create_investasi_kpmr_ojk_dto_1 = require("./dto/create-investasi-kpmr-ojk.dto");
const update_investasi_kpmr_ojk_dto_1 = require("./dto/update-investasi-kpmr-ojk.dto");
let InvestasiKpmrOjkController = class InvestasiKpmrOjkController {
    investasiKpmrOjkService;
    constructor(investasiKpmrOjkService) {
        this.investasiKpmrOjkService = investasiKpmrOjkService;
    }
    create(createInvestasiKpmrOjkDto) {
        return this.investasiKpmrOjkService.create(createInvestasiKpmrOjkDto);
    }
    findAll() {
        return this.investasiKpmrOjkService.findAll();
    }
    findOne(id) {
        return this.investasiKpmrOjkService.findOne(+id);
    }
    update(id, updateInvestasiKpmrOjkDto) {
        return this.investasiKpmrOjkService.update(+id, updateInvestasiKpmrOjkDto);
    }
    remove(id) {
        return this.investasiKpmrOjkService.remove(+id);
    }
};
exports.InvestasiKpmrOjkController = InvestasiKpmrOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investasi_kpmr_ojk_dto_1.CreateInvestasiKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], InvestasiKpmrOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestasiKpmrOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestasiKpmrOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_investasi_kpmr_ojk_dto_1.UpdateInvestasiKpmrOjkDto]),
    __metadata("design:returntype", void 0)
], InvestasiKpmrOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestasiKpmrOjkController.prototype, "remove", null);
exports.InvestasiKpmrOjkController = InvestasiKpmrOjkController = __decorate([
    (0, common_1.Controller)('investasi-kpmr-ojk'),
    __metadata("design:paramtypes", [investasi_kpmr_ojk_service_1.InvestasiKpmrOjkService])
], InvestasiKpmrOjkController);
//# sourceMappingURL=investasi-kpmr-ojk.controller.js.map