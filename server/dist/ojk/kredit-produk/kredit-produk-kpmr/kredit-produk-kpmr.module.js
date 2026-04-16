"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KreditProdukKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kredit_produk_kpmr_service_1 = require("./kredit-produk-kpmr.service");
const kredit_produk_kpmr_controller_1 = require("./kredit-produk-kpmr.controller");
const kredit_kpmr_aspek_entity_1 = require("./entities/kredit-kpmr-aspek.entity");
const kredit_kpmr_pertanyaan_entity_1 = require("./entities/kredit-kpmr-pertanyaan.entity");
const kredit_produk_kpmr_entity_1 = require("./entities/kredit-produk-kpmr.entity");
let KreditProdukKpmrModule = class KreditProdukKpmrModule {
};
exports.KreditProdukKpmrModule = KreditProdukKpmrModule;
exports.KreditProdukKpmrModule = KreditProdukKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                kredit_kpmr_aspek_entity_1.KpmrAspekKredit,
                kredit_kpmr_pertanyaan_entity_1.KpmrPertanyaanKredit,
                kredit_produk_kpmr_entity_1.KpmrKreditOjk,
            ]),
        ],
        controllers: [kredit_produk_kpmr_controller_1.KpmrKreditController],
        providers: [kredit_produk_kpmr_service_1.KpmrKreditService],
        exports: [kredit_produk_kpmr_service_1.KpmrKreditService],
    })
], KreditProdukKpmrModule);
//# sourceMappingURL=kredit-produk-kpmr.module.js.map