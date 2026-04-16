"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KonsentrasiKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const konsentrasi_kpmr_aspek_entity_1 = require("./entities/konsentrasi-kpmr-aspek.entity");
const konsentrasi_kpmr_pertanyaan_entity_1 = require("./entities/konsentrasi-kpmr-pertanyaan.entity");
const konsentrasi_produk_kpmr_entity_1 = require("./entities/konsentrasi-produk-kpmr.entity");
const konsentrasi_produk_kpmr_controller_1 = require("./konsentrasi-produk-kpmr.controller");
const konsentrasi_produk_kpmr_service_1 = require("./konsentrasi-produk-kpmr.service");
let KonsentrasiKpmrModule = class KonsentrasiKpmrModule {
};
exports.KonsentrasiKpmrModule = KonsentrasiKpmrModule;
exports.KonsentrasiKpmrModule = KonsentrasiKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                konsentrasi_produk_kpmr_entity_1.KpmrKonsentrasiOjk,
                konsentrasi_kpmr_aspek_entity_1.KpmrAspekKonsentrasi,
                konsentrasi_kpmr_pertanyaan_entity_1.KpmrPertanyaanKonsentrasi,
            ]),
        ],
        controllers: [konsentrasi_produk_kpmr_controller_1.KpmrKonsentrasiController],
        providers: [konsentrasi_produk_kpmr_service_1.KpmrKonsentrasiService],
        exports: [konsentrasi_produk_kpmr_service_1.KpmrKonsentrasiService],
    })
], KonsentrasiKpmrModule);
//# sourceMappingURL=konsentrasi-produk-kpmr.module.js.map