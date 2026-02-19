"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KreditProdukOjkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kredit_produk_ojk_service_1 = require("./kredit-produk-ojk.service");
const kredit_produk_ojk_controller_1 = require("./kredit-produk-ojk.controller");
const kredit_produk_ojk_entity_1 = require("./entities/kredit-produk-ojk.entity");
const kredit_produk_parameter_entity_1 = require("./entities/kredit-produk-parameter.entity");
const kredit_produk_nilai_entity_1 = require("./entities/kredit-produk-nilai.entity");
const kredit_inherent_references_entity_1 = require("./entities/kredit-inherent-references.entity");
let KreditProdukOjkModule = class KreditProdukOjkModule {
};
exports.KreditProdukOjkModule = KreditProdukOjkModule;
exports.KreditProdukOjkModule = KreditProdukOjkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                kredit_produk_ojk_entity_1.KreditProdukOjk,
                kredit_produk_parameter_entity_1.KreditParameter,
                kredit_produk_nilai_entity_1.KreditNilai,
                kredit_inherent_references_entity_1.InherentReferenceKredit,
            ]),
        ],
        controllers: [kredit_produk_ojk_controller_1.KreditProdukOjkController],
        providers: [kredit_produk_ojk_service_1.KreditProdukOjkService],
        exports: [kredit_produk_ojk_service_1.KreditProdukOjkService],
    })
], KreditProdukOjkModule);
//# sourceMappingURL=kredit-produk-ojk.module.js.map