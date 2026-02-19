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
exports.KonsentrasiProdukKpmrController = void 0;
const common_1 = require("@nestjs/common");
const konsentrasi_produk_kpmr_service_1 = require("./konsentrasi-produk-kpmr.service");
const create_konsentrasi_produk_kpmr_dto_1 = require("./dto/create-konsentrasi-produk-kpmr.dto");
const update_konsentrasi_produk_kpmr_dto_1 = require("./dto/update-konsentrasi-produk-kpmr.dto");
let KonsentrasiProdukKpmrController = class KonsentrasiProdukKpmrController {
    konsentrasiProdukKpmrService;
    constructor(konsentrasiProdukKpmrService) {
        this.konsentrasiProdukKpmrService = konsentrasiProdukKpmrService;
    }
    create(createKonsentrasiProdukKpmrDto) {
        return this.konsentrasiProdukKpmrService.create(createKonsentrasiProdukKpmrDto);
    }
    findAll() {
        return this.konsentrasiProdukKpmrService.findAll();
    }
    findOne(id) {
        return this.konsentrasiProdukKpmrService.findOne(+id);
    }
    update(id, updateKonsentrasiProdukKpmrDto) {
        return this.konsentrasiProdukKpmrService.update(+id, updateKonsentrasiProdukKpmrDto);
    }
    remove(id) {
        return this.konsentrasiProdukKpmrService.remove(+id);
    }
};
exports.KonsentrasiProdukKpmrController = KonsentrasiProdukKpmrController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_konsentrasi_produk_kpmr_dto_1.CreateKonsentrasiProdukKpmrDto]),
    __metadata("design:returntype", void 0)
], KonsentrasiProdukKpmrController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KonsentrasiProdukKpmrController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KonsentrasiProdukKpmrController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_konsentrasi_produk_kpmr_dto_1.UpdateKonsentrasiProdukKpmrDto]),
    __metadata("design:returntype", void 0)
], KonsentrasiProdukKpmrController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KonsentrasiProdukKpmrController.prototype, "remove", null);
exports.KonsentrasiProdukKpmrController = KonsentrasiProdukKpmrController = __decorate([
    (0, common_1.Controller)('konsentrasi-produk-kpmr'),
    __metadata("design:paramtypes", [konsentrasi_produk_kpmr_service_1.KonsentrasiProdukKpmrService])
], KonsentrasiProdukKpmrController);
//# sourceMappingURL=konsentrasi-produk-kpmr.controller.js.map