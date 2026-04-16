"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputasiProdukKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reputasi_kpmr_ojk_service_1 = require("./reputasi-kpmr-ojk.service");
const reputasi_kpmr_ojk_controller_1 = require("./reputasi-kpmr-ojk.controller");
const reputasi_kpmr_aspek_entity_1 = require("./entities/reputasi-kpmr-aspek.entity");
const reputasi_kpmr_pertanyaan_entity_1 = require("./entities/reputasi-kpmr-pertanyaan.entity");
const reputasi_kpmr_ojk_entity_1 = require("./entities/reputasi-kpmr-ojk.entity");
let ReputasiProdukKpmrModule = class ReputasiProdukKpmrModule {
};
exports.ReputasiProdukKpmrModule = ReputasiProdukKpmrModule;
exports.ReputasiProdukKpmrModule = ReputasiProdukKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                reputasi_kpmr_aspek_entity_1.KpmrAspekReputasi,
                reputasi_kpmr_pertanyaan_entity_1.KpmrPertanyaanReputasi,
                reputasi_kpmr_ojk_entity_1.KpmrReputasiOjk,
            ]),
        ],
        controllers: [reputasi_kpmr_ojk_controller_1.KpmrReputasiController],
        providers: [reputasi_kpmr_ojk_service_1.KpmrReputasiService],
        exports: [reputasi_kpmr_ojk_service_1.KpmrReputasiService],
    })
], ReputasiProdukKpmrModule);
//# sourceMappingURL=reputasi-kpmr-ojk.module.js.map