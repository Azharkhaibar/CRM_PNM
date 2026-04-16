"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HukumKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hukum_kpmr_aspek_entity_1 = require("./entities/hukum-kpmr-aspek.entity");
const hukum_kpmr_pertanyaan_entity_1 = require("./entities/hukum-kpmr-pertanyaan.entity");
const hukum_kpmr_ojk_entity_1 = require("./entities/hukum-kpmr-ojk.entity");
const hukum_kpmr_ojk_controller_1 = require("./hukum-kpmr-ojk.controller");
const hukum_kpmr_ojk_service_1 = require("./hukum-kpmr-ojk.service");
let HukumKpmrModule = class HukumKpmrModule {
};
exports.HukumKpmrModule = HukumKpmrModule;
exports.HukumKpmrModule = HukumKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([hukum_kpmr_ojk_entity_1.KpmrHukum, hukum_kpmr_aspek_entity_1.KpmrAspekHukum, hukum_kpmr_pertanyaan_entity_1.KpmrPertanyaanHukum]),
        ],
        controllers: [hukum_kpmr_ojk_controller_1.KpmrHukumController],
        providers: [hukum_kpmr_ojk_service_1.KpmrHukumService],
        exports: [hukum_kpmr_ojk_service_1.KpmrHukumService],
    })
], HukumKpmrModule);
//# sourceMappingURL=hukum-kpmr-ojk.module.js.map