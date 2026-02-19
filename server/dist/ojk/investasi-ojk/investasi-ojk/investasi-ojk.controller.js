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
exports.InvestasiOjkController = void 0;
const common_1 = require("@nestjs/common");
const investasi_ojk_service_1 = require("./investasi-ojk.service");
const create_investasi_ojk_dto_1 = require("./dto/create-investasi-ojk.dto");
const update_investasi_ojk_dto_1 = require("./dto/update-investasi-ojk.dto");
let InvestasiOjkController = class InvestasiOjkController {
    investasiOjkService;
    constructor(investasiOjkService) {
        this.investasiOjkService = investasiOjkService;
    }
    create(createInvestasiOjkDto) {
        return this.investasiOjkService.create(createInvestasiOjkDto);
    }
    findAll() {
        return this.investasiOjkService.findAll();
    }
    findOne(id) {
        return this.investasiOjkService.findOne(+id);
    }
    update(id, updateInvestasiOjkDto) {
        return this.investasiOjkService.update(+id, updateInvestasiOjkDto);
    }
    remove(id) {
        return this.investasiOjkService.remove(+id);
    }
};
exports.InvestasiOjkController = InvestasiOjkController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investasi_ojk_dto_1.CreateInvestasiOjkDto]),
    __metadata("design:returntype", void 0)
], InvestasiOjkController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestasiOjkController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestasiOjkController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_investasi_ojk_dto_1.UpdateInvestasiOjkDto]),
    __metadata("design:returntype", void 0)
], InvestasiOjkController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestasiOjkController.prototype, "remove", null);
exports.InvestasiOjkController = InvestasiOjkController = __decorate([
    (0, common_1.Controller)('investasi-ojk'),
    __metadata("design:paramtypes", [investasi_ojk_service_1.InvestasiOjkService])
], InvestasiOjkController);
//# sourceMappingURL=investasi-ojk.controller.js.map