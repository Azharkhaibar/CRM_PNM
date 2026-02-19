"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasarProdukKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pasar_produk_kpmr_service_1 = require("./pasar-produk-kpmr.service");
const pasar_produk_kpmr_controller_1 = require("./pasar-produk-kpmr.controller");
const pasar_produk_ojk_entity_1 = require("./entities/pasar-produk-ojk.entity");
const pasar_produk_kpmr_aspek_entity_1 = require("./entities/pasar-produk-kpmr-aspek.entity");
const pasar_produk_kpmr_pertanyaan_entity_1 = require("./entities/pasar-produk-kpmr-pertanyaan.entity");
const pasar_produk_ojk_module_1 = require("../pasar-produk-ojk/pasar-produk-ojk.module");
let PasarProdukKpmrModule = class PasarProdukKpmrModule {
};
exports.PasarProdukKpmrModule = PasarProdukKpmrModule;
exports.PasarProdukKpmrModule = PasarProdukKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                pasar_produk_ojk_entity_1.KpmrPasarOjk,
                pasar_produk_kpmr_aspek_entity_1.KpmrAspekPasar,
                pasar_produk_kpmr_pertanyaan_entity_1.KpmrPertanyaanPasar,
                PasarProdukKpmrModule,
                pasar_produk_ojk_module_1.PasarProdukOjkModule,
            ]),
        ],
        controllers: [pasar_produk_kpmr_controller_1.KpmrPasarController],
        providers: [pasar_produk_kpmr_service_1.KpmrPasarService],
        exports: [pasar_produk_kpmr_service_1.KpmrPasarService],
    })
], PasarProdukKpmrModule);
//# sourceMappingURL=pasar-produk-kpmr.module.js.map