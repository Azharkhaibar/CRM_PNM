"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmrOperasionalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kpmr_operasional_controller_1 = require("./kpmr-operasional.controller");
const kpmr_operasional_service_1 = require("./kpmr-operasional.service");
const kpmr_operasional_definisi_entity_1 = require("./entities/kpmr-operasional-definisi.entity");
const kpmr_operasional_skor_entity_1 = require("./entities/kpmr-operasional-skor.entity");
const kpmr_operasional_aspek_entity_1 = require("./entities/kpmr-operasional-aspek.entity");
const kpmr_operasional_pertanyaan_entity_1 = require("./entities/kpmr-operasional-pertanyaan.entity");
let KpmrOperasionalModule = class KpmrOperasionalModule {
};
exports.KpmrOperasionalModule = KpmrOperasionalModule;
exports.KpmrOperasionalModule = KpmrOperasionalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                kpmr_operasional_definisi_entity_1.KPMROperasionalDefinition,
                kpmr_operasional_skor_entity_1.KPMROperasionalScore,
                kpmr_operasional_aspek_entity_1.KPMROperasionalAspect,
                kpmr_operasional_pertanyaan_entity_1.KPMROperasionalQuestion,
            ]),
        ],
        controllers: [kpmr_operasional_controller_1.KPMROperasionalController],
        providers: [kpmr_operasional_service_1.KPMROperasionalService],
        exports: [kpmr_operasional_service_1.KPMROperasionalService],
    })
], KpmrOperasionalModule);
//# sourceMappingURL=kpmr-operasional.module.js.map