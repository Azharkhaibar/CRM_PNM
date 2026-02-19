"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KonsentrasiProdukOjkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const konsentrasi_produk_ojk_service_1 = require("./konsentrasi-produk-ojk.service");
const konsentrasi_produk_ojk_controller_1 = require("./konsentrasi-produk-ojk.controller");
const konsentrasi_produk_ojk_entity_1 = require("./entities/konsentrasi-produk-ojk.entity");
const konsentrasi_produk_paramter_entity_1 = require("./entities/konsentrasi-produk-paramter.entity");
const konsentrasi_produk_nilai_entity_1 = require("./entities/konsentrasi-produk-nilai.entity");
const konsentrasi_inherent_references_entity_1 = require("./entities/konsentrasi-inherent-references.entity");
let KonsentrasiProdukOjkModule = class KonsentrasiProdukOjkModule {
};
exports.KonsentrasiProdukOjkModule = KonsentrasiProdukOjkModule;
exports.KonsentrasiProdukOjkModule = KonsentrasiProdukOjkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                konsentrasi_produk_ojk_entity_1.KonsentrasiProdukOjk,
                konsentrasi_produk_paramter_entity_1.KonsentrasiParameter,
                konsentrasi_produk_nilai_entity_1.KonsentrasiNilai,
                konsentrasi_inherent_references_entity_1.InherentReferenceKonsentrasi,
            ]),
        ],
        controllers: [konsentrasi_produk_ojk_controller_1.KonsentrasiProdukOjkController],
        providers: [konsentrasi_produk_ojk_service_1.KonsentrasiProdukOjkService],
        exports: [konsentrasi_produk_ojk_service_1.KonsentrasiProdukOjkService],
    })
], KonsentrasiProdukOjkModule);
//# sourceMappingURL=konsentrasi-produk-ojk.module.js.map