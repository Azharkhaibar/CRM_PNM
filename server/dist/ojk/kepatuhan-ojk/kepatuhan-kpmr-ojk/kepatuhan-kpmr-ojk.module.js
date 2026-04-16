"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KepatuhanProdukKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kepatuhan_kpmr_ojk_service_1 = require("./kepatuhan-kpmr-ojk.service");
const kepatuhan_kpmr_ojk_controller_1 = require("./kepatuhan-kpmr-ojk.controller");
const kepatuhan_kpmr_aspek_entity_1 = require("./entities/kepatuhan-kpmr-aspek.entity");
const kepatuhan_kpmr_pertanyaan_entity_1 = require("./entities/kepatuhan-kpmr-pertanyaan.entity");
const kepatuhan_kpmr_ojk_entity_1 = require("./entities/kepatuhan-kpmr-ojk.entity");
let KepatuhanProdukKpmrModule = class KepatuhanProdukKpmrModule {
};
exports.KepatuhanProdukKpmrModule = KepatuhanProdukKpmrModule;
exports.KepatuhanProdukKpmrModule = KepatuhanProdukKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                kepatuhan_kpmr_aspek_entity_1.KpmrAspekKepatuhan,
                kepatuhan_kpmr_pertanyaan_entity_1.KpmrPertanyaanKepatuhan,
                kepatuhan_kpmr_ojk_entity_1.KpmrKepatuhanOjk,
            ]),
        ],
        controllers: [kepatuhan_kpmr_ojk_controller_1.KpmrKepatuhanController],
        providers: [kepatuhan_kpmr_ojk_service_1.KpmrKepatuhanService],
        exports: [kepatuhan_kpmr_ojk_service_1.KpmrKepatuhanService],
    })
], KepatuhanProdukKpmrModule);
//# sourceMappingURL=kepatuhan-kpmr-ojk.module.js.map