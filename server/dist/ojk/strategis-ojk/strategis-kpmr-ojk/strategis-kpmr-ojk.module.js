"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategisProdukKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const strategis_kpmr_ojk_service_1 = require("./strategis-kpmr-ojk.service");
const strategis_kpmr_ojk_controller_1 = require("./strategis-kpmr-ojk.controller");
const strategis_kpmr_aspek_entity_1 = require("./entities/strategis-kpmr-aspek.entity");
const strategis_kpmr_pertanyaan_entity_1 = require("./entities/strategis-kpmr-pertanyaan.entity");
const strategis_kpmr_ojk_entity_1 = require("./entities/strategis-kpmr-ojk.entity");
let StrategisProdukKpmrModule = class StrategisProdukKpmrModule {
};
exports.StrategisProdukKpmrModule = StrategisProdukKpmrModule;
exports.StrategisProdukKpmrModule = StrategisProdukKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                strategis_kpmr_aspek_entity_1.KpmrAspekStrategis,
                strategis_kpmr_pertanyaan_entity_1.KpmrPertanyaanStrategis,
                strategis_kpmr_ojk_entity_1.KpmrStrategisOjk,
            ]),
        ],
        controllers: [strategis_kpmr_ojk_controller_1.KpmrStrategisController],
        providers: [strategis_kpmr_ojk_service_1.KpmrStrategisService],
        exports: [strategis_kpmr_ojk_service_1.KpmrStrategisService],
    })
], StrategisProdukKpmrModule);
//# sourceMappingURL=strategis-kpmr-ojk.module.js.map