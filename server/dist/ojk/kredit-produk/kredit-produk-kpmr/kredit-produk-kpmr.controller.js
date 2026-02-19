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
exports.KreditProdukKpmrController = void 0;
const common_1 = require("@nestjs/common");
const kredit_produk_kpmr_service_1 = require("./kredit-produk-kpmr.service");
const create_kredit_produk_kpmr_dto_1 = require("./dto/create-kredit-produk-kpmr.dto");
const update_kredit_produk_kpmr_dto_1 = require("./dto/update-kredit-produk-kpmr.dto");
let KreditProdukKpmrController = class KreditProdukKpmrController {
    kreditProdukKpmrService;
    constructor(kreditProdukKpmrService) {
        this.kreditProdukKpmrService = kreditProdukKpmrService;
    }
    create(createKreditProdukKpmrDto) {
        return this.kreditProdukKpmrService.create(createKreditProdukKpmrDto);
    }
    findAll() {
        return this.kreditProdukKpmrService.findAll();
    }
    findOne(id) {
        return this.kreditProdukKpmrService.findOne(+id);
    }
    update(id, updateKreditProdukKpmrDto) {
        return this.kreditProdukKpmrService.update(+id, updateKreditProdukKpmrDto);
    }
    remove(id) {
        return this.kreditProdukKpmrService.remove(+id);
    }
};
exports.KreditProdukKpmrController = KreditProdukKpmrController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kredit_produk_kpmr_dto_1.CreateKreditProdukKpmrDto]),
    __metadata("design:returntype", void 0)
], KreditProdukKpmrController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KreditProdukKpmrController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KreditProdukKpmrController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kredit_produk_kpmr_dto_1.UpdateKreditProdukKpmrDto]),
    __metadata("design:returntype", void 0)
], KreditProdukKpmrController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KreditProdukKpmrController.prototype, "remove", null);
exports.KreditProdukKpmrController = KreditProdukKpmrController = __decorate([
    (0, common_1.Controller)('kredit-produk-kpmr'),
    __metadata("design:paramtypes", [kredit_produk_kpmr_service_1.KreditProdukKpmrService])
], KreditProdukKpmrController);
//# sourceMappingURL=kredit-produk-kpmr.controller.js.map