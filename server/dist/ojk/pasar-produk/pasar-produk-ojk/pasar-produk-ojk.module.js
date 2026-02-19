"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasarProdukOjkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pasar_produk_ojk_service_1 = require("./pasar-produk-ojk.service");
const pasar_produk_ojk_controller_1 = require("./pasar-produk-ojk.controller");
const pasar_produk_ojk_entity_1 = require("./entities/pasar-produk-ojk.entity");
const pasar_produk_parameter_entity_1 = require("./entities/pasar-produk-parameter.entity");
const pasar_produk_nilai_entity_1 = require("./entities/pasar-produk-nilai.entity");
const pasar_inherent_refetences_entity_1 = require("./entities/pasar-inherent-refetences.entity");
let PasarProdukOjkModule = class PasarProdukOjkModule {
};
exports.PasarProdukOjkModule = PasarProdukOjkModule;
exports.PasarProdukOjkModule = PasarProdukOjkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                pasar_produk_ojk_entity_1.PasarProdukOjk,
                pasar_produk_parameter_entity_1.PasarParameter,
                pasar_produk_nilai_entity_1.PasarNilai,
                pasar_inherent_refetences_entity_1.InherentReferencePasar,
            ]),
        ],
        controllers: [pasar_produk_ojk_controller_1.PasarProdukOjkController],
        providers: [pasar_produk_ojk_service_1.PasarProdukOjkService],
        exports: [pasar_produk_ojk_service_1.PasarProdukOjkService],
    })
], PasarProdukOjkModule);
//# sourceMappingURL=pasar-produk-ojk.module.js.map